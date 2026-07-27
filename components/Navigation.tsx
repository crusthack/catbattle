"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, Dog, Map, Calendar, Home, ChartColumn, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/components/ThemeProvider";

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  const pages = [
    { id: "/", label: "홈", icon: Home },
    { id: "/cat", label: "아군 캐릭터", icon: Cat },
    { id: "/enemy", label: "적 캐릭터", icon: Dog },
    { id: "/stages", label: "스테이지", icon: Map },
    { id: "/mission", label: "월간 미션", icon: Calendar },
    { id: "/stats", label: "통계", icon: ChartColumn },
  ];

  return (
    <nav className="border-b bg-white dark:bg-gray-900 dark:border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-4">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Cat className="w-8 h-8 text-orange-500" />
            <h1 className="text-orange-500">냥코대전쟁 API</h1>
          </Link>

          <div className="flex gap-2 flex-wrap">
            {pages.map((page) => {
              const Icon = page.icon;
              const isActive = pathname === page.id;

              return (
                <Link key={page.id} href={page.id}>
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {page.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="테마 전환"
            >
              {theme === "dark"
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
