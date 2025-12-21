"use client";

import { Input } from "@/components/ui/input";
import Card from "@/components/ui/card";
import GenericFilter from "@/components/common/GenericFilter";

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterGroupOption {
  group: string;
  value: string;
  label: string;
  color?: string;
}

interface UnifiedFiltersPanelProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;

  rarities?: FilterOption[];
  selectedRarity?: string[];
  setSelectedRarity?: React.Dispatch<React.SetStateAction<string[]>>;

  attributes?: FilterOption[];
  selectedAttributes?: string[];
  setSelectedAttributes?: React.Dispatch<React.SetStateAction<string[]>>;

  targets?: FilterOption[];
  selectedTargets?: string[];
  setSelectedTargets?: React.Dispatch<React.SetStateAction<string[]>>;
  targetFilterMode?: "OR" | "AND";
  setTargetFilterMode?: (v: "OR" | "AND") => void;

  attributeFilterMode?: "OR" | "AND";
  setAttributeFilterMode?: (v: "OR" | "AND") => void;

  effects?: FilterGroupOption[];
  selectedEffects?: string[];
  setSelectedEffects?: React.Dispatch<React.SetStateAction<string[]>>;
  effectFilterMode?: "OR" | "AND";
  setEffectFilterMode?: (v: "OR" | "AND") => void;

  abilities?: FilterGroupOption[];
  selectedAbilities?: string[];
  setSelectedAbilities?: React.Dispatch<React.SetStateAction<string[]>>;
  abilityFilterMode?: "OR" | "AND";
  setAbilityFilterMode?: (v: "OR" | "AND") => void;

  attackTypes?: FilterOption[];
  selectedAttackTypes?: string[];
  setSelectedAttackTypes?: React.Dispatch<React.SetStateAction<string[]>>;
  attackTypeFilterMode?: "OR" | "AND";
  setAttackTypeFilterMode?: (v: "OR" | "AND") => void;

  // getColorClasses is no longer required; GenericFilter uses library defaults
  toggleMulti: (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => void;
}

export default function UnifiedFiltersPanel({
  searchTerm,
  setSearchTerm,
  rarities,
  selectedRarity,
  setSelectedRarity,
  attributes,
  selectedAttributes,
  setSelectedAttributes,
  targets,
  selectedTargets,
  setSelectedTargets,
  targetFilterMode = "OR",
  setTargetFilterMode,
  attributeFilterMode = "OR",
  setAttributeFilterMode,
  effects,
  selectedEffects,
  setSelectedEffects,
  effectFilterMode = "OR",
  setEffectFilterMode,
  abilities,
  selectedAbilities,
  setSelectedAbilities,
  abilityFilterMode = "OR",
  setAbilityFilterMode,
  attackTypes,
  selectedAttackTypes,
  setSelectedAttackTypes,
  attackTypeFilterMode = "OR",
  setAttackTypeFilterMode,
  toggleMulti,
}: UnifiedFiltersPanelProps) {
  return (
    <>
      <Input
        type="text"
        placeholder="검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <Card className="p-6">
        <div className="w-full space-y-6">
          {/* Rarity Filter (Cat only) now uses GenericFilter */}
          {rarities && selectedRarity && setSelectedRarity && (
            <GenericFilter
              title="등급 필터"
              options={rarities}
              selected={selectedRarity}
              onSelect={(value) => toggleMulti(value, setSelectedRarity)}
              
            />
          )}

          {/* Attributes / Targets / AttackTypes / Abilities / Effects handled by generic filter */}
          {attributes && selectedAttributes && setSelectedAttributes && (
            <GenericFilter
              title="속성 필터"
              options={attributes}
              selected={selectedAttributes}
              onSelect={(value) => toggleMulti(value, setSelectedAttributes)}
              filterMode={attributeFilterMode}
              onModeChange={setAttributeFilterMode}
              
            />
          )}

          {targets && selectedTargets && setSelectedTargets && (
            <GenericFilter
              title="타겟 필터"
              options={targets}
              selected={selectedTargets}
              onSelect={(value) => toggleMulti(value, setSelectedTargets)}
              filterMode={targetFilterMode}
              onModeChange={setTargetFilterMode}
              
            />
          )}

          {effects && selectedEffects && setSelectedEffects && (
            <GenericFilter
              title="효과 필터"
              options={effects}
              selected={selectedEffects}
              onSelect={(value) => toggleMulti(value, setSelectedEffects)}
              filterMode={effectFilterMode}
              onModeChange={setEffectFilterMode}
              
            />
          )}

          {attackTypes && selectedAttackTypes && setSelectedAttackTypes && (
            <GenericFilter
              title="공격 타입 필터"
              options={attackTypes}
              selected={selectedAttackTypes}
              onSelect={(value) => toggleMulti(value, setSelectedAttackTypes)}
              filterMode={attackTypeFilterMode}
              onModeChange={setAttackTypeFilterMode}
              
            />
          )}

          {abilities && selectedAbilities && setSelectedAbilities && (
            <GenericFilter
              title="능력 필터"
              options={abilities}
              selected={selectedAbilities}
              onSelect={(value) => toggleMulti(value, setSelectedAbilities)}
              filterMode={abilityFilterMode}
              onModeChange={setAbilityFilterMode}
              
            />
          )}
        </div>
      </Card>
    </>
  );
}
