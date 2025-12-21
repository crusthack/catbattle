"use client";

import { useMemo } from "react";
import type { Cat } from "@/types/cat";
import { TARGET_KO, AFFECT_KO, ABILITY_KO, toKo } from "@/lib/translationMaps";
import Card from "@/components/ui/card";
import { Zap, Shield } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  LabelList,
} from "recharts";
import SummaryRow from "./SummaryRow";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444"];

export default function AlliesCharts({ cats }: { cats: Cat[] }) {
  const allyStats = useMemo(() => {
    const rarityCount = cats.reduce<Record<string, number>>((acc, c) => {
      acc[c.Rarity] = (acc[c.Rarity] || 0) + 1;
      return acc;
    }, {});

    const targetCount = cats.reduce<Record<string, number>>((acc, c) => {
      for (const t of c.Targets) acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    const abilityCount = cats.reduce<Record<string, number>>((acc, c) => {
      for (const a of c.Abilities) acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});

    const rarityData = Object.entries(rarityCount).map(([name, value]) => ({ name, value, percentage: (((value || 0) / Math.max(1, cats.length)) * 100).toFixed(1) }));

    const rarityAgg = cats.reduce<Record<string, { count: number; hp: number; atk: number; range: number }>>((acc, c) => {
      const r = c.Rarity || "기타";
      if (!acc[r]) acc[r] = { count: 0, hp: 0, atk: 0, range: 0 };
      acc[r].count++;
      acc[r].hp += c.Hp;
      acc[r].atk += c.Atk;
      acc[r].range += c.Range;
      return acc;
    }, {});
    const rarityAvg = Object.entries(rarityAgg).map(([name, v]) => ({
      name,
      hp: Math.round(v.hp / Math.max(1, v.count)),
      atk: Math.round(v.atk / Math.max(1, v.count)),
      range: Math.round(v.range / Math.max(1, v.count)),
    }));

    const targetData = Object.entries(targetCount).map(([name, value]) => ({ name: toKo(TARGET_KO, name), value }));
    const abilityData = Object.entries(abilityCount).map(([name, value]) => ({ name: toKo(ABILITY_KO, name), value }));

    const affectCount = cats.reduce<Record<string, number>>((acc, c) => {
      for (const a of c.Affects) acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});
    const affectsData = Object.entries(affectCount).map(([name, value]) => ({ name: toKo(AFFECT_KO, name), value }));

    const topAttackers = [...cats]
      .sort((a, b) => b.Atk - a.Atk)
      .slice(0, 10)
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, attack: c.Atk, range: c.Range }));

    const topTanks = [...cats]
      .sort((a, b) => b.Hp - a.Hp)
      .slice(0, 10)
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, hp: c.Hp, price: c.Price }));

    const topSpeed = [...cats]
      .sort((a, b) => b.Speed - a.Speed)
      .slice(0, 10)
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, speed: c.Speed }));

    const topRange = [...cats]
      .sort((a, b) => b.Range - a.Range)
      .slice(0, 10)
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, range: c.Range }));

    const cheapestCost = cats
      .filter((c) => c.Price > 10)
      .sort((a, b) => a.Price - b.Price)
      .slice(0, 10)
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, price: c.Price }));

    const highestCost = [...cats]
      .sort((a, b) => b.Price - a.Price)
      .slice(0, 10)
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, price: c.Price }));

  const rangeDist = bucketize(cats.map((c) => c.Range), [150, 300, 450, 600], ["<150", "150-299", "300-449", "450-599", "600+"]);
  // Use TotalAttackFrame (pre + post + tba - 1) converted to seconds (fallback to Tba).
  // Build dynamic 1s buckets AND keep member names for tooltip.
  const tbaDist = bucketizeCatsBySecond(cats, 1);

    // Attack delay (sec) TOP 10s (shortest/longest)
    const withDelay = cats
      .map((c) => ({ name: `${c.Name} (${c.Form}진)`, delay: ((c.TotalAttackFrame ?? c.Tba ?? 0) as number) / 30 }))
      .filter((e) => e.delay > 0);
    const longestDelayTop = [...withDelay].sort((a, b) => b.delay - a.delay).slice(0, 10);
    const shortestDelayTop = [...withDelay].sort((a, b) => a.delay - b.delay).slice(0, 10);

    const avg = {
      hp: Math.round(cats.reduce((s, c) => s + (c.Hp || 0), 0) / Math.max(1, cats.length)),
      atk: Math.round(cats.reduce((s, c) => s + (c.Atk || 0), 0) / Math.max(1, cats.length)),
      range: Math.round(cats.reduce((s, c) => s + (c.Range || 0), 0) / Math.max(1, cats.length)),
      price: Math.round(cats.reduce((s, c) => s + (c.Price || 0), 0) / Math.max(1, cats.length)),
    };

  return { total: cats.length, rarityData, targetData, abilityData, affectsData, rarityAvg, topAttackers, topTanks, topSpeed, topRange, cheapestCost, highestCost, rangeDist, tbaDist, longestDelayTop, shortestDelayTop, avg };
  }, [cats]);

  return (
    <div className="space-y-6">
      <SummaryRow items={[
        { label: "총 캐릭터(진화 포함)", value: `${allyStats.total} 마리` },
        { label: "평균 HP", value: allyStats.avg.hp.toLocaleString() },
        { label: "평균 공격력", value: allyStats.avg.atk.toLocaleString() },
        { label: "평균 사거리", value: String(allyStats.avg.range) },
        { label: "평균 비용", value: allyStats.avg.price.toLocaleString() },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2">레어도 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={allyStats.rarityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => `${e.name} (${e.percentage}%)`}>
                {allyStats.rarityData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">타겟 속성</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.targetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" fill="#f97316" name="수">
                <LabelList dataKey="value" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">레어도별 평균 스탯</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={allyStats.rarityAvg}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Legend />
              <Bar dataKey="hp" fill="#3b82f6" name="평균 HP">
                <LabelList dataKey="hp" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
              <Bar dataKey="atk" fill="#f97316" name="평균 공격력">
                <LabelList dataKey="atk" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500"/>공격력 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.topAttackers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={['dataMin - 1000', 'dataMax + 1000']} />
              <YAxis dataKey="name" type="category" width={170} interval={0}/>
              <RTooltip />
              <Bar dataKey="attack" fill="#f97316" name="공격력">
                <LabelList dataKey="attack" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-500"/>HP TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.topTanks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={['dataMin - 1000', 'dataMax + 1000']} />
              <YAxis dataKey="name" type="category" width={170} interval={0} />
              <RTooltip />
              <Bar dataKey="hp" fill="#3b82f6" name="HP">
                <LabelList dataKey="hp" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">특수 능력</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.abilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" fill="#10b981" name="수">
                <LabelList dataKey="value" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">효과(상태이상) 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.affectsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" fill="#22c55e" name="수">
                <LabelList dataKey="value" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">이동속도 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.topSpeed} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={['dataMin - 10', 'dataMax + 10']} />
              <YAxis dataKey="name" type="category" width={180} interval={0}/>
              <RTooltip />
              <Bar dataKey="speed" fill="#06b6d4" name="속도">
                <LabelList dataKey="speed" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">사거리 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.topRange} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={['dataMin - 1000', 'dataMax + 1000']} />
              <YAxis dataKey="name" type="category" width={140} />
              <RTooltip />
              <Bar dataKey="range" fill="#9333ea" name="사거리">
                <LabelList dataKey="range" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">저비용 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.cheapestCost} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 10']} />
              <YAxis dataKey="name" type="category" width={140} interval={0} />
              <RTooltip />
              <Bar dataKey="price" fill="#84cc16" name="비용">
                <LabelList dataKey="price" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">고비용 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.highestCost} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={['dataMin - 1000', 'dataMax + 300']} />
              <YAxis dataKey="name" type="category" width={180} interval={0}/>
              <RTooltip />
              <Bar dataKey="price" fill="#ef4444" name="비용">
                <LabelList dataKey="price" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">사거리 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.rangeDist}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="count" fill="#60a5fa" name="수">
                <LabelList dataKey="count" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

    <Card>
          <h3 className="text-lg font-semibold mb-2">공격 딜레이(초) 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.tbaDist}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bucket" />
              <YAxis />
      <RTooltip content={<AttackIntervalTooltip />} />
              <Bar dataKey="count" fill="#f59e0b" name="수">
                <LabelList dataKey="count" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold mb-4">공격 딜레이(초) 긴 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.longestDelayTop} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 320]} />
              <YAxis dataKey="name" type="category" width={200} interval={0} />
              <RTooltip />
              <Bar dataKey="delay" fill="#f59e0b" name="딜레이(초)">
                <LabelList dataKey="delay" position="right" formatter={(v: number) => `${(typeof v === 'number' ? v : Number(v)).toFixed(2)}s`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">공격 딜레이(초) 짧은 TOP 10</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allyStats.shortestDelayTop} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 1]} />
              <YAxis dataKey="name" type="category" width={200} interval={0} />
              <RTooltip />
              <Bar dataKey="delay" fill="#fb923c" name="딜레이(초)">
                <LabelList dataKey="delay" position="right" formatter={(v: number) => `${(typeof v === 'number' ? v : Number(v)).toFixed(2)}s`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}

function bucketize(values: number[], cuts: number[], labels: string[]) {
  const counts = new Array(labels.length).fill(0);
  for (const v of values) {
    let i = 0;
    while (i < cuts.length && v >= cuts[i]) i++;
    counts[i]++;
  }
  return labels.map((bucket, idx) => ({ bucket, count: counts[idx] }));
}

// Dynamic 1-second buckets for histogram
function bucketizeBySecond(values: number[], stepSec = 1) {
  if (!values.length) return [] as Array<{ bucket: string; count: number }>;
  const min = Math.floor(Math.min(...values));
  const max = Math.ceil(Math.max(...values));
  const start = Math.max(0, min);
  const end = Math.max(start + stepSec, max);
  const bins: Array<{ bucket: string; count: number }> = [];
  for (let s = start; s < end; s += stepSec) {
    const e = s + stepSec;
    const count = values.reduce((acc, v) => acc + (v >= s && v < e ? 1 : 0), 0);
    if (count > 0) bins.push({ bucket: `${s}-${e}s`, count });
  }
  return bins;
}

// Like bucketizeBySecond, but also aggregates cat names per bin for rich tooltips
function bucketizeCatsBySecond(cats: Cat[], stepSec = 1) {
  const items = cats
    .map((c) => ({ name: `${c.Name} (${c.Form}진)`, sec: ((c.TotalAttackFrame ?? c.Tba ?? 0) as number) / 30 }))
    .filter((e) => e.sec > 0);
  if (!items.length) return [] as Array<{ bucket: string; count: number; names: string[] }>;

  const min = Math.floor(Math.min(...items.map((e) => e.sec)));
  const max = Math.ceil(Math.max(...items.map((e) => e.sec)));
  const start = Math.max(0, min);
  const end = Math.max(start + stepSec, max);

  const map: Record<string, string[]> = {};
  for (let s = start; s < end; s += stepSec) {
    const key = `${s}-${s + stepSec}s`;
    map[key] = [];
  }
  for (const e of items) {
    const lower = Math.min(Math.max(Math.floor(e.sec / stepSec) * stepSec, start), end - stepSec);
    const key = `${lower}-${lower + stepSec}s`;
    (map[key] ||= []).push(e.name);
  }

  return Object.entries(map)
    .map(([bucket, names]) => ({ bucket, count: names.length, names }))
    .filter((b) => b.count > 0)
    .sort((a, b) => parseFloat(a.bucket) - parseFloat(b.bucket));
}

// Custom tooltip for attack-interval histogram: show up to 3 names
function AttackIntervalTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0]?.payload as { bucket: string; count: number; names?: string[] };
  if (!p) return null;
  const names = p.names ?? [];
  const shown = names.slice(0, 3);
  const more = names.length > 3;
  return (
    <div className="rounded-md border bg-white p-2 shadow text-xs">
      <div className="text-sm font-medium">구간: {label}</div>
      <div className="mt-0.5">수: {p.count}</div>
      {shown.length > 0 && (
        <div className="mt-1">
          <span>
            {shown.join(", ")}
            {more ? ", ..." : ""}
          </span>
        </div>
      )}
    </div>
  );
}
