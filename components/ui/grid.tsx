import { ReactNode } from "react";
import { cn } from "./utils";

interface GridProps {
  children: ReactNode;
  columns?: {
    default?: number; // 기본 열 수
    md?: number; // 중간 화면 열 수
    lg?: number; // 큰 화면 열 수
  };
  gap?: "sm" | "md" | "lg"; // 간격 크기
  className?: string;
  marginBottom?: boolean; // 하단 여백 여부
}

const gapStyles = {
  sm: "gap-4", // 1rem
  md: "gap-6", // 1.5rem
  lg: "gap-8", // 2rem
};

// 열 수별 그리드 클래스 (Tailwind가 인식하도록 미리 정의)
const gridColStyles: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const gridColMdStyles: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
};

const gridColLgStyles: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export default function Grid({
  children,
  columns = { default: 1, md: 2 },
  gap = "md",
  className,
  marginBottom = true,
}: GridProps) {
  const defaultCol = columns.default || 1;
  const mdCol = columns.md;
  const lgCol = columns.lg;

  return (
    <div
      className={cn(
        "grid",
        gridColStyles[defaultCol],
        mdCol ? gridColMdStyles[mdCol] : undefined,
        lgCol ? gridColLgStyles[lgCol] : undefined,
        gapStyles[gap],
        marginBottom ? "mb-12" : undefined,
        className
      )}
    >
      {children}
    </div>
  );
}