"use client";

import React from "react";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface Props {
  missions: any[];
  removeMission: (id: number) => void;
  clearAll: () => void;
}

export default function CurrentMissions({ missions, removeMission, clearAll }: Props) {
  return (
    <Card className="p-6 sticky top-24">
      <h3 className="text-indigo-600 mb-4">현재 미션</h3>

      {missions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Plus className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">추가된 미션이 없습니다</p>
        </div>
      ) : (
        <div className="w-full space-y-3">
          {missions.slice().sort((a, b) => {
            // custom order for mapType
            const order = ['세계편', '미래편', '우주편', '레전드'];
            const ia = order.indexOf(a.mapType);
            const ib = order.indexOf(b.mapType);
            const ra = ia === -1 ? 999 : ia;
            const rb = ib === -1 ? 999 : ib;
            if (ra !== rb) return ra - rb;
            if ((a.star || 0) < (b.star || 0)) return -1;
            if ((a.star || 0) > (b.star || 0)) return 1;
            const nameA = (a.enemyName || '').toLowerCase();
            const nameB = (b.enemyName || '').toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          }).map(mission => (
            <Card key={mission.id} onClick={() => removeMission(mission.id)} className="w-full bg-white justify-start items-center p-1 hover:bg-gray-50 transition-colors">
              <div className="flex items-center w-full">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className="bg-indigo-500 text-xs">{mission.mapType}</Badge>
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">{mission.star}{mission.mapType == '레전드' ? '성' : '장'}</Badge>
                    {mission.enemyName}
                  </div>
                </div>
                <div className="flex gap-10 ml-auto">
                  <Button variant="ghost" size="sm" onClick={() => removeMission(mission.id)} className="h-8 w-8 p-0 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" size="sm" onClick={clearAll} className="w-full mt-4">전체 삭제</Button>
        </div>
      )}
    </Card>
  );
}
