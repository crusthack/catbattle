// Server component: loads data on the server and renders StatsClient
import type { Cat } from "@/types/cat";
import type { Enemy } from "@/types/enemy";
import type { Stage } from "@/types/stage";

import { loadAllCats } from "@/lib/catsLoader";
import { loadAllEnemies } from "@/lib/enemyLoader";
import { loadStages } from "@/lib/stageLoader";
import StatsClient from "@/app/stats/StatsClient";

export default function StatsPage() {
  const cats: Cat[] = loadAllCats();
  const enemies: Enemy[] = loadAllEnemies();
  const stages: Stage[] = loadStages();

  return <StatsClient cats={cats} enemies={enemies} stages={stages} />;
}
