// lib/enemyLoader.ts
import * as fs from "fs";
import * as path from "path";

import { trait, attackType } from "@/types/cat";
import {Enemy, affect, ability} from "@/types/enemy"

// -------------------------------------------------------------
// 파일 경로
// -------------------------------------------------------------
const ENEMY_CSV = path.join(process.cwd(), "data/enemy/t_unit.csv");
const ENEMY_NAME_FILE = path.join(process.cwd(), "data/enemy/EnemyName.txt");
const ENEMY_DESC_FILE = path.join(process.cwd(), "data/enemy/EnemyExplanation.txt");

// -------------------------------------------------------------
// 안전한 trim
// -------------------------------------------------------------
const safeTrim = (v: any) =>
  typeof v === "string" ? v.trim() : "";

// -------------------------------------------------------------
// EnemyName: 인덱스 +2 매칭
// -------------------------------------------------------------
function loadEnemyNames(): Map<number, string> {
  const raw = fs.readFileSync(ENEMY_NAME_FILE, "utf8").replace(/\r/g, "");
  const map = new Map<number, string>();

  for (const line of raw.split("\n")) {
    if (!line.includes("\t")) continue;

    const [left, name] = line.split("\t");
    const baseId = parseInt(safeTrim(left));
    if (isNaN(baseId)) continue;

    map.set(baseId + 2, safeTrim(name));
  }
  return map;
}

// -------------------------------------------------------------
// EnemyExplanation: 인덱스 +2 매칭
// -------------------------------------------------------------
function loadEnemyDescriptions(): Map<number, string> {
  const raw = fs.readFileSync(ENEMY_DESC_FILE, "utf8").replace(/\r/g, "");
  const map = new Map<number, string>();

  for (const line of raw.split("\n")) {
    if (!line.includes("\t")) continue;

    const parts = line.split("\t");
    const baseId = parseInt(safeTrim(parts[0]));
    if (isNaN(baseId)) continue;

    const desc = safeTrim(parts.slice(1).join("\t"));
    map.set(baseId + 2, desc);
  }
  return map;
}

// -------------------------------------------------------------
// trait: cat 기준 trait만 사용
// -------------------------------------------------------------
const traitMap: Record<number, trait> = {
  10: "Red",      // 빨간적
  13: "Floating", // 떠있는 적
  14: "Black",    // 검은적
  15: "Metal",    // 메탈적
  16: "White",    // 무속성
  17: "Angel",    // 천사적
  18: "Alien",    // 에일리언
  19: "Zombie",   // 좀비
  72: "Relic",    // 고대종
  93: "Demon",    // 악마
  // --- Enemy only traits (표시 안 함) ---
  // 48: Witch
  // 49: Base
  // 71: EVA
  // 94: Baron 초생명체
  // 101: Beast
  // 104: Sage
};

// -------------------------------------------------------------
// affect
// -------------------------------------------------------------
function getEnemyAffects(v: number[]): affect[] {
  const out: affect[] = [];
  const add = (c: boolean, a: affect) => c && out.push(a);

  add(v[20] > 0, "Knockback");    // 날려버린다
  add(v[21] > 0, "Stop");         // 멈춘다
  add(v[23] > 0, "Slow");         // 느리게한다
  add(v[29] > 0, "Weak");         // 공격력다운
  // add(v[30] > 0, "MassiveDamage");
  // add(v[81] > 0, "InsaneDamage");
  // add(v[23] > 0, "Good");
  // add(v[29] > 0, "Resistant");
  // add(v[80] > 0, "InsanelyTough");
  add(v[73] > 0, "Curse");
  add(v[67] != 0, "Warp");
  add(v[67] < 0, "rWarp");
  add(v[77] > 0, "ImuATK");
  add(v[79] > 0, "Poison");

  return out;
}

