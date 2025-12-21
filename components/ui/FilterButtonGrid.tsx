"use client";

interface FilterButtonGridProps {
  children: React.ReactNode;
}

export default function FilterButtonGrid({ children }: FilterButtonGridProps) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}
