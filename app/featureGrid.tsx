import FeatureCard from "@/app/featureCard";
import { theme as colors } from "@/types/common";

export interface Feature {
    icon: string;
    title: string;
    description: string;
    href: string;
    buttonText: string;
    color: colors;
    width: number;
}

interface FeatureGridProps {
    features: Feature[]; // Feature 배열
}

export default function FeatureGrid({ features }: FeatureGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-6">
            {features.map((feature, index) => (
                // 배열을 map으로 순회하며 각 FeatureCard 생성
                <FeatureCard
                    key={index} // React에서 리스트 렌더링 시 필요
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    href={feature.href}
                    buttonText={feature.buttonText}
                    color={feature.color}
                    width={feature.width}
                />
            ))}
        </div>
    );
}