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

const variantStyles = {
  default: "bg-white dark:bg-gray-800 shadow-md hover:shadow-lg",
  outlined: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
  elevated: "bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl",
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const borderColors = {
  black: "border-black-200 dark:border-gray-600",
  blue: "border-blue-200 dark:border-blue-800",
  red: "border-red-200 dark:border-red-800",
  green: "border-green-200 dark:border-green-800",
  cyan: "border-cyan-200 dark:border-cyan-800",
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