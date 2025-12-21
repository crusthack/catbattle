"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cat, Dog, Map, Calendar, Home, ChartColumn, Icon } from "lucide-react";
import { Button } from "./ui/button";
import { getBlogLink } from "@/lib/getBlogURL";

export default function Navigation() {
  const pathname = usePathname();
  const { blogUrl, loading } = getBlogLink();
  const pages = [
    { id: "/", label: "홈", icon: Home },
    { id: "/cat", label: "아군 캐릭터", icon: Cat },
    { id: "/enemy", label: "적 캐릭터", icon: Dog },
    { id: "/stages", label: "스테이지", icon: Map },
    { id: "/mission", label: "월간 미션", icon: Calendar },
    { id: "/stats", label: "통계", icon: ChartColumn },
  ];

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
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
          <div>
            <Link href="https://crusthack.github.io/blogtemp/Web/catbattle" target="_blank" rel="noopener noreferrer" className="ml-6 text-cyan-800 hover:opacity-80">
              웹사이트 설명(블로그)
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {loading ? (
              <>
                <LoadingSpinner />
                <span className="text-sm text-gray-400">블로그 확인 중…</span>
              </>
            ) : (
              <Link
                href={blogUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-800 hover:opacity-80"
              >
                개발자 블로그 가기
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function LoadingSpinner() {
  return (
    <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
  );
}
