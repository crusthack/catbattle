import { notFound } from "next/navigation";
import { loadAllEnemies, loadEnemiesById } from "@/lib/enemyLoader";
import Image from "next/image";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const enemies = await loadAllEnemies();
    return enemies.map((enemy) => ({
        id: enemy.Id.toString().padStart(3, "0"),
    }));
}

export default async function EnemyDetailPage({ params }: PageProps) {
    const { id } = await params;
    const numericId = parseInt(id);

    if (isNaN(numericId)) {
        notFound();
    }

    const enemies = await loadEnemiesById(numericId);

    if (!enemies || enemies.length === 0) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans leading-relaxed">
            {/* Header */}
            <header className="bg-gradient-to-br from-red-600 to-red-400 text-white py-8">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <a
                        href="/enemy"
                        className="inline-block mb-4 text-white/90 hover:text-white transition-colors"
                    >
                        ← 적 목록으로 돌아가기
                    </a>

                    <div className="text-4xl font-bold">
                        적 #{numericId}
                    </div>
                    <div className="text-lg opacity-80">
                        {enemies[0].Name}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">
                {enemies.map((enemy, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-lg rounded-2xl overflow-hidden"
                    >
                        {/* Form Header */}
                        <div className="bg-gray-200 px-6 py-4 flex justify-between items-center">
                            <div className="text-xl font-bold">
                                {enemy.Name}
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left — Image + Description */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl h-64 relative">
                                        {enemy.Image ? (
                                            <Image
                                                src={enemy.Image}
                                                alt={enemy.Name}
                                                fill
                                                className="object-contain p-4"
                                            />
                                        ) : (
                                            <span className="flex items-center justify-center h-full text-gray-500">
                                                (이미지 없음)
                                            </span>
                                        )}
                                </div>

                                <div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        설명
                                    </div>
                                    <div
                                        className="text-gray-800 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: enemy.Descriptiont }}
                                    />
                                </div>
                            </div>

                            {/* Right — Stats */}
                            <div className="space-y-4">
                                {/* 기본 스탯 */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        기본 스탯
                                    </div>
                                    <ul className="text-gray-800 text-sm space-y-1">
                                        <li>HP: {enemy.Hp}</li>
                                        <li>넉백: {enemy.Heatback}</li>
                                        <li>공격력: {enemy.Atk}</li>
                                        <li>사거리: {enemy.Range}</li>
                                        <li>속도: {enemy.Speed}</li>
                                        <li>격파시 머니: {enemy.Money}</li>
                                        <li>TBA(공격 간격): {enemy.Tba}</li>
                                        <li>선딜: {enemy.PreAttackFrame}</li>
                                        <li>폭: {enemy.Width}</li>
                                    </ul>
                                </div>

                                {/* 공격 타입 */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        공격 타입
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(Array.isArray(enemy.AttackType) ? enemy.AttackType : []).map((t, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 속성 */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        속성(Target traits)
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(Array.isArray(enemy.Targets) ? enemy.Targets : []).map((t, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-100 text-purple-600 rounded-md text-xs">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 능력 */}
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-2">
                                        특수 능력(Abilities)
                                    </div>
                                    {(Array.isArray(enemy.Abilities) && enemy.Abilities.length > 0) ? (
                                        <div className="flex flex-wrap gap-2">
                                            {(Array.isArray(enemy.Abilities) ? enemy.Abilities : []).map((a, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                                                    {a}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-sm">
                                            (능력 없음)
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
