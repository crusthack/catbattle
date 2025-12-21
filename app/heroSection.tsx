import { Cat } from "lucide-react";

export default function HeroSection() {
  return (
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Cat className="w-16 h-16 text-orange-500" />
        </div>
        <h1 className="text-orange-500">냥코대전쟁 API</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          냥코대전쟁의 데이터와 API로 제공합니다
          <br/>아군, 적, 스테이지 정보를 확인하고 월간 미션을 관리하세요
        </p>
      </div>
  );
}