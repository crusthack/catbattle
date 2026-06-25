"use client";

import React, { useMemo, useState } from "react";
import Card from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CycloneSchedule from "@/components/mission/CycloneSchedule";

interface Props {
  mapTypes: string[];
  stars: number[];
  selectedMapType: string;
  setSelectedMapType: (v: string) => void;
  selectedStar: number;
  setSelectedStar: (n: number) => void;
  // selectedEnemy now stores the enemy Id (number) or null when none selected
  selectedEnemy: number | null;
  setSelectedEnemy: (n: number | null) => void;
  searchOpen: boolean;
  setSearchOpen: (b: boolean) => void;
  enemies: any[];
  getAttributeColorFromEnemy: (e?: any) => string;
  addMission: () => void;
}

export default function MissionAdd(props: Props) {
  const { mapTypes, stars, selectedMapType, setSelectedMapType, selectedStar, setSelectedStar, selectedEnemy, setSelectedEnemy, searchOpen, setSearchOpen, enemies, getAttributeColorFromEnemy, addMission } = props;

  const addButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 검색어로 필터링 후 최대 100건만 렌더링 (전체 목록 DOM 마운트 방지)
  const filteredEnemies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return enemies.slice(0, 100);
    return enemies.filter((e: any) => e.Name.toLowerCase().includes(q)).slice(0, 100);
  }, [enemies, searchQuery]);

  const handlePopoverChange = (open: boolean) => {
    setSearchOpen(open);
    if (!open) setSearchQuery("");
  };

  const handleAddAndFocusSearch = () => {
    addMission();
    setSearchOpen(true);
    setTimeout(() => {
      const input = document.querySelector('[cmdk-input]') as HTMLInputElement | null;
      if (input) input.focus();
    }, 150);
  };

  // find the selected enemy object for display
  const selectedEnemyObj = selectedEnemy != null ? enemies.find((e: any) => e.Id === selectedEnemy) : null;

  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
      <div className="flex items-start w-full gap-6">
        <div className="flex-1 hidden lg:block" />
        <div className="shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-3">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">스테이지 종류</label>
              <div className="grid grid-cols-2 gap-2">
                {mapTypes.map((type) => (
                  <Button key={type} variant={selectedMapType === type ? "default" : "outline"} onClick={() => setSelectedMapType(type)} className="h-12">
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">단계</label>
              <div className="grid grid-cols-2 gap-2">
                {stars.map((star) => (
                  <Button key={star} variant={selectedStar === star ? "default" : "outline"} onClick={() => setSelectedStar(star)} className="h-12">
                    {star}성
                  </Button>
                ))}
              </div>
            </div>

            <div className="md:col-span-5">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-3 block">적 이름</label>
              <Popover open={searchOpen} onOpenChange={handlePopoverChange}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={searchOpen} className="w-full justify-between h-12">
                    {selectedEnemyObj ? <span className={getAttributeColorFromEnemy(selectedEnemyObj)}>{selectedEnemyObj.Name}</span> : <span className="text-gray-500">적 검색...</span>}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="적 이름 검색..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const q = searchQuery.trim().toLowerCase();
                          if (!q) return;
                          const found = enemies.find((en: any) => en.Name?.toLowerCase() === q)
                            ?? enemies.find((en: any) => en.Name?.toLowerCase().includes(q));
                          if (found) {
                            setSelectedEnemy(found.Id);
                            handlePopoverChange(false);
                            setTimeout(() => { addButtonRef.current?.focus(); }, 100);
                          }
                        }
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {filteredEnemies.map((enemy: any) => (
                          <CommandItem
                            key={enemy.Id}
                            value={enemy.Name}
                            onSelect={() => {
                              setSelectedEnemy(enemy.Id);
                              handlePopoverChange(false);
                              setTimeout(() => { addButtonRef.current?.focus(); }, 100);
                            }}
                          >
                            <span className={getAttributeColorFromEnemy(enemy)}>{enemy.Name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 mb-3 block opacity-0">추가</label>
              <Button id="mission-add-button" ref={addButtonRef} onClick={handleAddAndFocusSearch} disabled={!selectedMapType || selectedEnemy == null} className="w-full h-12 gap-2">
                <Plus className="w-4 h-4" />
                추가
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 hidden lg:flex justify-end">
          <CycloneSchedule className="border-l border-indigo-100 dark:border-indigo-800 pl-5" />
        </div>
      </div>
    </Card>
  );
}
