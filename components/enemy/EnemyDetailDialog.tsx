"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Enemy } from "@/types/enemy";
import { TARGET_KO, AFFECT_KO, ABILITY_KO, toKo } from "@/lib/translationMaps";
import Link from "next/link";

export default function EnemyDetailDialog({
  isOpen,
  onOpenChange,
  enemy,
}: {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  enemy: Enemy | null;
}) {
  if (!enemy) return null;

  const paddedId = useMemo(() => {
    return enemy.Id.toString().padStart(3, "0");
  }, [enemy.Id]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <Link href={`/enemy/${paddedId}`}>
              <DialogTitle className="text-blue-600 cursor-pointer hover:underline">
                {enemy.Name}
              </DialogTitle>
            </Link>
          </div>
        </DialogHeader>

        {/* ---------------------------------------------- */}
        {/* MAIN CONTENT (CatDetailDialog 스타일과 동일) */}
        {/* ---------------------------------------------- */}

        <div className="space-y-6 mt-4">

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 mb-1">ID</p>
              <p>{enemy.Id}</p>
            </div>
          </div>

          {/* Targets */}
          <div>
            <p className="text-gray-600 mb-2">속성</p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(enemy.Targets) ? enemy.Targets : []).map((t, i) => (
                <Badge key={i}>{toKo(TARGET_KO, t as any)}</Badge>
              ))}
            </div>
          </div>

          {/* Effects */}
          <div>
            <p className="text-gray-600 mb-2">효과</p>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(enemy.Affects) ? enemy.Affects : []).map((e, i) => (
                <Badge key={i}>{toKo(AFFECT_KO, e as any)}</Badge>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="border-t pt-4">
            <h4 className="mb-3">특수 능력</h4>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(enemy.Abilities) ? enemy.Abilities : []).map((ab, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1">
                  {toKo(ABILITY_KO, ab as any)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t pt-4">
            <h4 className="mb-4">스탯</h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">HP</p>
                <p className="text-red-600">{enemy.Hp}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">공격력</p>
                <p className="text-orange-600">{enemy.Atk}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">사거리</p>
                <p className="text-blue-600">{enemy.Range}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">속도</p>
                <p className="text-green-600">{enemy.Speed}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">넉백</p>
                <p className="text-purple-600">{enemy.Heatback}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-600">공격 간격</p>
                <p>{enemy.Tba}</p>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
