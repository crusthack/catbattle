"use client";

import React from "react";
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

  const handleAddAndFocusSearch = () => {
    addMission();
    // open search and focus input after popover opens
    setSearchOpen(true);
    setTimeout(() => {
      const input = document.querySelector('[cmdk-input]') as HTMLInputElement | null;
      if (input) input.focus();
    }, 150);
  };

  // find the selected enemy object for display
  const selectedEnemyObj = selectedEnemy != null ? enemies.find((e: any) => e.Id === selectedEnemy) : null;

  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3">
          <label className="text-sm text-gray-700 mb-3 block">스테이지 종류</label>
          <div className="grid grid-cols-2 gap-2">
            {mapTypes.map((type) => (
              <Button key={type} variant={selectedMapType === type ? "default" : "outline"} onClick={() => setSelectedMapType(type)} className="h-12">
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-gray-700 mb-3 block">단계</label>
          <div className="grid grid-cols-2 gap-2">
            {stars.map((star) => (
              <Button key={star} variant={selectedStar === star ? "default" : "outline"} onClick={() => setSelectedStar(star)} className="h-12">
                {star}성
              </Button>
            ))}
          </div>
        </div>

        <div className="md:col-span-5">
          <label className="text-sm text-gray-700 mb-3 block">적 이름</label>
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={searchOpen} className="w-full justify-between h-12">
                {selectedEnemyObj ? <span className={getAttributeColorFromEnemy(selectedEnemyObj)}>{selectedEnemyObj.Name}</span> : <span className="text-gray-500">적 검색...</span>}
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command shouldFilter>
                <CommandInput placeholder="적 이름 검색..." onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = (e.target as HTMLInputElement) || document.querySelector('[cmdk-input]') as HTMLInputElement | null;
                    const val = input?.value?.trim();
                    if (!val) return;
                    const found = enemies.find((en) => en.Name && en.Name.toLowerCase() === val.toLowerCase()) || enemies.find((en) => en.Name && en.Name.toLowerCase().includes(val.toLowerCase()));
                    if (found) {
                      setSelectedEnemy(found.Id);
                      setSearchOpen(false);
                      // delay focus slightly so Popover/Command finishes closing and doesn't steal focus
                      setTimeout(() => {
                        addButtonRef.current?.focus();
                      }, 100);
                    }
                  }
                }} />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {enemies.map((enemy) => (
                      <CommandItem key={enemy.Id} value={enemy.Name} keywords={[enemy.Name]} onSelect={() => { setSelectedEnemy(enemy.Id); setSearchOpen(false); setTimeout(()=>{ addButtonRef.current?.focus(); }, 100); }}>
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
    </Card>
  );
}
