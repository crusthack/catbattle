"use client";

import React from "react";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Enemy } from "@/types/enemy";
import { Stage, StageEnemySpawnData } from "@/types/stage";

export type StageWithMissions = {
    stage: Stage;
    targetEnemies: number[];
    maxTimer: number;
    star?: number;
};

interface Props {
    stageEntries: StageWithMissions[];
    enemies: Enemy[];
    onClearStage?: (entry: StageWithMissions) => void;
    setSelectedStage: (s: any) => void;
    setIsDialogOpen: (b: boolean) => void;
}

export default function RecommendedStages({ stageEntries, enemies, onClearStage, setSelectedStage, setIsDialogOpen }: Props) {
    return (
        <div className="space-y-6 w-full">
            {stageEntries.filter(se => se.targetEnemies.length > 0).map(se => (
                <div key={`${se.stage.StoryId}-${se.stage.MapId}-${se.stage.StageId}-${se.star ?? 0}`} className="border-b pb-4 w-full last:border-b-0">
                    <div className="gap-3 w-full">
                        <Card className="p-4 hover:shadow-md w-full transition-shadow" onClick={() => { setSelectedStage(se.stage); setIsDialogOpen(true); }}>
                            <div className="flex items-start gap-3 justify-start mb-2 w-full">
                                {/* Don't show StoryName badge for 세계편; show star info elsewhere */}
                                {se.stage.StoryName !== '세계편' && (
                                    <Badge className="bg-indigo-500">{se.stage.StoryName} {se.star}성</Badge>
                                )}
                                <Badge className={`${se.stage.StoryName === '세계편' ? 'bg-indigo-500' : 'bg-gray-500'}`}>{se.stage.StoryId != 3 ? se.stage.MapId + 1 + '. ' : ''}{se.stage.MapName}</Badge>
                                <span className={`font-medium`}>{se.stage.StageId + 1}. {se.stage.StageName}</span>
                                <div className="text-yellow-600">통솔력: {se.stage.Energy}</div>
                                <div className="text-gray-600">최대출몰시간: {se.maxTimer % 1 === 0 ? (se.maxTimer / 30).toFixed(0) : se.maxTimer.toFixed(1)}초</div>

                                {onClearStage && (
                                    <Badge asChild variant="destructive" className="w-20 ml-auto transition-colors hover:bg-red-700/90">
                                        <button onClick={(e) => { e.stopPropagation(); onClearStage(se); }} className="text-sm">
                                            클리어
                                        </button>
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-0.5 items-start w-full">
                                {(() => {
                                    const seen = new Set<number>();
                                    const unique = se.stage.EnemiesData.filter((s) => {
                                        if (seen.has(s.enemyId)) return false;
                                        seen.add(s.enemyId);
                                        return true;
                                    });

                                    return unique.map((enemySpawnData: StageEnemySpawnData, idx) => {
                                        const en = enemies.find(e => e.Id === enemySpawnData.enemyId);
                                        if (!en) return null;
                                        if (en.Id === 23) return null; // skip rendering for enemy id 23

                                        // find first spawn info for this enemy in the stage (use original EnemiesData)
                                        const enemyDatas = se.stage.EnemiesData.filter(s => s.enemyId === en.Id);
                                        enemyDatas.sort((a, b) => {
                                            if (a.timer !== b.timer) {
                                                return (a.timer || 0) - (b.timer || 0);
                                            }
                                            return (b.castleHp || 0) - (a.castleHp || 0);
                                        });
                                        if (enemyDatas.length == 0) return null;
                                        const firstEnemyData = enemyDatas[0];
                                        const hpPercent = firstEnemyData.castleHp;
                                        const firstFrame = firstEnemyData.timer;
                                        const firstSeconds = typeof firstFrame === 'number' ? (firstFrame / 30) : null;

                                        const isTarget = se.targetEnemies.includes(en.Id);
                                        const firstText =
                                            firstSeconds != null
                                                ? firstSeconds % 1 === 0
                                                    ? `${firstSeconds.toFixed(0)}초`
                                                    : `${firstSeconds.toFixed(1)}초`
                                                : '-';

                                        return (
                                            <div
                                                className="flex flex-col items-center justify-start w-28"
                                                key={`${en.Id}-${idx}`}
                                            >
                                                {en.Image ? (
                                                    <img
                                                        src={en.Image}
                                                        alt={en.Name ?? 'enemy'}
                                                        className={`w-full h-full object-contain rounded bg-white ${isTarget ? 'ring-2 ring-red-500' : ''
                                                            }`}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">
                                                        No
                                                    </div>
                                                )}

                                                <div className="text-xs text-gray-600 mt-1 text-center">
                                                    <div>
                                                        <span className={isTarget ? 'font-bold' : undefined}>
                                                            성체력: {hpPercent}%
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <span className={isTarget ? 'font-bold' : undefined}>
                                                            첫출몰: {firstText}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );

                                    });
                                })()}
                            </div>
                        </Card>
                    </div>
                </div>
            ))}
        </div>
    );
}
