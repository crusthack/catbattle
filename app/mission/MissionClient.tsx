"use client";

import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import type { Stage as Stage } from "@/types/stage";
import type { Enemy } from "@/types/enemy";
import MissionAdd from "@/components/mission/MissionAdd";
import RecommendedStages, { StageWithMissions } from "@/components/mission/RecommendedStages";
import CurrentMissions from "@/components/mission/CurrentMissions";
import { StageDialog, EnemyDialog } from "@/components/mission/Dialogs";

interface Mission {
    id: number;
    mapType: string;
    star: number;
    enemyName: string;
    enemyId: number;
}

interface Props {
    enemies: Enemy[];
    stages: Stage[];
}

export default function MissionClient({ enemies, stages }: Props) {
    const [selectedMapType, setSelectedMapType] = useState<string>("세계편");
    const [selectedStar, setSelectedStar] = useState<number>(1);
    // store selected enemy by Id (number) or null
    const [selectedEnemy, setSelectedEnemy] = useState<number | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [missions, setMissions] = useState<Mission[]>([]);
    const [sortBy, setSortBy] = useState<"energy" | "time">("time");
    

    // Stage Detail Dialog
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Enemy Detail Dialog
    const [selectedEnemyDetail, setSelectedEnemyDetail] = useState<Enemy | null>(null);
    const [selectedEnemyMultiplier, setSelectedEnemyMultiplier] = useState<number>(100);
    const [isEnemyDialogOpen, setIsEnemyDialogOpen] = useState(false);

    const mapTypes = ["세계편", "미래편", "우주편", "레전드"];
    const stars = [1, 2, 3, 4];

    const getEnemyById = (id: number | null): Enemy | null => (id == null ? null : enemies.find((e) => e.Id === id) || null);
    const getEnemyByName = (name: string): Enemy | null => enemies.find((e) => e.Name === name) || null;

    const getAttributeColorFromEnemy = (enemy?: Enemy | null) => {
        if (!enemy) return "text-gray-700";
        const first = (enemy as any).Targets && (enemy as any).Targets[0];
        const map: Record<string, string> = {
            Red: "text-red-600",
            Floating: "text-sky-500",
            Metal: "text-gray-500",
            White: "text-gray-700",
            Angel: "text-yellow-400",
            Black: "text-purple-600",
            Zombie: "text-green-600",
            Alien: "text-pink-500",
        };
        return (first && map[first]) || "text-gray-700";
    };

    

    const isLegendStage = (stage?: Stage | null) => {
        if (!stage) return false;
        return [0, 13, 34].includes(stage.StoryId);
    };

    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => {
                const input = document.querySelector("[cmdk-input]") as HTMLInputElement | null;
                if (input) input.focus();
            }, 0);
        }
    }, [searchOpen]);

    const addMission = () => {
        if (selectedMapType && selectedEnemy != null) {
            const enemy = getEnemyById(selectedEnemy);
            const newMission: Mission = {
                id: Date.now(),
                mapType: selectedMapType,
                star: selectedStar,
                enemyName: enemy ? enemy.Name : "",
                enemyId: enemy ? enemy.Id : 0,
            };
            // prevent duplicate missions with same mapType, star, and enemyId
            setMissions((prev) => {
                const exists = prev.some((m) => m.mapType === newMission.mapType && m.star === newMission.star && m.enemyId === newMission.enemyId);
                if (exists) return prev;
                return [...prev, newMission];
            });
        }
    };

    const removeMission = (id: number) => setMissions((prev) => prev.filter((m) => m.id !== id));

    const getKey = (stage: Stage): string => {
        switch(stage.StoryId){
            case 3:
                switch(stage.MapId){
                    case 9: return '세계편';
                    case 3:
                    case 4:
                    case 5: return '미래편';
                    case 6:
                    case 7:
                    case 8: return '우주편';
                }
            case 0:
            case 13:
            case 34:
                return '레전드'
        }
        return 'etc';
    }

    // rank stages for sorting groups: 세계편(0), 미래편(1), 우주편(2), 레전드(3), etc(4)
    const getStageGroupRank = (stage: Stage): number => {
        if (!stage) return 10;
        if (stage.StoryId === 3 && stage.MapId === 9) return 0; // 세계편
        if (stage.StoryId === 3 && (stage.MapId === 3 || stage.MapId === 4 || stage.MapId === 5)) return 1 + stage.MapId % 3; // 미래편
        if (stage.StoryId === 3 && (stage.MapId === 6 || stage.MapId === 7 || stage.MapId === 8)) return 4 + stage.MapId % 3; // 우주편
        if ([0, 13, 34].includes(stage.StoryId)) return 7; // 레전드
        return 10; // others
    }

    const stageEntries = useMemo((): StageWithMissions[] => {
        // Use a Map keyed by StoryId-MapId-StageId to ensure each stage appears only once
        const map = new Map<string, StageWithMissions[]>();
        map.set('세계편', []);
        map.set('미래편', []);
        map.set('우주편', []);
        map.set('레전드', []);
        map.set('etc', []);

        for(const stage of stages){
            const key = getKey(stage);
            // For legend stages, duplicate per-star entries (1..4) so each star is treated separately
            if (isLegendStage(stage)) {
                for (let s = 1; s <= 4; s++) {
                    map.get(key)!.push({ stage: stage, targetEnemies: [], maxTimer: -1, star: s });
                }
            } else {
                map.get(key)!.push({stage: stage, targetEnemies: [], maxTimer: -1});
            }
        }


        for (const m of missions) {
            const mapType = m.mapType;
            const targetStages = map.get(mapType);
            if (!targetStages) {
                console.log("asdasdasd");
                continue;
            }

                for (const entry of targetStages) {
                const stage = entry.stage;
                    // If this entry is star-specific (legend), only match missions of same star
                    if (entry.star != null && m.star !== entry.star) continue;
                // Restrict to the specific chapter map based on mission star for 미래편/우주편
                if (mapType === '미래편') {
                    // 미래편: 1성 -> MapId 3, 2성 -> 4, 3성 -> 5
                    const requiredMapId = 2 + (m.star || 1);
                    if (stage.MapId !== requiredMapId) continue;
                }
                if (mapType === '우주편') {
                    // 우주편: 1성 -> MapId 6, 2성 -> 7, 3성 -> 8
                    const requiredMapId = 5 + (m.star || 1);
                    if (stage.MapId !== requiredMapId) continue;
                }
                const enemySpawns = stage.EnemiesData || [];
                for(const spawnData of enemySpawns){ 
                    if(spawnData.enemyId === m.enemyId){
                        // only add if not already present
                        if (!entry.targetEnemies.includes(spawnData.enemyId)) {
                            entry.targetEnemies.push(spawnData.enemyId);

                            const targetEnemyData = stage.EnemiesData.filter(s => s.enemyId === spawnData.enemyId);
                            targetEnemyData.sort((a, b) => {
                                if (a.timer !== b.timer) {
                                    return (a.timer || 0) - (b.timer || 0);
                                }
                                return (b.castleHp || 0) - (a.castleHp || 0);
                            });
                            if(targetEnemyData.length > 0){
                                const firstSpawn = targetEnemyData[0];
                                entry.maxTimer = Math.max(firstSpawn.timer, entry.maxTimer);
                            }
                        }
                    }
                }
                const enemy = getEnemyByName(m.enemyName);
                if (!enemy) continue;
            }
        }
        const entries: StageWithMissions[] = [];
        for (const stageList of map.values()) {
            for (const entry of stageList) {
                if (entry.targetEnemies.length > 0) {
                    entries.push(entry);
                }
            }
        }
        
        // sort 로직 1. 맵 순서 세계편, 미래편(1장/2장/3장), 우주편(1장/2장/3장), 레전드(레전드, 신레전드, 레전드0 동일)
        // 2. 미션몹 많은 순
        // 3. 통솔력 오름차순 / 출몰시간 빠른 순
        // 4. stageid 오름차순
        entries.sort((a, b) => {
            const rankA = getStageGroupRank(a.stage);
            const rankB = getStageGroupRank(b.stage);
            if (rankA !== rankB) return rankA - rankB;
            // within same group: sort by StoryId then StageId
            if (a.stage.StoryId !== b.stage.StoryId) return a.stage.StoryId - b.stage.StoryId;
            // prefer stages with more matching enemies
            if (b.targetEnemies.length !== a.targetEnemies.length) return b.targetEnemies.length - a.targetEnemies.length;
            if (sortBy === 'time' && a.maxTimer !== b.maxTimer) return (a.maxTimer || 0) - (b.maxTimer || 0);
            if (a.stage.Energy !== b.stage.Energy) return (a.stage.Energy || 0) - (b.stage.Energy || 0);
            if (a.maxTimer !== b.maxTimer) return a.maxTimer - b.maxTimer;
            return a.stage.StageId - b.stage.StageId;
        });
        console.log(entries);

        return entries;
    }, [missions, stages, sortBy]);

    const clearMissionsForStage = (stage: Stage | any) => {
        // Accept either a StageWithMissions entry or a raw Stage
        const entryOrStage: any = stage;
        const actualStage: Stage = entryOrStage && entryOrStage.stage ? entryOrStage.stage : stage;
        const entryStar: number | undefined = entryOrStage && entryOrStage.star ? entryOrStage.star : undefined;
        const key = getKey(actualStage);
        const enemyIdsInStage = new Set((actualStage.EnemiesData || []).map(s => s.enemyId));
        setMissions((prev) => prev.filter(m => {
            if (m.mapType !== key) return true;
            // if entry is star-specific, only clear missions that match the star
            if (entryStar != null) {
                if (m.star !== entryStar) return true;
            }
            return !enemyIdsInStage.has(m.enemyId);
        }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-indigo-600 mb-2">월간 미션 도우미</h2>
            </div>

                        <MissionAdd
                            mapTypes={mapTypes}
                            stars={stars}
                            selectedMapType={selectedMapType}
                            setSelectedMapType={setSelectedMapType}
                            selectedStar={selectedStar}
                            setSelectedStar={setSelectedStar}
                            selectedEnemy={selectedEnemy}
                            setSelectedEnemy={setSelectedEnemy}
                            searchOpen={searchOpen}
                            setSearchOpen={setSearchOpen}
                            enemies={enemies}
                            getAttributeColorFromEnemy={getAttributeColorFromEnemy}
                            addMission={addMission}
                        />

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-7">
                    <Card className="p-6">
                        <div className="flex items-center gap-2 mb-4 w-full">
                            <Target className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-indigo-600">추천 스테이지</h3>

                            {missions.length > 0 && (
                                <div className="flex gap-2 ml-auto">
                                    <Button variant={sortBy === "time" ? "default" : "outline"} size="sm" onClick={() => setSortBy("time")}>
                                        시간 빠른 순
                                    </Button>
                                    <Button variant={sortBy === "energy" ? "default" : "outline"} size="sm" onClick={() => setSortBy("energy")}>
                                        통솔력 적은 순
                                    </Button>
                                </div>
                            )}
                        </div>

                        {missions.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>미션을 추가하면 추천 스테이지가 표시됩니다</p>
                            </div>
                        ) : (
                            <RecommendedStages stageEntries={stageEntries} enemies={enemies} onClearStage={clearMissionsForStage} setSelectedStage={(s:any)=>{setSelectedStage(s); setIsDialogOpen(true);}} setIsDialogOpen={setIsDialogOpen}/>
                        )}
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <CurrentMissions missions={missions} removeMission={removeMission} clearAll={() => setMissions([])} />
                </div>
            </div>

            <StageDialog
                selectedStage={selectedStage}
                enemies={enemies}
                isOpen={isDialogOpen}
                isSiblingOpen={isEnemyDialogOpen}
                onShowEnemy={(enemy: Enemy, mult: number) => {
                    setSelectedEnemyDetail(enemy);
                    setSelectedEnemyMultiplier(mult || 100);
                    setIsEnemyDialogOpen(true);
                }}
                onOpenChange={(open: boolean) => {
                    setIsDialogOpen(open);
                    if (!open) setIsEnemyDialogOpen(false);
                }}
            />

            <EnemyDialog enemy={selectedEnemyDetail} multiplier={selectedEnemyMultiplier} isOpen={isEnemyDialogOpen} isSiblingOpen={isDialogOpen} onOpenChange={setIsEnemyDialogOpen} />
        </div>
    );
}
