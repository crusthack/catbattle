export interface Cat {
    Id: number,     // ID (고양이 = 0, 고양이벽 = 1, ...)
    Form: number,   // 진화 단계 (1, 2, 3, 4) 
    Rarity: string, // 등급    기본, Ex, 레어, 슈퍼레어, 울트라슈퍼레어, 레전드레어, undefined
    Name: string,   // 한글이름
    Descriptiont: string, // 한글설명
    Image: string,   // 이미지 주소

    Price: number,  // 생산비용 6
    Hp: number,     // 체력 0
    Atk: number,    // 공격력 3
    Speed: number,  // 이동속도 2
    Heatback: number,   // 히드백 1
    Tba: number,        // 공격 간격 [4] * 2;
    PreAttackFrame: number,     // 선딜 애니메이션 프레임 13
    PostAttackFrame: number,    // 공격 후딜 애니메이션 프레임
    TotalAttackFrame: number, // 총 공격 애니메이션 프레임 = 선딜 + 후딜 + 공격간격 -1
    RespawnHalf: number,    // 재생산시간 [7] * 2
    Range: number,      // 공격범위 5
    Width: number,      // 유닛 길이 9
    MaxLevel: number,   // 최대 기본 레벨
    PlusLevel: number, // 최대 추가 레벨

    Targets: trait[],        // 타겟 속성[]
    AttackType: attackType[],     // 공격 유형
    Affects: affect[],        // 효과
    Abilities: ability[],      // 능력

    levelData: number[]
}

export type trait =    // TB_
  | "Red"       // 10
  | "Floating"  // 16
  | "Black"     // 17
  | "Metal"     // 18
  | "White"     // 19
  | "Angel"     // 20
  | "Alien"     // 21
  | "Zombie"    // 22
  | "Relic"     // 78
  | "Demon";    // 96

export type attackType = 
| "single"  // 플래그가 있는지 모르겠음. range 플래그 꺼져있으면 단일로 봐야하지 않을까
| "range"   // 12
| "long"    // 44 45
| "omni";   // 44 45, 45가 음수면 전방위

export type affect =   
  | "Slow"          // 27 느리게한다 확률 28 - 시간
  | "Stop"          // 25 멈춘다 확률 26 - 시간
  | "Knockback"     // 24 날려버린다 확률
  | "Weak"          // 37 공다 확률 38 시간 39 배율
  | "MassiveDamage" // 30 초데미지
  | "InsaneDamage"  // 81 극데미지
  | "Good"          // 23 엄청 강하다
  | "Resistant"     // 29 맷집이 좋다
  | "InsanelyTough" // 80 초맷집이 좋다
  | "Curse"         // 92 저주 확률 93 - 시간
  | "Only"          // 32 타겟 한정
  | "Warp"         // 75 워프
  | "ImuATK"       // 84 공격무효 확률
  ;

export type ability =
  | "AtkUp"         // 40 공격력 업 체력 41 배율
  | "LETHAL"        // 42 살아남는다 확률
  | "BaseDestroyer" // 34 성파괴가특기
  | "Critical"      // 31 크리 확률
  | "MetalKiller"   // 112 메탈킬러, 피 깍는 퍼센티지
  | "ZombieKiller"  // 52 좀비킬러
  | "SoulStrike"    // 98 영혼공격
  | "BarrierBreak"  // 70 베리어브레이커
  | "ShieldBreak"   // 95 실드브레이커
  | "StrickAttack"  // 82 혼신의일격 확률 83 데미지배율
  | "Bounty"        // 33 격파시머니up
  | "Metallic"      // 43 메탈
  | "MiniWave"      // 94 소파동 플래그(1이면 소파동), 35 소파동확률 36 파동레벨
  | "Wave"          // 35 파동 확률, 36 파동 레벨
  | "MiniVolcano"   // 108 소열파 플래그, 86 열파 확률
  | "Volcano"       // 86 열파 확률
  | "VolcanoCounter"// 109 열파카운터
  | "Blast"         // 113 폭파 확률
  | "WaveBlocker"   // 47 파동삭제
  | "Summon"        // 110 소환 유닛 ID
  | "ColosusSlayer" // 97 초생명체특효 
  | "BehemothSlayer"// 105 초수특효
  | "SageHunter"    // 111 초현자특효

  | "ImuWeak"       // 51 공다무효
  | "ImuKB"         // 48 날려버린다무효
  | "ImuStop"       // 49 멈춘다무효
  | "ImuSlow"       // 50 느리게한다무효
  | "ImuWarp"       // 75 워프무효
  | "ImuCurse"      // 79 저주무효
  | "ImuPoison"     // 90 독무효
  | "ImuWave"       // 46 파동무효
  | "ImuVolcano"    // 91 열파무효
  | "ImuBlast"      // 116 폭파무효
