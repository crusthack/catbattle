"use client";

interface FilterButtonProps {
  value: string;
  label: string;
  isSelected: boolean;
  colorClasses: string;
  onClick: () => void;
}

export default function FilterButton({
  label,
  isSelected,
  colorClasses,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-.5 rounded-lg border-2 whitespace-nowrap transition-all ${colorClasses}`}
    >
      {label}
    </button>
  );
}
