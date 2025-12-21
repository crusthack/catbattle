import HeroSection from "@/app/heroSection";
import FeatureGrid, { Feature } from "@/app/featureGrid";

export const features: Feature[] = [
  {
    icon: "cat",
    color: "blue",
    title: "아군 캐릭터",
    description: "아군 캐릭터 도감",
    href: "cat",
    buttonText: "아군 캐릭터 목록 확인",
    width: 2,
  },
  {
    icon: "dog",
    color: "red",
    title: "적 캐릭터",
    description: "적 캐릭터 도감",
    href: "enemy",
    buttonText: "적 캐릭터 목록 확인",
    width: 2,
  },
  {
    icon: "map",
    color: "green",
    title: "스테이지",
    description: "스테이지 정보",
    href: "stages",
    buttonText: "스테이지 정보 확인",
    width: 2,
  },
  {
    icon: "calendar",
    color: "cyan",
    title: "월간미션",
    description: "미션도우미",
    href: "mission",
    buttonText: "미션 수행하기",
    width: 3,
  },
  {
    icon: "chart",
    color: "blue",
    title: "통계",
    description: "API 사용 가이드",
    href: "stats",
    buttonText: "통계 보기",
    width: 3,
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <HeroSection />

      {/* Main Categories - 4 Cards */}
      <FeatureGrid features={features}/>
    </div>
  ); 
}
