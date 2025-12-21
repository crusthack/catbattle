"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Enemy } from "@/types/enemy";
import { TARGET_KO, AFFECT_KO, ABILITY_KO, toKo } from "@/lib/translationMaps";
import { getTargetColor as defaultGetTargetColor, getEffectColor as defaultGetEffectColor } from "@/lib/colorUtils";

const getTargetColor = defaultGetTargetColor;
const getEffectColor = defaultGetEffectColor;

export default function EnemiesTable({
  enemies,
  onSelect,
}: {
  enemies: Enemy[];
  onSelect: (enemy: Enemy) => void;
}) {
  const [sortBy, setSortBy] = useState<"id" | "name">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (col: "id" | "name") => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const displayedEnemies = useMemo(() => {
    const arr = [...enemies];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      if (sortBy === "id") return (a.Id - b.Id) * dir;
      if (sortBy === "name") return a.Name.localeCompare(b.Name) * dir;
      return 0;
    });
    return arr;
  }, [enemies, sortBy, sortDir]);
  const tableRows = useMemo(
    () =>
      displayedEnemies.map((enemy) => (
        <TableRow
          key={`${enemy.Id}`}
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => onSelect(enemy)}
        >
          <TableCell className="text-center">{enemy.Id}</TableCell>

          <TableCell>
            {enemy.Image ? (
              <img src={enemy.Image} alt={enemy.Name} className="w-14 w-full h-14 object-contain rounded bg-white" />
            ) : (
              <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">No</div>
            )}
          </TableCell>

          <TableCell>
            <div className="font-semibold">{enemy.Name}</div>
          </TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(enemy.Targets) ? enemy.Targets : []).map((t, i) => (
                <Badge key={i} className={getTargetColor(String(t))}>
                  {toKo(TARGET_KO, t as any)}
                </Badge>
              ))}
            </div>
          </TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(enemy.Affects) ? enemy.Affects : []).map((e, i) => {
                if (e === "rWarp") return null;
                return (
                  <Badge key={i} className={getEffectColor(String(e))}>
                    {toKo(AFFECT_KO, e as any)}
                  </Badge>
                );
              })}
            </div>
          </TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(enemy.Abilities) ? enemy.Abilities : []).map((ab, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {toKo(ABILITY_KO, ab as any)}
                </Badge>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )),
    [displayedEnemies, onSelect]
  );

  return (
    <Card className="p-6">
      <div className="overflow-x-auto w-full min-w-0">
        <Table className="w-full table-fixed text-left">
          <TableHeader>
            <TableRow>
                <TableHead className="w-8 text-center">
                  <button className="w-full" onClick={() => toggleSort("id")}>ID {sortBy === "id" ? (sortDir === "asc" ? "▲" : "▼") : ""}</button>
                </TableHead>
                <TableHead className="w-20">사진</TableHead>
                <TableHead className="w-36">
                  <button className="w-full text-left" onClick={() => toggleSort("name")}>이름 {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}</button>
                </TableHead>
                <TableHead className="w-48">속성</TableHead>
                <TableHead className="w-48">효과</TableHead>
                <TableHead className="w-52">능력</TableHead>
              </TableRow>
          </TableHeader>

          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
