"use client";

import { useMemo, useState, useCallback } from "react";
import type { Enemy } from "@/types/enemy";
import { TARGET_KO, AFFECT_KO, ABILITY_KO, toKo } from "@/lib/translationMaps";
import Card from "@/components/ui/card";
import { Zap, Shield } from "lucide-react";
import GenericFilter from "@/components/common/GenericFilter";
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
  ScatterChart,
  Scatter,
  ZAxis,
  LabelList,
} from "recharts";
import SummaryRow from "./SummaryRow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444"];

export default function EnemiesCharts({ enemies }: { enemies: Enemy[] }) {
  // Independent filter states per TOP10 chart
  const [hpSelected, setHpSelected] = useState<string[]>(["all"]);
  const [hpMode, setHpMode] = useState<"OR" | "AND">("OR");

  const [atkSelected, setAtkSelected] = useState<string[]>(["all"]);
  const [atkMode, setAtkMode] = useState<"OR" | "AND">("OR");

  const [spdSelected, setSpdSelected] = useState<string[]>(["all"]);
  const [spdMode, setSpdMode] = useState<"OR" | "AND">("OR");

  const [rngSelected, setRngSelected] = useState<string[]>(["all"]);
  const [rngMode, setRngMode] = useState<"OR" | "AND">("OR");

  const makeToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
      (value: string) => {
        setter((prev) => {
          if (value === "all") return ["all"];
          const withoutAll = prev.filter((v) => v !== "all");
          if (withoutAll.includes(value)) {
            const next = withoutAll.filter((v) => v !== value);
            return next.length === 0 ? ["all"] : next;
          }
          return [...withoutAll, value];
        });
      },
    []
  );

  const ATTR_OPTIONS = useMemo(
    () => [
      { value: "all", label: "전체", color: "gray" },
      { value: "None", label: "없음", color: "gray" },
      { value: "Red", label: "빨간적", color: "red" },
      { value: "Floating", label: "떠있는적", color: "green" },
      { value: "Black", label: "검은적", color: "black" },
      { value: "Metal", label: "메탈적", color: "slate" },
      { value: "Angel", label: "천사", color: "yellow" },
      { value: "Alien", label: "에이리언", color: "sky" },
      { value: "Zombie", label: "좀비", color: "purple" },
      { value: "Relic", label: "고대종", color: "emerald" },
      { value: "Demon", label: "악마", color: "blue-900" },
      { value: "White", label: "무속성", color: "stone" },
    ],
    []
  );

  // Metric selector for trait-based chart
  const [traitMetric, setTraitMetric] = useState<"atk" | "speed" | "hp" | "range">("atk");

  const traitMetricData = useMemo(() => {
    const getVal = (e: Enemy) =>
      traitMetric === "atk" ? e.Atk : traitMetric === "speed" ? e.Speed : traitMetric === "hp" ? e.Hp : e.Range;

    const acc: Record<string, { sum: number; count: number; items: { name: string; val: number }[] }>
      = {};
    for (const e of enemies) {
      const val = getVal(e) || 0;
      const targets = Array.isArray(e.Targets) && e.Targets.length > 0 ? e.Targets : ["None" as any];
      for (const t of targets) {
        if (!acc[t]) acc[t] = { sum: 0, count: 0, items: [] };
        acc[t].sum += val;
        acc[t].count += 1;
        acc[t].items.push({ name: e.Name, val });
      }
    }

    const rows = Object.entries(acc).map(([trait, { sum, count, items }]) => {
      items.sort((a, b) => b.val - a.val);
      const examples = items.slice(0, 5).map((x) => x.name);
      return {
        trait,
        name: trait === "None" ? "없음" : toKo(TARGET_KO, trait),
        avg: Math.round(sum / Math.max(1, count)),
        count,
        examples,
      };
    });
    rows.sort((a, b) => b.avg - a.avg);
    return rows;
  }, [enemies, traitMetric]);

  // Helper to filter by attributes with mode and None/전체 handling
  const filterByAttributes = useCallback((source: Enemy[], selected: string[], mode: "OR" | "AND") => {
    if (selected.includes("all")) return source;
    const hasNone = selected.includes("None");
    const selectedWithoutNone = selected.filter((a) => a !== "None");

    return source.filter((e) => {
      const targets = Array.isArray(e.Targets) ? e.Targets : [];
      if (hasNone) {
        if (mode === "OR") {
          return (
            targets.length === 0 ||
            (selectedWithoutNone.length > 0 && selectedWithoutNone.some((v) => targets.includes(v as any)))
          );
        }
        return selectedWithoutNone.length === 0 && targets.length === 0;
      }
      return mode === "OR"
        ? selectedWithoutNone.some((v) => targets.includes(v as any))
        : selectedWithoutNone.every((v) => targets.includes(v as any));
    });
  }, []);

  const enemyStats = useMemo(() => {
    const traitCount = enemies.reduce<Record<string, number>>((acc, e) => {
      for (const t of e.Targets) acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    const traitData = Object.entries(traitCount).map(([name, value]) => ({ name: toKo(TARGET_KO, name), value, percentage: (((value || 0) / Math.max(1, enemies.length)) * 100).toFixed(1) }));

    const topBosses = [...enemies]
      .sort((a, b) => b.Hp - a.Hp)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, hp: e.Hp, attack: e.Atk }));

    const strongestAttackers = [...enemies]
      .sort((a, b) => b.Atk - a.Atk)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, attack: e.Atk, range: e.Range }));

    const topSpeed = [...enemies]
      .sort((a, b) => b.Speed - a.Speed)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, speed: e.Speed }));

    const topRange = [...enemies]
      .sort((a, b) => b.Range - a.Range)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, range: e.Range }));

    const affectCountE = enemies.reduce<Record<string, number>>((acc, e) => {
      for (const a of e.Affects) acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});
    const affectsData = Object.entries(affectCountE).map(([name, value]) => ({ name: toKo(AFFECT_KO, name), value }));

    const abilityCountE = enemies.reduce<Record<string, number>>((acc, e) => {
      for (const a of e.Abilities) acc[a] = (acc[a] || 0) + 1;
      return acc;
    }, {});
    const abilityData = Object.entries(abilityCountE).map(([name, value]) => ({ name: toKo(ABILITY_KO, name), value }));

    const avg = {
      hp: Math.round(enemies.reduce((s, e) => s + (e.Hp || 0), 0) / Math.max(1, enemies.length)),
      atk: Math.round(enemies.reduce((s, e) => s + (e.Atk || 0), 0) / Math.max(1, enemies.length)),
      range: Math.round(enemies.reduce((s, e) => s + (e.Range || 0), 0) / Math.max(1, enemies.length)),
      speed: Math.round(enemies.reduce((s, e) => s + (e.Speed || 0), 0) / Math.max(1, enemies.length)),
    };

    const scatter = enemies
      .filter((e) => e.Range > 0 && e.Atk > 0 && e.Hp > 0)
      .sort((a, b) => b.Atk - a.Atk)
      .slice(0, 150)
      .map((e) => ({ name: e.Name, x: e.Range, y: e.Atk, z: e.Hp }));
    return { total: enemies.length, traitData, topBosses, strongestAttackers, topSpeed, topRange, affectsData, abilityData, scatter, avg };
  }, [enemies]);

  // Per-chart TOP10 with independent filters
  const hpTop = useMemo(() => {
    const base = filterByAttributes(enemies, hpSelected, hpMode);
    return [...base]
      .sort((a, b) => b.Hp - a.Hp)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, hp: e.Hp, attack: e.Atk }));
  }, [enemies, filterByAttributes, hpSelected, hpMode]);

  const atkTop = useMemo(() => {
    const base = filterByAttributes(enemies, atkSelected, atkMode);
    return [...base]
      .sort((a, b) => b.Atk - a.Atk)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, attack: e.Atk, range: e.Range }));
  }, [enemies, filterByAttributes, atkSelected, atkMode]);

  const spdTop = useMemo(() => {
    const base = filterByAttributes(enemies, spdSelected, spdMode);
    return [...base]
      .sort((a, b) => b.Speed - a.Speed)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, speed: e.Speed }));
  }, [enemies, filterByAttributes, spdSelected, spdMode]);

  const rngTop = useMemo(() => {
    const base = filterByAttributes(enemies, rngSelected, rngMode);
    return [...base]
      .sort((a, b) => b.Range - a.Range)
      .slice(0, 10)
      .map((e) => ({ name: e.Name, range: e.Range }));
  }, [enemies, filterByAttributes, rngSelected, rngMode]);

  return (
    <div className="space-y-6">
      <SummaryRow items={[
        { label: "총 적 캐릭터", value: `${enemyStats.total} 마리` },
        { label: "평균 HP", value: enemyStats.avg.hp.toLocaleString() },
        { label: "평균 공격력", value: enemyStats.avg.atk.toLocaleString() },
        { label: "평균 사거리", value: String(enemyStats.avg.range) },
        { label: "평균 이동속도", value: String(enemyStats.avg.speed) },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trait-based metric chart (spans 2 columns) */}
        <Card className="md:col-span-2">
          <div className="w-full flex items-center justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold">속성별 평균 값</h3>
            <Tabs value={traitMetric} onValueChange={(v) => setTraitMetric(v as any)}>
              <TabsList>
                <TabsTrigger value="atk">공격력</TabsTrigger>
                <TabsTrigger value="speed">이동속도</TabsTrigger>
                <TabsTrigger value="hp">체력</TabsTrigger>
                <TabsTrigger value="range">사거리</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={traitMetricData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis />
              <RTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = (payload[0] as any).payload as { name: string; avg: number; count: number; examples?: string[] };
                  const metricLabel = traitMetric === "atk" ? "공격력" : traitMetric === "speed" ? "이동속도" : traitMetric === "hp" ? "체력" : "사거리";
                  return (
                    <div className="rounded-md bg-white/90 dark:bg-neutral-900/90 shadow px-3 py-2 text-sm">
                      <div className="font-medium mb-1">{d?.name}</div>
                      <div>{metricLabel} 평균: {d?.avg?.toLocaleString?.() ?? d?.avg}</div>
                      <div>개수: {d?.count?.toLocaleString?.() ?? d?.count}</div>
                      {Array.isArray(d?.examples) && d.examples.length > 0 && (
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                          상위 예시: {d.examples.slice(0, 5).join(", ")}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Bar dataKey="avg" name="평균">
                {traitMetricData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
                <LabelList dataKey="avg" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-2">속성 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={enemyStats.traitData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => `${e.name} (${e.percentage}%)`}>
                {enemyStats.traitData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

                <Card>
          <h3 className="text-lg font-semibold mb-4">사거리 vs 공격력 (크기=HP)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="사거리" domain={['dataMin - 1000', 'dataMax + 1000']} />
              <YAxis type="number" dataKey="y" name="공격력" />
              <ZAxis type="number" dataKey="z" range={[60, 400]} name="HP" />
              <RTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = (payload[0] as any).payload as { name: string; x: number; y: number; z: number };
                  return (
                    <div className="rounded-md bg-white/90 dark:bg-neutral-900/90 shadow px-3 py-2 text-sm">
                      <div className="font-medium mb-1">{p?.name}</div>
                      <div>사거리: {p?.x}</div>
                      <div>공격력: {p?.y?.toLocaleString?.() ?? p?.y}</div>
                      <div>체력: {p?.z?.toLocaleString?.() ?? p?.z}</div>
                    </div>
                  );
                }}
              />
              <Scatter data={enemyStats.scatter} fill="#14b8a6" />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-red-500"/>HP TOP 10</h3>
          <div className="mb-3">
            <GenericFilter
              title="속성 필터"
              options={ATTR_OPTIONS}
              selected={hpSelected}
              onSelect={makeToggle(setHpSelected)}
              filterMode={hpMode}
              onModeChange={setHpMode}
              showModeToggle
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hpTop} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 1000000']} />
              <YAxis dataKey="name" type="category" width={170} interval={0}/>
              <RTooltip />
              <Bar dataKey="hp" fill="#ef4444" name="HP">
                <LabelList dataKey="hp" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500"/>공격력 TOP 10</h3>
          <div className="mb-3">
            <GenericFilter
              title="속성 필터"
              options={ATTR_OPTIONS}
              selected={atkSelected}
              onSelect={makeToggle(setAtkSelected)}
              filterMode={atkMode}
              onModeChange={setAtkMode}
              showModeToggle
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={atkTop} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 20000']} />
              <YAxis dataKey="name" type="category" width={140} interval={0}/>
              <RTooltip />
              <Bar dataKey="attack" fill="#f97316" name="공격력">
                <LabelList dataKey="attack" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">이동속도 TOP 10</h3>
          <div className="mb-3">
            <GenericFilter
              title="속성 필터"
              options={ATTR_OPTIONS}
              selected={spdSelected}
              onSelect={makeToggle(setSpdSelected)}
              filterMode={spdMode}
              onModeChange={setSpdMode}
              showModeToggle
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spdTop} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 40']} />
              <YAxis dataKey="name" type="category" width={140}  interval={0}/>
              <RTooltip />
              <Bar dataKey="speed" fill="#06b6d4" name="속도">
                <LabelList dataKey="speed" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">사거리 TOP 10</h3>
          <div className="mb-3">
            <GenericFilter
              title="속성 필터"
              options={ATTR_OPTIONS}
              selected={rngSelected}
              onSelect={makeToggle(setRngSelected)}
              filterMode={rngMode}
              onModeChange={setRngMode}
              showModeToggle
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rngTop} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax + 1000']} />
              <YAxis dataKey="name" type="category" width={140} interval={0}/>
              <RTooltip />
              <Bar dataKey="range" fill="#9333ea" name="사거리">
                <LabelList dataKey="range" position="right" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">효과(상태이상) 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enemyStats.affectsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" fill="#22c55e" name="수">
                <LabelList dataKey="value" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">특수 능력</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={enemyStats.abilityData}>
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
      </div>
    </div>
  );
}