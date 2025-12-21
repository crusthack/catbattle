// lib/stageLoader.ts
import * as fs from "fs";
import * as path from "path";
import { StageEnemySpawnData, Stage, RawEnemyLine } from "@/types/stage";

// -------------------------------------------------------------
// 경로 상수
// -------------------------------------------------------------
const BASE = process.cwd();

// stageNormal 계열
const STAGE_NORMAL_DIR = path.join(BASE, "data/Stage/CH/stageNormal");

// 세계편 (맵 9) 스테이지 csv
const WORLD_NORMAL_STAGE_DIR = path.join(BASE, "data/Stage/CH/stage");
// 미래편 (맵 4,5,6) 스테이지 csv
const WORLD_ITF_STAGE_DIR = path.join(BASE, "data/Stage/CH/stageW");
// 우주편 스테이지 csv
const WORLD_COSMOS_DIR = path.join(BASE, "data/Stage/CH/stageSpace");
// 레전드 스테이지
const WORLD_LEGEND_STAGE_DIR = path.join(BASE, "data/Stage");

// 이름 파일
const STAGE_NAME_FILE = path.join(BASE, "data/StageName.txt");
// -------------------------------------------------------------
// 유틸
// -------------------------------------------------------------
const safeTrim = (v: any) => (typeof v === "string" ? v.trim() : "");
const toInt = (s: string, def = 0) => {
  const n = parseInt(safeTrim(s), 10);
  return Number.isNaN(n) ? def : n;
};
// -------------------------------------------------------------
// StageName.txt 를 계층 구조로 파싱해서 Story -> Map -> Stage 배열을 생성
// 반환 형식:
// [ { storyId, name?, maps: [ { mapId, name?, stages: [ { stageId, name? } ] } ] } ]
// -------------------------------------------------------------
export function loadStages(): Stage[] {
  const raw = fs.readFileSync(STAGE_NAME_FILE, "utf8").replace(/\r/g, "");

  // maps to store names
  const storyNames = new Map<number, string>();
  const mapNames = new Map<number, Map<number, string>>();
  const stageNames = new Map<number, Map<number, Map<number, string>>>();

  for (const line of raw.split("\n")) {
    const pure = safeTrim(line);
    if (!pure) continue;

    const parts = pure.split(/\s+/);
    if (parts.length < 2) continue;

    const code = parts[0];
    const name = parts.slice(1).join(" ");
    const codeParts = code.split("-");
    if (codeParts.length < 1) continue;

    const storyId = Number(codeParts[0]);
    if (Number.isNaN(storyId)) continue;

    if (codeParts.length === 1) {
      storyNames.set(storyId, name);
      continue;
    }

    const mapId = Number(codeParts[1]);
    if (Number.isNaN(mapId)) continue;

    if (!mapNames.has(storyId)) mapNames.set(storyId, new Map());
    if (codeParts.length === 2) {
      mapNames.get(storyId)!.set(mapId, name);
      continue;
    }

    const stageId = Number(codeParts[2]);
    if (Number.isNaN(stageId)) continue;

    if (!stageNames.has(storyId)) stageNames.set(storyId, new Map());
    const mapStage = stageNames.get(storyId)!;
    if (!mapStage.has(mapId)) mapStage.set(mapId, new Map());
    mapStage.get(mapId)!.set(stageId, name);
  }

  const out: Stage[] = [];
  const ALLOWED_STORIES = new Set<number>([3, 0, 13, 34]);

  for (const [storyId, maps] of stageNames.entries()) {
    if (!ALLOWED_STORIES.has(storyId)) continue;
    const storyName = storyNames.get(storyId) ?? "";
    for (const [mapId, stagesMap] of maps.entries()) {
      const mapName = mapNames.get(storyId)?.get(mapId) ?? "";
      for (const [stageId, stageName] of stagesMap.entries()) {
        out.push({
          StoryId: storyId,
          MapId: mapId,
          StageId: stageId,
          StoryName: storyName,
          MapName: mapName,
          StageName: stageName,
          EnemiesData: loadStageEnemyInfo(storyId, mapId, stageId),
          Energy: loadEnergyInfo(storyId, mapId, stageId),
        });
      }
    }
  }
  for(const s of out) {
    if(s.StoryId === 13){
      // console.log(s);
    }
  }
  return out.filter(s => s.Energy > 0);
}

