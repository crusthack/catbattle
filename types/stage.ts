export interface StageEnemySpawnData {
  enemyId: number;
  magnification: number;
  castleHp: number;
  timer: number;
}
// enemyID, number, spawn_0, respawn_0, respawn_1, castle_0, layer_0, layer_1, boss, multiple, 
// spawn_1, castle_1, group, mult_atk, kill_count

export type RawEnemyLine = {
  Raw: number[];
  EnemyId: number;
  Amount: number;
  spawn_0: number;
  RespawnMinF: number;
  RespawnMaxF: number;
  castle_0: number; // 성체력% 5
  MinLayer: number;
  MaxLayer: number;
  IsBoss: number;
  Magnification: number;
  Spawn_1: number;
  Castle_1: number;
  Group: number;
  Mult_Atk: number;
  KillCount: number;
};

// 세계편, 미래편, 우주편, 마계편, 레전드 스토리(N), 신 레전드 스토리(A), 레전드 스토리 0(ND)만 처리
// 세계편은 1 2 3장 구분 없이 배율만 바뀜
// 파일 구조
// Stage/CH에 세계편 우주편 미래편 정보있음
// Stage/CH/stageNormal에 각 장에 대한 메타정보(스테이지 목록, 통솔력, 획득Xp,...)
// Stage/CH/stage 세계편, stageW 미래편, stageSpace 우주편
// 첫번째 행 파싱 정보(util/stage/Stage.java)
// 맵 길이, 성 체력, 최소 스폰, 최대 스폰, bgm, max, 시간제한, ...
// 적 등장 정보

// 맵 이름 정보 StageName.txt 스토리 번호 - 맵 번호 - 스테이지 번호
// 세계편 ->  003-009-{03d:n}
// 미래편 -> 003-003-000~047, 003-004-000~047, 003-005-000~047 1장~3장
// 우주편 -> 003-006-000~047, 003-007-000~047, 003-008-000~047 1장~3장
// 레전드 스테이지 -> 000-000 전설의 시작, 000-000-000 대지를 흔들다 
// 신 레전드 스테이지 -> 013-000-000
// 레전드 스토리 0 -> 034-000-000
// 스테이지 메타정보 (stageNormal0.csv...) 첫 번째 값이 통솔력
// 스테이지 정보(Stage.java)
// 맵길이, 성체력, 최소스폰, 최대스폰, 배경음악, 최대 적 수, isBase, 시간제한, 보스가드
// 스테이지 맵 출몰 정보 	SCDef.java
// enemyID, number, spawn_0, respawn_0, respawn_1, castle_0, layer_0, layer_1, boss, multiple, spawn_1, castle_1, group, mult_atk, kill_count


export interface Stage{
  StoryId: number;  // 세계편: 003, 레전드 스테이지: 000, 신 레전드: 13, 레전드 스토리 0: 34
  MapId: number;    // 세계편: 미래편 003 004 005 우주편 006 007 008 세계편 009 세계좀비 000 001 002 미래좀비 010 012 013 마계편 014 우주좀비 015 016 017
  // , Legend: 0~, NewLegend:0~, Legend0:0~
  StageId: number;  // 0~
  StoryName: string;
  MapName: string; // 맵 이름 (세계편, 미래편 1장, 전설의 시작...)
  StageName: string; // 스테이지 이름

  EnemiesData: StageEnemySpawnData[];
  Energy: number;
}