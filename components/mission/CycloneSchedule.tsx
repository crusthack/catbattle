"use client";

import React from "react";

const ROWS = [
    { day: "월", stage: "적색카타스트로프" },
    { day: "화", stage: "롤링데드" },
    { day: "화", stage: "긴급폭풍경보" },
    { day: "수", stage: "다크니스헤븐" },
    { day: "목", stage: "절망적인이차원" },
    { day: "금", stage: "국사무쌍" },
    { day: "토", stage: "천벌" },
    { day: "일", stage: "절망신차원" },
    { day: "일", stage: "아이언 냥코" },
];

function getTodayDay() {
    return ["일","월","화","수","목","금","토"][new Date().getDay()];
}

export default function CycloneSchedule({ className = "" }: { className?: string }) {
    const today = getTodayDay();
    return (
        <div className={className}>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mb-1 uppercase tracking-widest">사이클론</p>
            <table className="text-xs border-collapse w-full">
                <tbody>
                    {ROWS.map(({ day, stage }) => {
                        const isToday = day === today;
                        return (
                            <tr
                                key={stage}
                                className={isToday ? "bg-indigo-50 dark:bg-indigo-950/40 font-semibold" : ""}
                            >
                                <td className={`pr-2 py-px tabular-nums ${isToday ? "text-indigo-600" : "text-gray-400 dark:text-gray-500"}`}>
                                    {day}
                                </td>
                                <td className={`py-px text-right ${isToday ? "text-indigo-700" : "text-gray-600 dark:text-gray-300"}`}>
                                    {stage}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