function loadEnergyInfo(StoryId: number, MapId: number, StageId: number): number {
  let filePath = "";
  if (StoryId === 3) { // 세계편, 미래편, 우주편
    if (MapId === 9) { // 세계편
      filePath = path.join(STAGE_NORMAL_DIR, "stageNormal0.csv");
    }
    else if ([3, 4, 5].includes(MapId)) { // 미래편
      filePath = path.join(STAGE_NORMAL_DIR, `stageNormal1_${MapId - 3}.csv`);
    }
    else if ([6, 7, 8].includes(MapId)) { // 우주편
      filePath = path.join(STAGE_NORMAL_DIR, `stageNormal1_${MapId - 6}.csv`);
    }
  }
  else if( StoryId === 0) { // 레전드 스토리
    filePath = path.join(WORLD_LEGEND_STAGE_DIR, `/N/MSDN/MapStageDataN_${MapId.toString().padStart(3, "0")}.csv`);
  }
  else if( StoryId === 13) { // 신 레전드 스토리
    filePath = path.join(WORLD_LEGEND_STAGE_DIR, `/A/MSDNA/MapStageDataNA_${MapId.toString().padStart(3, "0")}.csv`);
  }
  else if( StoryId === 34) { // 레전드 스토리 0
    filePath = path.join(WORLD_LEGEND_STAGE_DIR, `/ND/MSDND/MapStageDataND_${MapId.toString().padStart(3, "0")}.csv`);
  }

  if (filePath === "" || !fs.existsSync(filePath)) {
    return 0;
  }

  const raw = fs.readFileSync(filePath, "utf8").replace(/\r/g, "");
  const lines = raw.split("\n");
  if (lines.length <= StageId) {
    return 0;
  }
  const line = lines[StageId + 2]; // 헤더 2줄 스킵
  const parts = line.split(",");
  if (parts.length === 0) {
    return 0;
  }
  const energy = Number(parts[0]);
  if (Number.isNaN(energy)) {
    return 0;
  }
  return energy;
}

function loadStageEnemyInfo(StoryId: number, MapId: number, StageId: number): StageEnemySpawnData[] {
  let filePath = "";
  if (StoryId === 3) { // 세계편, 미래편, 우주편
    if (MapId === 9) { // 세계편
      filePath = path.join(WORLD_NORMAL_STAGE_DIR, `stage${StageId.toString().padStart(2, "0")}.csv`);
    }
    else if ([3, 4, 5].includes(MapId)) { // 미래편
      filePath = path.join(WORLD_ITF_STAGE_DIR,
        `stageW${(MapId + 1).toString().padStart(2, "0")}_${StageId.toString().padStart(2, "0")}.csv`);
    }
    else if ([6, 7, 8].includes(MapId)) { // 우주편
      filePath = path.join(WORLD_COSMOS_DIR,
        `stageSpace${(MapId + 1).toString().padStart(2, "0")}_${StageId.toString().padStart(2, "0")}.csv`);
    }
  }
  else if( StoryId === 0) { // 레전드 스토리
    filePath = path.join(WORLD_LEGEND_STAGE_DIR, `/N/StageRN/stageRN${MapId.toString().padStart(3, "0")}_${StageId.toString().padStart(2, "0")}.csv`);
  }
  else if( StoryId === 13) { // 신 레전드 스토리
    filePath = path.join(WORLD_LEGEND_STAGE_DIR, `/A/StageRNA/stageRNA${MapId.toString().padStart(3, "0")}_${StageId.toString().padStart(2, "0")}.csv`);
  }
  else if( StoryId === 34) { // 레전드 스토리 0
    filePath = path.join(WORLD_LEGEND_STAGE_DIR, `/ND/StageRND/stageRND${MapId.toString().padStart(3, "0")}_${StageId.toString().padStart(2, "0")}.csv`);
  }
  if (filePath === "" || !fs.existsSync(filePath)) {
    return [];
  }
  
  const raw = fs.readFileSync(filePath, "utf8").replace(/\r/g, "");
  const lines = raw.split("\n");
  const enemies: RawEnemyLine[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const pure = safeTrim(line.split("//")[0]);
    if (!pure || !pure.includes(",")) continue;

    const parts = pure.split(",").map((x) => safeTrim(x));
    const nums = parts.map((x) => toInt(x, 0));

    if (pure.startsWith("0,")) break;

    while (nums.length < 10) nums.push(0);
    // id, 출현수, 첫등장F, 재등장 최저F, 재등장 최고F, 성체력%, z층최소, z층최대, 킬카운트, 배율
    enemies.push({
      Raw: nums.slice(),
      EnemyId: nums[0],
      Amount: nums[1],
      spawn_0: nums[2] * 2,
      RespawnMinF: nums[3] * 2,
      RespawnMaxF: nums[4] * 2,
      castle_0: nums[5],
      MinLayer: nums[6],
      MaxLayer: nums[7],
      IsBoss: nums[8],
      Magnification: nums[9],
      Spawn_1: nums[10] * 2,
      Castle_1: nums[11],
      Group: nums[12],
      Mult_Atk: nums[13],
      KillCount: nums[14],
    });
  }

  return enemies.map((e) => {
    const out = {
      enemyId: e.EnemyId,
      magnification: e.Magnification,
      castleHp: e.castle_0,
      timer: e.spawn_0 ? e.spawn_0 : 0,
    } as StageEnemySpawnData;
    // console.log(out);
    return out;
  });
}