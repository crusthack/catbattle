"use client";

import { useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Cat as Cat } from "@/types/cat";
import { TARGET_KO, AFFECT_KO, ABILITY_KO, toKo } from "@/lib/translationMaps";
import { getRarityColor, getTargetColor } from "@/lib/colorUtils";
import Link from "next/link";


interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCat: Cat | null;
  currentLevel: number;
  setCurrentLevel: (v: number) => void;
}

export default function CatDetailDialog({
  isOpen,
  onOpenChange,
  selectedCat,
  currentLevel,
  setCurrentLevel,
}: Props) {
  if (!selectedCat) return null;

  // 레벨 제한 처리
  const maxLevel = selectedCat.MaxLevel + selectedCat.PlusLevel;
  const validLevel = Math.max(1, Math.min(currentLevel, maxLevel));

  const stats = useMemo(() => {
    const levelData = selectedCat.levelData;
    const baseHp = selectedCat.Hp;
    const baseAtk = selectedCat.Atk;
    const zeroAtk = baseAtk - (levelData[0] / 100) * selectedCat.Atk;
    const zeroHp = baseHp - (levelData[0] / 100) * selectedCat.Hp;

    let remainLevel = validLevel;
    let calculatedHp = zeroHp;
    let calculatedAttack = zeroAtk;
    let index = 0;

    while (remainLevel) {
      if (remainLevel < 10) {
        calculatedAttack += (levelData[index] / 100) * baseAtk * remainLevel;
        calculatedHp += (levelData[index] / 100) * baseHp * remainLevel;
        break;
      }
      calculatedAttack += (levelData[index] / 100) * baseAtk * 10;
      calculatedHp += (levelData[index] / 100) * baseHp * 10;
      index++;
      remainLevel -= 10;
    }

    return {
      calculatedAttack: Math.round(calculatedAttack),
      calculatedHp: Math.round(calculatedHp),
    };
  }, [selectedCat, validLevel]);

  const paddedId = useMemo(() => {
    return selectedCat.Id.toString().padStart(3, "0");
  }, [selectedCat.Id]);

  // 다이얼로그 닫을 때 상태 정리
  const handleOpenChange = useCallback((open: boolean) => {
    onOpenChange(open);
  }, [onOpenChange]);

  // 레벨 변경 핸들러
  const handleLevelChange = useCallback((newLevel: number) => {
    setCurrentLevel(Math.max(1, Math.min(newLevel, maxLevel)));
  }, [maxLevel, setCurrentLevel]);

  // 색상 유틸은 lib/colorUtils에서 제공

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {/* Title */}
            <Link href={`/cat/${paddedId}`}>
              <div>
                <DialogTitle className="text-blue-600 cursor-pointer hover:underline">
                  {selectedCat.Name}
                </DialogTitle>
              </div>
            </Link>

            {/* Level Control */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">레벨</span>

              <button
                onClick={() => handleLevelChange(validLevel - 10)}
                className="w-10 h-8 rounded bg-white border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors text-xs"
              >
                -10
              </button>

              <button
                onClick={() => handleLevelChange(validLevel - 1)}
                className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center"
              >
                -
              </button>

              <Input
                type="number"
                min={1}
                max={999}
                value={validLevel}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v)) handleLevelChange(v);
                }}
                className="w-20 h-8 text-center"
              />

              <button
                onClick={() => handleLevelChange(validLevel + 1)}
                className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center"
              >
                +
              </button>

              <button
                onClick={() => handleLevelChange(validLevel + 10)}
                className="w-10 h-8 rounded bg-white border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors text-xs"
              >
                +10
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">ID</p>
              <p>{selectedCat.Id}</p>
            </div>

            <div>
              <p className="text-gray-600 mb-1">등급</p>
              <Badge className={getRarityColor(selectedCat.Rarity)}>
                {selectedCat.Rarity}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-gray-600 mb-2">타겟 속성</p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(selectedCat.Targets) ? selectedCat.Targets : []).map((t, i) => (
                <Badge key={i} className={getTargetColor(String(t))}>
                  {toKo(TARGET_KO, t as any)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-600 mb-2">효과</p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(selectedCat.Affects) ? selectedCat.Affects : []).map((e, i) => (
                <Badge key={i} className="bg-gray-200 text-gray-600">
                  {toKo(AFFECT_KO, e as any)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-4">스탯 정보 (레벨 {validLevel})</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">HP</p>
                <p className="text-red-600">{stats.calculatedHp}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">공격력</p>
                <p className="text-orange-600">{stats.calculatedAttack}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">사거리</p>
                <p className="text-blue-600">{selectedCat.Range}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">속도</p>
                <p className="text-green-600">{selectedCat.Speed}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">코스트</p>
                <p className="text-yellow-600">{selectedCat.Price}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">재생산</p>
                <p className="text-purple-600">{selectedCat.RespawnHalf}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3">특수 능력</h4>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(selectedCat.Abilities) ? selectedCat.Abilities : []).map((ab, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {toKo(ABILITY_KO, ab as any)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