// -------------------------------------------------------------
// abilities
// -------------------------------------------------------------
function getEnemyAbilities(v: number[]): ability[] {
  const out: ability[] = [];
  const add = (cond: boolean, name: ability) => { if (cond) out.push(name); };

  // -----------------------------------------
  // 🔥 공격 / 특수 공격 계열
  // -----------------------------------------
  add(v[25] > 0, "Critical");        // 25 크리 확률
  // add(v[43] > 0, "Metallic");        // 43 메탈
  add(v[75] > 0, "StrickAttack");    // 75 혼신의 일격 (확률)
  // StrickAttack 배율 v[76] 있지만 ability 판단은 플래그만

  add(v[35] > 0, "Wave");            // 35 파동 확률
  // 파동 레벨은 v[36]

  add(v[86] > 0, "MiniWave");        // 86 소파동 플래그
  // 소파동 확률: v[27], 파동레벨: v[28]

  add(v[102] > 0, "MiniWave");       // 102 소열파 플래그 (타입 이름은 같음)

  add(v[81] > 0, "Volcano");         // 81 열파 확률

  add(v[106] > 0, "Blast");          // 106 폭파 공격

  add(v[38] > 0, "WaveBlocker");     // 38 파동 삭제

  // -----------------------------------------
  // 🔥 기타 특수 상태
  // -----------------------------------------
  add(v[64] > 0, "Barrier");         // 64 베리어
  add(v[52] > 0, "Glass");           // 58 유리(한 방 유리몸)

  add(v[32] > 0, "AtkUp");           // 32 공격력 업
  // AtkUp 배율: v[33]

  add(v[26] > 0, "BaseDestroyer");   // 26 성 파괴 특기

  add(v[34] > 0, "LETHAL");          // 34 살아남는다 확률

  add(v[43] > 0, "Burrow");          // 43 버로우
  add(v[45] > 0, "Rebirth");         // 45 부활

  add(v[87] > 0, "DevilShield");     // 87 악마 실드
  add(v[89] > 0, "DeathVolcano");    // 89 순교(죽으면서 열파)

  add(v[94] > 0, "Colosus");   // 97 초생명체 특효
  add(v[101] > 0, "Behemoth"); // 105 초수 특효
  add(v[104] > 0, "Sage");     // 111 초현자 특효

  add(v[103] > 0, "VolcanoCounter"); // 103 열파 카운터

  // -----------------------------------------
  // 🔥 무효 계열
  // -----------------------------------------
  add(v[39] > 0, "ImuKB");       // 39 날려버린다 무효
  add(v[40] > 0, "ImuStop");     // 40 멈춘다 무효
  add(v[41] > 0, "ImuSlow");     // 41 느리게 한다 무효
  add(v[42] > 0, "ImuWeak");     // 42 공력력 다운 무효
  add(v[70] > 0, "ImuWarp");     // 70 워프 무효
  add(v[105] > 0, "ImuCurse");   // 105 저주 무효 ← 주의! BehemothSlayer도 105
  // add(v[90] > 0, "ImuPoison");   // 90 독 데미지 무효
  add(v[37] > 0, "ImuWave");     // 37 파동 데미지 무효
  add(v[85] > 0, "ImuVolcano");  // 85 열파 데미지 무효
  add(v[109] > 0, "ImuBlast");   // 109 폭파 데미지 무효

  return out;
}


// -------------------------------------------------------------
// attackType
// -------------------------------------------------------------
function getEnemyAttackTypes(v: number[]): attackType[] {
  const out: attackType[] = [];

  if (v[11] === 1) out.push("range");

  const ldr = v[36];
  if (ldr !== 0) out.push(ldr < 0 ? "omni" : "long");

  if (out.length === 0) out.push("single");
  return out;
}

// -------------------------------------------------------------
// 메인 enemy 파서
// -------------------------------------------------------------
export function loadAllEnemies(): Enemy[] {
  const names = loadEnemyNames();
  const descs = loadEnemyDescriptions();

  const raw = fs.readFileSync(ENEMY_CSV, "utf8").replace(/\r/g, "");
  const lines = raw.split("\n").filter((l) => safeTrim(l).length > 0);

  const out: Enemy[] = [];

  for (let row = 0; row < lines.length; row++) {
    const pure = safeTrim(lines[row].split("//")[0]);
    const v = pure.split(",").map((x) => parseInt(safeTrim(x)) || 0);

    while (v.length < 120) v.push(0);

    const id = row + 2;

    // 🔥 이름이 빈칸이면 건너뛰기
    const name = names.get(id)?.trim() ?? "";
    if (name.length === 0) continue;

    out.push({
      Id: id,
      Name: name,
      Descriptiont: descs.get(id) ?? "",
      Image: `https://battlecats-db.imgs-server.com/e${id.toString().padStart(3, "0")}.png`,

      Targets: Object.keys(traitMap)
        .map((k) => parseInt(k))
        .filter((idx) => v[idx] === 1)
        .map((idx) => traitMap[idx]),

      AttackType: getEnemyAttackTypes(v),
      Affects: getEnemyAffects(v),
      Abilities: getEnemyAbilities(v),

      Hp: v[0],
      Heatback: v[1],
      Speed: v[2],
      Atk: v[3],
      Tba: v[4] * 2,
      Range: v[5],
      Money: v[6],
      Width: v[8],
      PreAttackFrame: v[12],
      postAttackFrame: 0,
    });
  }
  return out;
}

// helper: load enemies by numeric id
export function loadEnemiesById(id: number): Enemy[] {
  if (typeof id !== 'number' || Number.isNaN(id)) return [];
  const all = loadAllEnemies();
  return all.filter((e) => e.Id === id);
}