// 저항 애들은 본능 능력이라 unit csv에 없음
  | "WeakResist"    // 공다저항
  | "StopResist"    // 멈춘다저항
  | "SlowResist"    // 느리게한다저항
  | "KBResist"      // 날려버린다저항
  | "WaveResist"    // 파동저항
  | "VolcanoResist" // 열파저항
  | "WarpResist"    // 워프저항
  | "CurseResist"   // 저주저항
  | "PoisonResist"  // 독저항
  | "EKILL"       // 사도킬러
  | "WKILL"     // 마녀킬러
  ;
// 범위공격 - [12]인거 같음, 
// 원거리 공격 - [44]가 시작 범위, [45]가 공격범위 -> 사거리는 44 ~ 44 + 45
// 전방위 공격 - [45]가 음수면 전방위, 


// walk, idle, attack, hitback 4가지 상태(애니메이션종류)가 있음. 02.maanim이 공격 애니메이션
// 유닛 폴더, f 1진, c 2진, s 3진, u 4진


// 유닛 스탯 정보 -> org/unit/{03:d}/unit{03:d}.csv. csv 컬럼 최소 길이 52
// 예시데이터 하데스 unit073.csv (4진까지 있음) 스탯 파싱 -> battle\data\dataunit.java
// 950,1,7,450,15,410,2900,1450,0,320,0,0,1,82,0,9,0,1,0,0,0,0,0,0,0,100,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
// 1900,1,7,900,15,410,2900,1450,0,320,0,0,1,82,0,9,0,1,0,0,0,0,0,0,0,100,180,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
// 3800,1,7,1200,15,410,2900,1450,0,320,0,0,1,82,0,9,0,1,0,0,0,0,0,0,0,100,240,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
// 5500,2,7,1200,15,410,2900,1450,0,320,0,0,1,82,0,9,0,1,0,0,0,0,0,0,0,100,240,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,0,-1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1

// 속성 isRed 10, isFloating 16, isBlack 17, isMetal 18, isWhite 19, isAngel 20, isAlien 21, isZombie 22, isRelic 78, isDemon 96
// isGood, kb_prob, stop_prob, stop_time, slow_prob, slow_time, isResist, isMassive, crit_prob, isOnly, bounty_boost, atkBase_boost, wave_prob_or_miniwave_prob, wave_lv_or_miniwave_lv, weak_prob, weak_time, weak_mult, strong_hp_threshold, strong_mult, lethal_prob, isMetallic, lds0, ldr0, imuWave, hasWaves, imuKB, imuStop, imuSlow, imuWeak, zKill, wKill, _unused54, loopCount, imuSurge, _unused57, isGlass, atk1, atk2, pre1, pre2, ability0, ability1, ability2, _unused66, deathSoulId, _unused68, _unused69, break_prob, _unused71, _unused72, _unused73, _unused74, imuWarp, _unused76, eKill, isRelic, imuCurse, resists, massives, surgeAtk_prob, surgeAtk_mult, imuAtk_prob, imuAtk_time, volcano_prob, volcano_range0, volcano_range1, volcano_duration, imuPoisonAtk, imuVolcano, curse_prob, curse_time, isMiniwaveFlag, shieldBreak_prob, isDemon, baKill, corpseKill, extraHitbox_flag_1, extraHitbox_lds_1, extraHitbox_ldr_1, extraHitbox_flag_2, extraHitbox_lds_2, extraHitbox_ldr_2, beastHunt_active, beastHunt_prob, beastHunt_time, isMiniVolcano, csur, spiritId, hasSkill, metalKill_mult, blast_prob, blast_range0, blast_range1, imuBlast
// isRangeAttack, preAttack, frontRange, backRange, 
// _unused11, 
// _unused8, 

