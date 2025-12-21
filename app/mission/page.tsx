// Server component: loads data using server-only loaders and passes to client UI
import type { Stage as Stage } from "@/types/stage";
import type { Enemy } from "@/types/enemy";
import { loadAllEnemies } from "@/lib/enemyLoader";
import { loadStages } from "@/lib/stageLoader";
import MissionClient from "./MissionClient";

export default function MonthlyMissionPage() {
  const enemies: Enemy[] = loadAllEnemies();
  const stages: Stage[] = loadStages();

  return <MissionClient enemies={enemies} stages={stages} />;
}
