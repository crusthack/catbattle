import { ReactNode } from "react";
import { cn } from "./utils";
import { theme } from "@/types/common";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode; // 카드 안에 들어갈 내용
  className?: string;  // 추가 CSS 클래스
  variant?: "default" | "outlined" | "elevated"; // 스타일 변형
  padding?: "sm" | "md" | "lg"; // 안쪽 여백 크기
  color?: theme;
}

// variant별 스타일 정의
const variantStyles = {
  default: "bg-white shadow-md hover:shadow-lg",
  outlined: "bg-white border border-gray-200 hover:border-gray-300",
  elevated: "bg-white shadow-lg hover:shadow-xl",
};

// padding별 스타일 정의
const paddingStyles = {
  sm: "p-4", // 작은 여백 (1rem)
  md: "p-6", // 중간 여백 (1.5rem)
  lg: "p-8", // 큰 여백 (2rem)
};  

const borderColors = {
  black: "border-black-200",
  blue: "border-blue-200",
  red: "border-red-200",
  green: "border-green-200",
  cyan: "border-cyan-200",
  
}

export default function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  color = "black",
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg transition-shadow cursor-pointer group border-2 flex flex-col text-center items-center gap-6 w-full max-w-full min-w-0",
        variantStyles[variant],
        paddingStyles[padding],
        borderColors[color],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}