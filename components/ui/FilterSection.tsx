"use client";

import { ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  hasMode?: boolean;
  mode?: "OR" | "AND";
  onModeChange?: (mode: "OR" | "AND") => void;
}

export default function FilterSection({
  title,
  children,
  hasMode = false,
  mode = "OR",
  onModeChange,
}: FilterSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>{title}</h3>

        {hasMode && onModeChange && (
          <div className="flex gap-2 items-center">
            <span className="text-gray-600">필터 모드:</span>

            <button
              onClick={() => onModeChange("OR")}
              className={`px-3 py-.5 rounded-md border ${
                mode === "OR"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
            >
              OR
            </button>

            <button
              onClick={() => onModeChange("AND")}
              className={`px-3 py-.5 rounded-md border ${
                mode === "AND"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
              }`}
            >
              AND
            </button>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
