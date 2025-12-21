// app/cat/page.tsx
import { loadAllEnemies } from "@/lib/enemyLoader";
import EnemyPage from "@/components/enemy/EnemyPage";

export default async function Page() {
  const enemies = await loadAllEnemies();      // SSR + 파일 읽기
  return <EnemyPage enemiess={enemies} />;  // CSR에 데이터 전달
}
