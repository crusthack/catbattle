"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/components/ui/utils";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";

// Final clean implementation for dialogs used by MissionClient

export function StageDialog({ selectedStage, enemies = [], isOpen, onOpenChange, onShowEnemy, isSiblingOpen = false }: any) {
  const spawns = Array.isArray(selectedStage?.EnemiesData) ? selectedStage.EnemiesData : (Array.isArray(selectedStage?.Enemies) ? selectedStage.Enemies : []);

  const spawnElements = spawns && spawns.length > 0
    ? spawns.map((spawn: any, idx: number) => {
        const enemyObj = enemies.find((e: any) => e.Id === spawn.enemyId) || { Id: spawn.enemyId, Name: `#${spawn.enemyId}` };
        const magn = spawn.magnification ?? spawn.Magnification ?? 100;
        const seconds = typeof spawn.timer === 'number' ? (spawn.timer / 30) : spawn.timer;
        return (
          <Card key={idx} className="p-4 bg-gray-50 border-2 cursor-pointer hover:bg-gray-100 transition-all" onClick={() => onShowEnemy?.(enemyObj, magn)}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-medium`}>{enemyObj.Name ?? enemyObj.Id}</span>
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">{magn}%</Badge>
              </div>
              <div className="text-xs text-gray-600">출몰시간: <span className="font-medium">{typeof seconds === 'number' ? `${seconds % 1 === 0 ? seconds.toFixed(0) : seconds.toFixed(1)}초` : seconds}</span></div>
            </div>
          </Card>
        );
      })
    : (<div className="text-sm text-gray-500">출몰 적 정보가 없습니다</div>);

  const stageClass = isSiblingOpen ? "max-w-2xl max-h-[90vh] overflow-y-auto lg:left-[25%] lg:w-[44%] lg:max-w-none" : "max-w-2xl max-h-[90vh] overflow-y-auto";

  return (
    <Dialog open={!!isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={stageClass} onClick={(e: any) => e.stopPropagation()}>
        {selectedStage && (
          <>
            <DialogHeader>
              <DialogTitle className="text-indigo-600">{selectedStage.StageName} ({selectedStage.MapName})</DialogTitle>
              <DialogDescription>스테이지 상세 정보</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Stage ID</p>
                  <p>{selectedStage.StageId}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Map</p>
                  <Badge variant="outline">{selectedStage.MapName}</Badge>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Story ID</p>
                  <p>{selectedStage.StoryId}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">통솔력 (Energy)</p>
                  <p>{selectedStage.Energy}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-indigo-600">출몰 적 정보</h3>
                <div className="space-y-3">
                  {spawnElements}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function EnemyDialog({ enemy, multiplier = 100, isOpen, onOpenChange, isSiblingOpen = false }: any) {
  const enemyClass = isSiblingOpen
    ? "bg-background fixed top-[50%] z-[60] grid w-full max-w-xl translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg left-[75%] translate-x-[-50%] lg:left-[75%] lg:w-[30%] lg:max-w-none"
    : "bg-background fixed top-[50%] z-[60] grid w-full max-w-xl translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg left-[75%] translate-x-[-50%]";

  return (
    <DialogPrimitive.Root open={!!isOpen} modal={false} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={cn(enemyClass)}
          onClick={(e: any) => { e.stopPropagation(); }}
          onPointerDown={(e: any) => { e.stopPropagation(); }}
          onPointerDownOutside={(e: any) => { e.preventDefault(); }}
          onOpenAutoFocus={(e: any) => { e.preventDefault(); }}
        >
          {enemy && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DialogTitle className="font-semibold">{enemy.Name}</DialogTitle>
                    </div>
                    <DialogDescription>{enemy.Descriptiont}</DialogDescription>
                  </div>
                  <div className="text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg">
                    <div className="text-xs text-gray-600">배율</div>
                    <div className="text-lg">{multiplier}%</div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600 mb-1">HP</p>
                    <p>{Math.round((enemy.Hp * multiplier) / 100).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">ATK</p>
                    <p>{Math.round((enemy.Atk * multiplier) / 100).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); onOpenChange(false); }}
                className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </button>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
