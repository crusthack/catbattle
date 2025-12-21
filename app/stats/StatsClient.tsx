"use client";

import type { Cat } from "@/types/cat";
import type { Enemy } from "@/types/enemy";
import type { Stage } from "@/types/stage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, Award } from "lucide-react";
import AlliesCharts from "@/components/stats/AlliesCharts";
import EnemiesCharts from "@/components/stats/EnemiesCharts";
import StagesCharts from "@/components/stats/StagesCharts";

type Props = { cats: Cat[]; enemies: Enemy[]; stages: Stage[] };

export default function StatsClient({ cats, enemies, stages }: Props) {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6 w-full">
      <div>
        <h1 className="text-orange-500 mb-2">통계</h1>
        <p className="text-gray-600">아군, 적, 스테이지에 대한 통계 정보를 확인하세요</p>
      </div>

      <Tabs defaultValue="allies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="allies" className="gap-2">
            <Users className="w-4 h-4" />
            아군 캐릭터
          </TabsTrigger>
          <TabsTrigger value="enemies" className="gap-2">
            <Target className="w-4 h-4" />
            적 캐릭터
          </TabsTrigger>
          <TabsTrigger value="stages" className="gap-2">
            <Award className="w-4 h-4" />
            스테이지
          </TabsTrigger>
        </TabsList>

        <TabsContent value="allies" className="space-y-6">
          <AlliesCharts cats={cats} />
        </TabsContent>

        <TabsContent value="enemies" className="space-y-6">
          <EnemiesCharts enemies={enemies} />
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <StagesCharts stages={stages} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
