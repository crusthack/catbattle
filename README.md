# GitHub 주소
https://github.com/crusthack/catbattle/
# GitHub Pages 주소
https://crusthack.github.io/catbattle/

# 프로젝트 설명
- 냥코대전쟁 데이터 조회 사이트
- 냥코대전쟁의 아군 유닛, 적 유닛 조회 기능 제공 및 월간미션 도우미 기능을 제공하는것을 목적으로 만든 웹사이트입니다. 
- 한국어로 된 조회 사이트가 없고 있더라도 조회 기능이 빈약하며 게임 내부적으로 제공하는 검색 기능도 누략된 필터 기능이 많아 직접 만들고자 하였습니다. 
# 사용한 기술
- nextjs, figma를 통한 사이트 초안 작성, github action을 통한 배포
# 실행 방법
- npm run start
# 배포 링크
[text](https://crusthack.github.io/catbattle/)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 냥코대전쟁 API

## 홈 

## 아군 캐릭터 목록
- 캐릭터명 
- 희귀도(기본, EX, 레어, 슈퍼레어, 울트라슈퍼레어, 레전드레어)
- 타겟(무속성, 빨간적, 떠있는 적, 검은 적, 메탈, 천사, 에이리언, 좀비, 고대종, 악마)
- 스탯: 체력, 공격력, dps, 히트백, 이동속도, 사거리, 유효 사거리, 생산 비용, 재생산 간격, 딜레이...
- 공격 타입(개체공격/범위공격/원거리공격/전방위공격)
- 효과(공격력다운, 움직임을 멈춘다, 움직임을느리게한다, 공격타겟한정, 엄청 강하다, 맷집이좋다, 초맷집이좋다, 초데미지, 극데미지, 날려버린다, 워프, 저주, 공격무효)


- 능력(공격력 업, 살아남는다, 성 파괴가 특기, 크리티컬, 메탈 킬러, 좀비 킬러, 영혼 공격, 베리어 브레이커, 쉴드 브레이커, 혼신의 일격, 격파시 머니 UP, 메탈, 소파동, 파동 공격, 소열파, 열파 공격, 열파 카운터, 폭파 공격, 파동 스톱퍼, 소환)
- 능력(초생명체 특효, 초수 특효, 초현자 특효)
- 능력(공격력 다운 무효, 움직임을 멈춘다 무효, 움직임을 느리게 한다 무효, 날려버린다 무효, 파동 데미지 무효, 열파 데미지 무효, 폭파 데미지 무효, 워프 무효, 고대의 저주 무효, 독 데미지 무효, 공격력 다운 내성,  움직임을 멈춘다 내성, 움직임을 느리게 한다 내성,날려버린다 내성, 파동 데미지 내성, 열파 데미지 내성, 워프 내성, 고대의 저주 내성, 독 데미지 내성)
- 능력 (기본 체력 업, 기본 공격력 업, 이동 속도 업, 넉백 횟수 증가, 생산 코스트 할인, 생산 스피드 업, 공격 간격 단축)
- 이벤트 능력 (마녀 킬러, 사도 킬러)

## 적 캐릭터 목록
- 캐릭터명
- 속성
- 공격타입(단일, 범위, 원거리, 전방위)
- 스탯(체력, 공격력, DPS, 히트백, 이동속도, 사거리, 유효 사거리, 주는 돈, 공격 빈도, 공격 간격)
- 효과(날려버린다, 느리게한다, 멈춘다, 공다, 독, 고대의저주, 워프, 공격무효)
- 능력(크리티컬, 메탈, 혼신의일격, 파동공격, 열파공격, 소파동, 베리어, 충격파, 살아남는다, 공업, 성파괴가특기, 효과무효, 능력무효, 버로우, 부활, 악마실드, 데스열파, 초수, 초생명체, 열파카운터, 초현자)


## 스테이지 정보
- 맵 종류(세계편, 미래편, 우주편, 마계편, 레전드 스토리, 신 레전드 스토리, 레전드 스토리 0)
- 좀비 스테이지 여부(세계편, 미래편, 우주편)
- 맵 단계(1장, 2장, 3장, 4장(레전드스토리 n성과 대응)) 
- 스테이지 이름
- 스테이지 요구 통솔력
- 스테이지 제한 사항
- 등작 적 캐릭터 정보(적 캐릭터 이름, 등장 조건(시간, 성 체력))

## 통계

## 월간미션 
월간미션 정보 등록(맵 종류, 맵 단계, 적 이름)
스테이지 정보를 통해 적단히 쿼리해서(통솔력 적게 드는 순서, 제일 빨리 클리어 되는 순서...)

## API 설명

## Health


## 1단계
- 냥코대전쟁 데이터 - 아군 캐릭터 / 적 캐릭터 / 스테이지 정보... JSON으로 관리. (다 집어넣으면 30MB 넘길거같은데)
- 모바일 테스크톱환경 CSS -> 일단 나중에 고려
- Home, About, Dashboard, Search




# 데이터 확보

## bcu 

- https://github.com/battlecatsultimate/bcu-assets/tree/master/lang
- 언어별 캐릭터 이름, 적 이름, 스테이지 이름 등 정보
- https://github.com/fieryhenry/BCData/tree/main/14.7.0kr/DataLocal
- csv 데이터
- https://github.com/battlecatsultimate/BCU_java_util_common/tree/a2e7ef4ed5aabede4ee7be9a046d477b790c122e/util
- bcu 내부에서 사용하는 유틸리티 함수들(이걸 기반으로 csv 해석)

## Battle Cats Wiki

- https://battle-cats.fandom.com/wiki/Module:CatStatsUtils
- 캐릭터 스탯 파싱 정보
- https://battle-cats.fandom.com/wiki/MediaWiki:Custom-DataSource/cat_stats_form_1.json
- 캐릭터 스탯 정보
- https://battle-cats.fandom.com/wiki/Cat_Units
- https://battle-cats.fandom.com/wiki/Module:Cats/names.csv
- https://battle-cats.fandom.com/wiki/Module:Cats/data
- https://battle-cats.fandom.com/wiki/Module:Cats/data
- https://battle-cats.fandom.com/wiki/Module:Enemies.csv
- 적 캐릭터 정보

## Battle Cats DB
- https://battlecats-db.com/
- 일본어라 보기 힘듦

## my gamatoto
- https://mygamatoto.com/allcats
- 크롤링해서 쓸거면 이거