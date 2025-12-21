"use client";

import { useMemo } from "react";
import type { Stage } from "@/types/stage";
import Card from "@/components/ui/card";
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
  LabelList,
} from "recharts";
import SummaryRow from "./SummaryRow";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#ef4444"];

export default function StagesCharts({ stages }: { stages: Stage[] }) {
  const stageStats = useMemo(() => {
    const storyCount = stages.reduce<Record<string, number>>((acc, s) => {
      const key = s.StoryName || `${s.StoryId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const mapCount = stages.reduce<Record<string, number>>((acc, s) => {
      const key = s.MapName || `${s.MapId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const storyData = Object.entries(storyCount).map(([name, value]) => ({ name, value, percentage: (((value || 0) / Math.max(1, stages.length)) * 100).toFixed(1) }));
    const mapData = Object.entries(mapCount).map(([name, value]) => ({ name, value }));

    const storyAgg = stages.reduce<Record<string, { count: number; energy: number }>>((acc, s) => {
      const key = s.StoryName || `${s.StoryId}`;
      if (!acc[key]) acc[key] = { count: 0, energy: 0 };
      acc[key].count++;
      acc[key].energy += s.Energy || 0;
      return acc;
    }, {});
    const storyEnergyAvg = Object.entries(storyAgg).map(([name, v]) => ({ name, energy: Math.round(v.energy / Math.max(1, v.count)) }));

    const avg = {
      energy: Math.round(stages.reduce((s, st) => s + (st.Energy || 0), 0) / Math.max(1, stages.length)),
      enemyCount: (stages.reduce((s, st) => s + (st.EnemiesData?.length || 0), 0) / Math.max(1, stages.length)).toFixed(1),
    } as const;

    return { total: stages.length, storyData, mapData, storyEnergyAvg, avg };
  }, [stages]);

  return (
    <div className="space-y-6">
      <SummaryRow items={[
        { label: "총 스테이지", value: `${stageStats.total} 개` },
        { label: "평균 통솔력", value: stageStats.avg.energy.toLocaleString() },
        { label: "스테이지당 평균 적 수", value: String(stageStats.avg.enemyCount) },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-2">스토리 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stageStats.storyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e: any) => `${e.name} (${e.percentage}%)`}>
                {stageStats.storyData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <RTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-2">맵 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageStats.mapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" fill="#8b5cf6" name="수">
                <LabelList dataKey="value" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">스토리별 평균 통솔력</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={stageStats.storyEnergyAvg}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="energy" fill="#ef4444" name="평균 통솔력">
                <LabelList dataKey="energy" position="top" formatter={(v: number) => v?.toLocaleString?.() ?? v} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
