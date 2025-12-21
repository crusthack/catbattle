/**
 * 번역 딕셔너리 모음
 * - AllyCatsPage, EnemyCatsPage, CatsTable, EnemiesTable 등에서 공유
 * - 일관성 있는 텍스트 표시를 위해 중앙화
 */

export const TARGET_KO: Record<string, string> = {
  Red: "빨간적",
  Floating: "떠있는적",
  Black: "검은적",
  Metal: "메탈적",
  Angel: "천사",
  Alien: "에이리언",
  Zombie: "좀비",
  Relic: "고대종",
  Demon: "악마",
  White: "무속성",
};

export const AFFECT_KO: Record<string, string> = {
  Slow: "느리게 한다",
  Stop: "멈춘다",
  Knockback: "날려버린다",
  Weak: "공격력 다운",
  MassiveDamage: "초 데미지",
  InsaneDamage: "극 데미지",
  Good: "엄청 강하다",
  Resistant: "맷집이 좋다",
  InsanelyTough: "초 맷집이 좋다",
  Curse: "저주",
  Only: "타겟 한정",
  Warp: "워프",
  ImuATK: "공격 무효",
  rWarp: "역워프",
  Poison: "독 공격",
};

export const ABILITY_KO: Record<string, string> = {
  AtkUp: "공격력 업",
  LETHAL: "살아남는다",
  BaseDestroyer: "성 파괴 특기",
  Critical: "크리티컬",
  MetalKiller: "메탈 킬러",
  ZombieKiller: "좀비 킬러",
  SoulStrike: "영혼 공격",
  BarrierBreak: "베리어 브레이커",
  ShieldBreak: "실드 브레이커",
  StrickAttack: "혼신의 일격",
  Bounty: "격파시 머니 업",
  Metallic: "메탈",
  MiniWave: "소파동",
  Wave: "파동 공격",
  MiniVolcano: "소열파",
  Volcano: "열파",
  VolcanoCounter: "열파 카운터",
  Blast: "폭파 공격",
  WaveBlocker: "파동 스토퍼",
  Summon: "소환",
  ColosusSlayer: "초생명체 특효",
  BehemothSlayer: "초수 특효",
  SageHunter: "초현자 특효",
  ImuWeak: "공격력 다운 무효",
  ImuKB: "날려버림 무효",
  ImuStop: "멈춤 무효",
  ImuSlow: "느리게 무효",
  ImuWarp: "워프 무효",
  ImuCurse: "저주 무효",
  ImuPoison: "독 데미지 무효",
  ImuWave: "파동 무효",
  ImuVolcano: "열파 무효",
  ImuBlast: "폭파 무효",
  // Enemy-specific
  Barrier: "베리어",
  Shockwave: "충격파",
  Burrow: "버로우",
  Rebirth: "부활",
  DevilShield: "악마 실드",
  DeathVolcano: "순교",
  Colosus: "초생명체",
  Behemoth: "초수",
  Sage: "초현자",
  Glass: "유리 공격",
  EKILL: "사도 킬러",
  WKILL: "마녀 킬러",
};

export const toKo = (map: Record<string, string>, key: string): string =>
  map[key] ?? key;
