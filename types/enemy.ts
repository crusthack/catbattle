import { attackType } from "./cat";

export interface Enemy {
    Id: number,     // ID (고양이 = 0, 고양이벽 = 1, ...)
    Name: string,   // 한글이름
    Descriptiont: string, // 한글설명
    Image: string,   // 이미지 주소

    Hp: number,     // 체력 0
    Heatback: number,   // 히드백 1
    Speed: number,  // 이동속도 2
    Atk: number,    // 공격력 3
    Tba: number,    // 공격 간격 [4] * 2;
    Range: number,      // 공격범위 5
    Money: number,  // 격파시 머니 6
    Width: number,      // 유닛 길이 8

    PreAttackFrame: number,     // 선딜 애니메이션 프레임 13
    postAttackFrame: number,    // 공격 후딜 애니메이션 프레임

    Targets: trait[],        // 타겟 속성[]
    AttackType: attackType[],     // 공격 유형
    Affects: affect[],        // 효과
    Abilities: ability[],      // 능력
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
  | "Relic"     // 72
  | "Demon"     // 93
  | "Witch"     // 48
  | "Base"      // 49
  | "Eva"       // 71 에반게리온
  | "Baron"     // 94 바론
  | "Beast"     // 101 초수
  | "Sage"      // 103 현자
  ;
export type affect =
    | "Knockback"       // 20 날려버린다 확률
    | "Stop"            // 21 멈춘다 확률 22 - 시간
    | "Slow"            // 23 느리게한다 확률 24 - 시간
    | "Weak"            // 29 공다 확률 38 시간 30 배율
    | "Curse"           // 73 고대의 저주 확률 74 - 시간
    | "Warp"            // 65 워프  66 워프 시간 67, 68 워프거리(2개 있는 이유 모르겟음 다 값 같은데) 워프거리가 음수면 역워프
    | "rWarp"
    | "ImuATK"          // 77 공격무효 확률
    | "Poison"          // 79 독 공격
    ;
// 35 36 lsa lsr    50 loop 54, 63 death
export type ability =
    | "Critical"      // 25 크리 확률
    | "StrickAttack"  // 75 혼신의일격 확률 76 데미지배율
    | "Wave"          // 35 파동 확률, 36 파동 레벨
    | "MiniWave"      // 86 소파동 플래그(1이면 소파동), 27 소파동확률 28 파동레벨
    | "Volcano"       // 81 열파 확률
    | "MiniWave"      // 102 소열파 플래그
    | "Blast"         // 106 폭파공격
    | "Barrier"       // 64 베리어
    | "Shockwave"     // 충격파 (등장시 넉백)
    | "LETHAL"        // 34 살아남는다 확률
    | "AtkUp"         // 32 공격력 업 체력 33 배율
    | "BaseDestroyer" // 26 성파괴가특기
    | "Burrow"        // 43 버로우
    | "Rebirth"       // 45 부활
    | "DevilShield"   // 87 악마실드
    | "DeathVolcano"  // 89 순교
    | "Colosus"       // 94 초생명체 
    | "Behemoth"      // 101 초수
    | "Sage"          // 104 초현자
    | "VolcanoCounter"// 103 열파카운터
    | "WaveBlocker"   // 38 파동삭제
    | "Glass"         // 52 유리

    | "ImuKB"         // 39 날려버린다무효
    | "ImuStop"       // 40 멈춘다무효
    | "ImuSlow"       // 41 느리게한다무효
    | "ImuWeak"       // 42 공다무효
    | "ImuWarp"       // 70 워프무효
    | "ImuCurse"      // 105 저주무효
    | "ImuWave"       // 37 파동무효
    | "ImuVolcano"    // 85 열파무효
    | "ImuBlast"      // 109 폭파무효
    ;