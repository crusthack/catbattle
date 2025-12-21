"use client";

import Card from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Stage } from "@/types/stage";
import type { Enemy } from "@/types/enemy";

interface StageTableProps {
	stages: Stage[];
	enemies: Enemy[];
	onSelectStage: (s: Stage) => void;
}

const mapTypeFromId = (sid:number, id: number) => {
	if(sid===3){
		if (id === 9) return "세계편";
		if (id === 3) return "미래편";
		if (id === 4) return "미래편";
		if (id === 5) return "미래편";
		if (id === 6) return "우주편";
		if (id === 7) return "우주편";
		if (id === 8) return "우주편";
	}
	if(sid===0){
		return "레전드 스토리";
	}
	if(sid===13){
		return "신 레전드 스토리";
	}
	if(sid===34){
		return "레전드 스토리 0";
	}
	return "기타";
};

export default function StageTable({ stages, enemies, onSelectStage }: StageTableProps) {
	// Custom story ordering: 3, 0, 13, 34 (others follow numerically)
	// If story === 3, map ordering should be: 9, 3, 4, 5, 6, 7, 8
	const STORY_ORDER = [3, 0, 13, 34];
	const MAP_ORDER_FOR_3 = [9, 3, 4, 5, 6, 7, 8];

	const sortedStages = [...stages].sort((a, b) => {
		const aStory = a.StoryId ?? 0;
		const bStory = b.StoryId ?? 0;

		const aStoryIdx = STORY_ORDER.indexOf(aStory);
		const bStoryIdx = STORY_ORDER.indexOf(bStory);

		if (aStoryIdx !== -1 || bStoryIdx !== -1) {
			if (aStoryIdx === -1) return 1; // a is not in prioritized list -> after
			if (bStoryIdx === -1) return -1;
			if (aStoryIdx !== bStoryIdx) return aStoryIdx - bStoryIdx;
		} else {
			if (aStory !== bStory) return aStory - bStory;
		}

		// same story
		if (aStory === 3 && bStory === 3) {
			const aMapIdx = MAP_ORDER_FOR_3.indexOf(a.MapId ?? 0);
			const bMapIdx = MAP_ORDER_FOR_3.indexOf(b.MapId ?? 0);
			if (aMapIdx !== -1 || bMapIdx !== -1) {
				if (aMapIdx === -1) return 1;
				if (bMapIdx === -1) return -1;
				if (aMapIdx !== bMapIdx) return aMapIdx - bMapIdx;
			}
		}

		// fallback to numeric ordering
		if ((a.MapId ?? 0) !== (b.MapId ?? 0)) return (a.MapId ?? 0) - (b.MapId ?? 0);
		return (a.StageId ?? 0) - (b.StageId ?? 0);
	});

	return (
		<Card className="p-6">
			<div className="overflow-x-auto w-full min-w-0">
				<Table className="w-full table-fixed text-left">
					<TableHeader>
						<TableRow>
								<TableHead className="w-14 text-center">맵 번호</TableHead>
								<TableHead className="w-28">맵 종류</TableHead>
								<TableHead className="w-50">맵 이름</TableHead>
								<TableHead className="w-40">스테이지 이름</TableHead>
								<TableHead className="w-16">통솔력</TableHead>
								<TableHead>출몰 적</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
					{sortedStages.map((st, idx) => {
						const uniqueEnemyIds = Array.from(new Set((st.EnemiesData || []).map((e: any) => e.enemyId).filter(Boolean))) as number[];
						// show sorted by enemy id ascending, excluding id 23
						const shown = uniqueEnemyIds
							.filter(id => id !== 23)
							.sort((a, b) => Number(a) - Number(b));

						return (
							<TableRow
								key={`${st.StoryId}-${st.MapId}-${st.StageId}-${idx}`}
								className="cursor-pointer hover:bg-gray-50"
								onClick={() => onSelectStage(st)}
							>
								<TableCell className="text-center">
									{((st.StoryId === 3) && [9,3,4,5,6,7,8].includes(st.MapId)) ? ((st.StageId ?? 0) + 1) : (st.MapId ?? 0)}
								</TableCell>
								<TableCell>{mapTypeFromId(st.StoryId, st.MapId)}</TableCell>
								<TableCell><div className="flex flex-wrap gap-0.5 items-start">
									{st.MapName}
									</div>
									</TableCell>
								<TableCell>
									<div className="font-semibold">{st.StageName ?? st.StageName}</div>
								</TableCell>
								<TableCell>{typeof st.Energy !== "undefined" ? (st.StoryId == 3 && st.MapId == 9) ? st.Energy + '/' + (st.Energy + 10) + '/' + (st.Energy + 20) : st.Energy : "—"}</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-0.5 items-start">
										{shown.map((id: number, i: number) => {
											const en = enemies.find((x) => x.Id === id || x.Id === Number(id));
											if (!en) return null;

											return (
												<div key={`${id}-${i}`} className="flex flex-col items-center justify-start w-28">
													<div className="h-10">
														{en.Image ? (
															<img src={en.Image} alt={en.Name} className="w-full h-full object-contain rounded bg-white" />
														) : (
															<div className="w-full h-full bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400">No</div>
														)}
													</div>
													<div className="text-black text-sm mt-1 text-center truncate w-full px-1">{en.Name}</div>
												</div>
											);
										})}
									</div>
								</TableCell>
							</TableRow>
						);
					})}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
