"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Enemy } from "@/types/enemy";
import EnemiesTable from "@/components/enemy/EnemiesTable";
import EnemyDetailDialog from "@/components/enemy/EnemyDetailDialog";
import UnifiedFiltersPanel from "@/components/common/UnifiedFiltersPanel";

/* ======================= Filter Options ======================= */

const FILTER_ATTRIBUTES_OPTIONS = [
  { value: "all", label: "전체", color: "gray" },
  { value: "None", label: "없음", color: "gray" },
  { value: "Red", label: "빨간적", color: "red" },
  { value: "Floating", label: "떠있는적", color: "green" },
  { value: "Black", label: "검은적", color: "black" },
  { value: "Metal", label: "메탈적", color: "slate" },
  { value: "Angel", label: "천사", color: "yellow" },
  { value: "Alien", label: "에이리언", color: "sky" },
  { value: "Zombie", label: "좀비", color: "purple" },
  { value: "Relic", label: "고대종", color: "emerald" },
  { value: "Demon", label: "악마", color: "blue-900" },
  { value: "White", label: "무속성", color: "stone" },
];

const FILTER_EFFECTS_OPTIONS = [
  { group: "1", value: "all", label: "전체" },
  { group: "1", value: "None", label: "없음" },
  { group: "1", value: "Slow", label: "느리게 한다" },
  { group: "1", value: "Stop", label: "멈춘다" },
  { group: "1", value: "Knockback", label: "날려버린다" },
  { group: "1", value: "Weak", label: "공격력 다운" },
  { group: "1", value: "Curse", label: "저주" },
  { group: "1", value: "ImuATK", label: "공격 무효" },
  { group: "1", value: "Warp", label: "워프" },
  { group: "1", value: "rWarp", label: "역워프" },
  { group: "1", value: "Poison", label: "독공격" },
];

const FILTER_ABILITIES_OPTIONS = [
  { group: "1", value: "all", label: "전체" },
  { group: "1", value: "None", label: "없음" },
  { group: "1", value: "AtkUp", label: "공격력 업" },
  { group: "1", value: "LETHAL", label: "살아남는다" },
  { group: "1", value: "BaseDestroyer", label: "성 파괴가 특기" },
  { group: "1", value: "Critical", label: "크리티컬" },
  { group: "1", value: "StrickAttack", label: "혼신의 일격" },
  { group: "1", value: "Glass", label: "유리공격" },
  { group: "2", value: "MiniWave", label: "소파동" },
  { group: "2", value: "Wave", label: "파동 공격" },
  { group: "2", value: "MiniVolcano", label: "소열파" },
  { group: "2", value: "Volcano", label: "열파 공격" },
  { group: "2", value: "VolcanoCounter", label: "열파 카운터" },
  { group: "2", value: "Blast", label: "폭파 공격" },
  { group: "2", value: "WaveBlocker", label: "파동스토퍼" },
  { group: "2", value: "Barrier", label: "베리어" },
  { group: "2", value: "DevilShield", label: "악마쉴드" },
  { group: "2", value: "DeathVolcano", label: "순교" },
  { group: "2", value: "Burrow", label: "버로우" },
  { group: "2", value: "Rebirth", label: "부활" },
  { group: "4", value: "Colosus", label: "초생명체" },
  { group: "4", value: "Behemoth", label: "초수" },
  { group: "4", value: "Sage", label: "초현자" },
  { group: "5", value: "ImuWeak", label: "공격력 다운 무효" },
  { group: "5", value: "ImuKB", label: "날려버린다 무효" },
  { group: "5", value: "ImuStop", label: "멈춘다 무효" },
  { group: "5", value: "ImuSlow", label: "느리게 무효" },
  { group: "5", value: "ImuWarp", label: "워프 무효" },
  { group: "5", value: "ImuCurse", label: "저주 무효" },
  { group: "5", value: "ImuWave", label: "파동 무효" },
  { group: "5", value: "ImuVolcano", label: "열파 무효" },
  { group: "5", value: "ImuBlast", label: "폭파 무효" },
];

const FILTER_ATTACKTYPE_OPTIONS = [
  { value: "all", label: "전체", color: "gray" },
  { value: "single", label: "단일 공격", color: "blue" },
  { value: "range", label: "범위 공격", color: "green" },
  { value: "long", label: "원거리 공격", color: "purple" },
  { value: "omni", label: "전방위 공격", color: "red" },
];



/* ======================= Main Component ======================= */