// 기본 스탯 hp 0, knockback 1, speed 2, atk 3, tba 4, range 5, price 6, respawnHalf 7, width 9
// 속성     isRed 10, isFloating 16, isBlack 17, isMetal 18, isWhite 19, isAngel 20, isAlien 21, isZombie 22, isRelic 78, isDemon 96

// 판정/공격 isRangeAttack 12, preAttack 13, frontRange 14, backRange 15,
// atk1 59, atk2 60, pre1 61, pre2 62


// 저항/면역 imuWave 46, imuKB 48, imuStop 49, imuSlow 50, imuWeak 51,
// imuSurge 56, imuWarp 75, imuCurse 79, imuAtk_prob 84, imuAtk_time 85,
// imuPoisonAtk 90, imuVolcano 91, imuBlast 116

// 효과 확률 kb_prob 24, stop_prob 25, stop_time 26, slow_prob 27, slow_time 28,
// crit_prob 31, lethal_prob 42, break_prob 70, blast_prob 113

// 버프/디버프 weak_prob 37, weak_time 38, weak_mult 39,
// strong_hp_threshold 40, strong_mult 41,
// curse_prob 92, curse_time 93

// 웨이브 wave_prob 35, wave_lv 36, isMiniwaveFlag 94,
// volcano_prob 86, volcano_range0 87, volcano_range1 88, volcano_duration 89,
// isMiniVolcano 108

// 특수 능력 bounty_boost 33, atkBase_boost 34,
// resist 29, massive 30, only 32,
// resists 80, massives 81,
// skill 111, metalKill_mult 112
// 열파 카운터 AB_CSUR 109

// 킬 타입 zKill 52, wKill 53, eKill 77, baKill 97, corpseKill 98

// 히트박스 lds0 44, ldr0 45, extraHitbox_flag_1 99, extraHitbox_lds_1 100, extraHitbox_ldr_1 101,
// extraHitbox_flag_2 102, extraHitbox_lds_2 103, extraHitbox_ldr_2 104

// 비스트 헌트 beastHunt_active 105, beastHunt_prob 106, beastHunt_time 107

// 소울 deathSoulId 67, spiritId 110

// 기타 abi0 63, abi1 64, abi2 65, loopCount 55,
// _unused8 8, _unused11 11, _unused54 54, _unused57 57, _unused66 66, _unused68 68, _unused69 69, _unused71 71, _unused72 72, _unused73 73, _unused74 74, _unused76 76

// 켓테이블에서 보여줄 내용 - 아이디, 이름, (사진), 레어도(등급), 타겟속성, 효과, 능력
// 켓 디테일 페이지, 다이얼로그에서 보여줄 내용 + 설명, 스탯, 레벨에 따른 스탯


// 스탯 - 비용, 체력, 공격력, 
// 기본 스탯 hp 0, knockback 1, speed 2, atk 3, tba 4, range 5, price 6, respawnHalf 7, width 9
// 속성 isRed 10, isFloating 16, isBlack 17, isMetal 18, isWhite 19, isAngel 20, isAlien 21, isZombie 22, isRelic 78, isDemon 96
// 본능 해방 전 기준으로 돼 있음
// 인덱스 기준임(0부터 시작)