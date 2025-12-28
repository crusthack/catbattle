"use client";

import { useEffect, useState } from "react";

async function checkUrl(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, {
            method: "GET",
            next: { revalidate: 60 },
        });
        console.log(res);
        return res.ok; // 200~299
    } catch {
        return false;
    }
}

export function getBlogLink() {
    const [blogUrl, setBlogUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function resolveBlogUrl() {
            // 1순위 Blog
            if (await checkUrl("https://crusthack.github.io/blog/")) {
                if (!cancelled) setBlogUrl("https://crusthack.github.io/blog/");
                return;
            }
            // 2순위 임시 블로그
            if (await checkUrl("https://crusthack.github.io/blogtemp/")) {
                if (!cancelled) setBlogUrl("https://crusthack.github.io/blogtemp/");
                return;
            }

            if (!cancelled) setBlogUrl(null);
        }

        resolveBlogUrl().finally(() => {
            if (!cancelled) setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return { blogUrl, loading };
}