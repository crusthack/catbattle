"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Cat as Cat } from "@/types/cat";
import { TARGET_KO, AFFECT_KO, ABILITY_KO, toKo } from "@/lib/translationMaps";
import { getRarityColor as defaultGetRarityColor, getTargetColor as defaultGetTargetColor, getEffectColor as defaultGetEffectColor } from "@/lib/colorUtils";

interface Props {
  cats: Cat[];
  onSelect: (cat: Cat) => void;

  getRarityColor?: (rarity: string) => string;
  getTargetColor?: (target: string) => string;
  getEffectColor?: (effect: string) => string;
}

export default function CatsTable({
  cats,
  onSelect,
  getRarityColor = defaultGetRarityColor,
  getTargetColor = defaultGetTargetColor,
  getEffectColor = defaultGetEffectColor,
}: Props) {
  const [sortBy, setSortBy] = useState<"id" | "name" | "rarity">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (col: "id" | "name" | "rarity") => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const displayedCats = useMemo(() => {
    const arr = [...cats];
    const dir = sortDir === "asc" ? 1 : -1;
    const rarityRank: Record<string, number> = {
      기본: 0,
      Ex: 1,
      레어: 2,
      슈퍼레어: 3,
      울트라슈퍼레어: 4,
      레전드레어: 5,
    };

    arr.sort((a, b) => {
      if (sortBy === "id") return (a.Id - b.Id) * dir;
      if (sortBy === "name") return a.Name.localeCompare(b.Name) * dir;
      if (sortBy === "rarity") {
        const ia = rarityRank[a.Rarity] ?? 999;
        const ib = rarityRank[b.Rarity] ?? 999;
        return (ia - ib) * dir;
      }
      return 0;
    });
    return arr;
  }, [cats, sortBy, sortDir]);
  // 테이블 행의 렌더링 부분을 useMemo로 최적화
  const tableRows = useMemo(
    () =>
      displayedCats.map((cat) => (
        <TableRow
          key={`${cat.Id}-${cat.Form}`}
          className="cursor-pointer hover:bg-gray-50"
          onClick={() => onSelect(cat)}
        >
          <TableCell className="text-center">{cat.Id}</TableCell>

          <TableCell>
            {cat.Image ? (
              <img
                src={cat.Image}
                alt={cat.Name}
                className="w-14 w-full h-14 object-contain rounded bg-white"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">No</div>
            )}
          </TableCell>

          <TableCell>
            <div className="font-semibold">{cat.Name}</div>
          </TableCell>

          <TableCell>
            <Badge className={getRarityColor(cat.Rarity)}>
              {cat.Rarity}
            </Badge>
          </TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(cat.Targets) ? cat.Targets : []).map((t, i) => (
                <Badge key={i} className={getTargetColor(String(t))}>
                  {toKo(TARGET_KO, t as any)}
                </Badge>
              ))}
            </div>
          </TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(cat.Affects) ? cat.Affects : []).map((e, i) => (
                <Badge key={i} className={getEffectColor(String(e))}>
                  {toKo(AFFECT_KO, e as any)}
                </Badge>
              ))}
            </div>
          </TableCell>

          <TableCell>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(cat.Abilities) ? cat.Abilities : []).map((ab, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {toKo(ABILITY_KO, ab as any)}
                </Badge>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )),
    [displayedCats, onSelect, getRarityColor, getTargetColor, getEffectColor]
  );

  return (
    <Card className="p-6">
      <div className="overflow-x-auto w-full min-w-0">
        <Table className="w-full table-fixed text-left">
          <TableHeader>
            <TableRow>
                <TableHead className="w-8 text-center">
                  <button
                    className="w-full"
                    onClick={() => toggleSort("id")}
                  >
                    ID {sortBy === "id" ? (sortDir === "asc" ? "▲" : "▼") : ""}
                  </button>
                </TableHead>
                <TableHead className="w-20">사진</TableHead>
                <TableHead className="w-36">
                  <button className="w-full text-left" onClick={() => toggleSort("name")}>이름 {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}</button>
                </TableHead>
                <TableHead className="w-28">
                  <button className="w-full text-left" onClick={() => toggleSort("rarity")}>등급 {sortBy === "rarity" ? (sortDir === "asc" ? "▲" : "▼") : ""}</button>
                </TableHead>
                <TableHead className="w-48">타겟</TableHead>
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
