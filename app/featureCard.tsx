import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { theme } from "@/types/common";

interface FeatureCardProps {
    color?: theme; // 색
    icon?: string; // 아이콘
    width?: number; // 너비 md:col-span-n
    title: string; // 제목
    description: string; // 설명
    href: string; // 링크 주소
    buttonText: string; // 버튼 텍스트
}

function getWidth(n: number): string {
    return "md:col-span-" + n;
}

function getTitleColor(color: string): string{
    return "text-" + color + "-600";
}

export default function FeatureCard({
    color = "black",
    icon = "",
    width = 1,
    title,
    description,
    href,
    buttonText,
}: FeatureCardProps) {
    return (
        <div className={getWidth(width)}>
            <Link href={href}>
                <Card color={color}
                >
                    <Icon icon={icon} color={color}/>
                    <div>
                        <h3 className={getTitleColor(color)}>{title}</h3>
                        <p className="text-gray-600">{description}</p>
                    </div>
                    <Button color={color} className="w-full gap-2">
                        {buttonText}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Card>
            </Link>
        </div>
    )
}