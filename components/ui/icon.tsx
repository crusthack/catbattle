import { theme } from "@/types/common";
import { cn } from "./utils";
import { Cat, Dog, Map, Calendar, FileText, Activity, ChartColumn } from 'lucide-react';


export interface IconProps {
    className?: string;  // 추가 CSS 클래스
    icon: string;
    color?: theme;
}

const IconColors = {
    "black": "bg-black-100 group-hover:bg-black-200",
    "blue": "bg-blue-100 group-hover:bg-blue-200",
    "cyan": "bg-cyan-100 group-hover:bg-cyan-200",
    "red": "bg-red-100 group-hover:bg-red-200",
    "green": "bg-green-100 group-hover:bg-green-200"
}

const IconMap = {
    cat: Cat,
    dog: Dog,
    map: Map,
    calendar: Calendar,
    file: FileText,
    activity: Activity,
    chart: ChartColumn,
};

const IconTextColors = {
    black: "text-gray-800",
    blue: "text-blue-600",
    cyan: "text-cyan-600",
    red: "text-red-600",
    green: "text-green-600",
};

export default function Icon({
    className = "",
    icon,
    color = "black"
}: IconProps) {
    const IconComponent = IconMap[icon as keyof typeof IconMap] ?? Cat;
    return (
        <div className={cn(
            "w-16 h-16 flex items-center justify-center rounded-full transition-colors",
            IconColors[color],
            className // 추가 클래스
        )}>
            <IconComponent className={cn("w-8 h-8", IconTextColors[color])} />
        </div>
    )
}