export default function EnemyPage({enemiess}: {enemiess: Enemy[]}) {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>(["all"]);
  const [attributeFilterMode, setAttributeFilterMode] = useState<"OR" | "AND">("OR");
  
  const [selectedEffects, setSelectedEffects] = useState<string[]>(["all"]);
  const [effectFilterMode, setEffectFilterMode] = useState<"OR" | "AND">("AND");
  
  const [selectedAttackTypes, setSelectedAttackTypes] = useState<string[]>(["all"]);
  const [attackTypeFilterMode, setAttackTypeFilterMode] = useState<"OR" | "AND">("AND");
  
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>(["all"]);
  const [abilityFilterMode, setAbilityFilterMode] = useState<"OR" | "AND">("AND");
  
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /* Load data on mount */
  useEffect(() => {
    const loadEnemies = async () => {
      const loadedEnemies = await enemiess;
      setEnemies(loadedEnemies);
    };
    loadEnemies();
  }, []);

  /* Toggle utility for multi-select filters */
  const toggleMulti = useCallback((value: string, setter: (fn: (prev: string[]) => string[]) => void) => {
    setter((prev: string[]) => {
      if (value === "all") return ["all"];
      const withoutAll = prev.filter((v) => v !== "all");
      if (withoutAll.includes(value)) {
        const next = withoutAll.filter((v) => v !== value);
        return next.length === 0 ? ["all"] : next;
      }
      return [...withoutAll, value];
    });
  }, []);

  /* color used by GenericFilter now comes from lib/colorUtils */

  /* Filter logic with memoization */
  const filteredEnemies = useMemo(() => {
    return enemies.filter((enemy) => {
      const matchesSearch = (() => {
        const normalize = (t: string) => (t || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
        const q = normalize(searchTerm);
        return normalize(enemy.Name).includes(q);
      })();

      const matchesAttribute = (() => {
        if (selectedAttributes.includes("all")) return true;
        const hasNone = selectedAttributes.includes("None");
        const selectedWithoutNone = selectedAttributes.filter((a) => a !== "None");

        if (hasNone) {
          if (attributeFilterMode === "OR") {
            return (
              (Array.isArray(enemy.Targets) ? enemy.Targets.length === 0 : true) ||
              (selectedWithoutNone.length > 0 && selectedWithoutNone.some((v) => enemy.Targets.includes(v as any)))
            );
          }
          return selectedWithoutNone.length === 0 && (Array.isArray(enemy.Targets) ? enemy.Targets.length === 0 : true);
        }

        return attributeFilterMode === "OR"
          ? selectedAttributes.some((v) => enemy.Targets.includes(v as any))
          : selectedAttributes.every((v) => enemy.Targets.includes(v as any));
      })();

      const matchesEffect = (() => {
        if (selectedEffects.includes("all")) return true;
        const hasNone = selectedEffects.includes("None");
        const selectedWithoutNone = selectedEffects.filter((a) => a !== "None");

        if (hasNone) {
          if (effectFilterMode === "OR") {
            return (
              (Array.isArray(enemy.Affects) ? enemy.Affects.length === 0 : true) ||
              (selectedWithoutNone.length > 0 && selectedWithoutNone.some((v) => enemy.Affects.includes(v as any)))
            );
          }
          return selectedWithoutNone.length === 0 && (Array.isArray(enemy.Affects) ? enemy.Affects.length === 0 : true);
        }

        return effectFilterMode === "OR"
          ? selectedEffects.some((v) => enemy.Affects.includes(v as any))
          : selectedEffects.every((v) => enemy.Affects.includes(v as any));
      })();

      const matchesAbility = (() => {
        if (selectedAbilities.includes("all")) return true;
        const hasNone = selectedAbilities.includes("None");
        const selectedWithoutNone = selectedAbilities.filter((a) => a !== "None");

        if (hasNone) {
          if (abilityFilterMode === "OR") {
            return (
              (Array.isArray(enemy.Abilities) ? enemy.Abilities.length === 0 : true) ||
              (selectedWithoutNone.length > 0 && selectedWithoutNone.some((v) => enemy.Abilities.includes(v as any)))
            );
          }
          return selectedWithoutNone.length === 0 && (Array.isArray(enemy.Abilities) ? enemy.Abilities.length === 0 : true);
        }

        return abilityFilterMode === "OR"
          ? selectedAbilities.some((v) => enemy.Abilities.includes(v as any))
          : selectedAbilities.every((v) => enemy.Abilities.includes(v as any));
      })();

      const matchesAttackType =
        selectedAttackTypes.includes("all") ||
        (attackTypeFilterMode === "OR"
          ? selectedAttackTypes.some((v) => enemy.AttackType.includes(v as any))
          : selectedAttackTypes.every((v) => enemy.AttackType.includes(v as any)));

      return (
        matchesSearch &&
        matchesAttribute &&
        matchesEffect &&
        matchesAbility &&
        matchesAttackType
      );
    });
  }, [
    enemies,
    searchTerm,
    selectedAttributes,
    attributeFilterMode,
    selectedEffects,
    effectFilterMode,
    selectedAbilities,
    abilityFilterMode,
    selectedAttackTypes,
    attackTypeFilterMode,
  ]);

  return (
    <div className="space-y-6">
      <UnifiedFiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        attributes={FILTER_ATTRIBUTES_OPTIONS}
        selectedAttributes={selectedAttributes}
        setSelectedAttributes={setSelectedAttributes}
        attributeFilterMode={attributeFilterMode}
        setAttributeFilterMode={setAttributeFilterMode}
        effects={FILTER_EFFECTS_OPTIONS}
        selectedEffects={selectedEffects}
        setSelectedEffects={setSelectedEffects}
        effectFilterMode={effectFilterMode}
        setEffectFilterMode={setEffectFilterMode}
        abilities={FILTER_ABILITIES_OPTIONS}
        selectedAbilities={selectedAbilities}
        setSelectedAbilities={setSelectedAbilities}
        abilityFilterMode={abilityFilterMode}
        setAbilityFilterMode={setAbilityFilterMode}
        attackTypes={FILTER_ATTACKTYPE_OPTIONS}
        selectedAttackTypes={selectedAttackTypes}
        setSelectedAttackTypes={setSelectedAttackTypes}
        attackTypeFilterMode={attackTypeFilterMode}
        setAttackTypeFilterMode={setAttackTypeFilterMode}
        toggleMulti={toggleMulti}
      />

      <EnemiesTable
        enemies={filteredEnemies}
        onSelect={(enemy) => {
          setSelectedEnemy(enemy);
          setIsDialogOpen(true);
        }}
      />

      <EnemyDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        enemy={selectedEnemy}
      />
    </div>
  );
}
