"use client";

import { useMemo, useState, useEffect } from "react";
import { getColorClasses as defaultGetColorClasses } from "@/lib/colorUtils";
import FilterSection from "@/components/ui/FilterSection";
import FilterButton from "@/components/ui/FilterButton";
import FilterButtonGrid from "@/components/ui/FilterButtonGrid";

type Option = { value: string; label: string; color?: string };
type GroupOption = { group: string; value: string; label: string; color?: string };

interface GenericFilterProps {
  title?: string;
  options: Option[] | GroupOption[];
  selected: string[];
  onSelect: (value: string) => void;
  filterMode?: "OR" | "AND";
  onModeChange?: (mode: "OR" | "AND") => void;
  showModeToggle?: boolean;
  getColorClasses?: (color: string, isSelected: boolean) => string;
}

export default function GenericFilter({
  title = "필터",
  options,
  selected,
  onSelect,
  filterMode = "OR",
  onModeChange,
  showModeToggle = true,
  getColorClasses,
}: GenericFilterProps) {
  const isGrouped = useMemo(() => {
    return options.length > 0 && (options[0] as any).group !== undefined;
  }, [options]);

  // internal mode state when parent doesn't control it via onModeChange
  const [internalMode, setInternalMode] = useState<"OR" | "AND">(filterMode);

  // sync internal mode if parent provides filterMode
  useEffect(() => {
    setInternalMode(filterMode);
  }, [filterMode]);

  const effectiveMode = showModeToggle ? (onModeChange ? filterMode : internalMode) : "OR";

  const handleModeChange = (mode: "OR" | "AND") => {
    if (onModeChange) onModeChange(mode);
    else setInternalMode(mode);
  };

  const colorFn = getColorClasses ?? defaultGetColorClasses;

  const grouped = useMemo(() => {
    if (!isGrouped) return [] as [string, GroupOption[]][];
    return Object.entries(
      (options as GroupOption[]).reduce((acc: Record<string, GroupOption[]>, o) => {
        acc[o.group] ||= [];
        acc[o.group].push(o);
        return acc;
      }, {})
    );
  }, [isGrouped, options]);

  return (
    <FilterSection
      title={title}
      hasMode={showModeToggle}
      mode={effectiveMode}
      onModeChange={showModeToggle ? handleModeChange : undefined}
    >
      {isGrouped ? (
        grouped.map(([group, list]) => (
          <div key={group} className="mb-4">
            <FilterButtonGrid>
              {list.map((o) => (
                <FilterButton
                  key={o.value}
                  value={o.value}
                  label={o.label}
                  isSelected={selected.includes(o.value)}
                    colorClasses={colorFn(o.color ?? "gray", selected.includes(o.value))}
                  onClick={() => onSelect(o.value)}
                />
              ))}
            </FilterButtonGrid>
          </div>
        ))
      ) : (
        <FilterButtonGrid>
          {(options as Option[]).map((o) => (
            <FilterButton
              key={o.value}
              value={o.value}
              label={o.label}
              isSelected={selected.includes(o.value)}
              colorClasses={colorFn(o.color ?? "gray", selected.includes(o.value))}
              onClick={() => onSelect(o.value)}
            />
          ))}
        </FilterButtonGrid>
      )}
    </FilterSection>
  );
}
