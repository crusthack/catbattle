"use client";

import { useState } from "react";

import type { Stage } from "@/types/stage";
import type { Enemy } from "@/types/enemy";
import StageFilters from "./StageFilters";
import StageTable from "./StageTable";
import StageDetailDialog from "./StageDetailDialog";
import EnemyDetailDialog from "@/components/enemy/EnemyDetailDialog";

interface StagePageProps {
	stages: Stage[];
	enemies: Enemy[];
}

export default function StagePage({ stages, enemies }: StagePageProps) {
	const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
	const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null);
	const [isEnemyDialog, setIsEnemyDialog] = useState(false);
	const [enemyMultiplier, setEnemyMultiplier] = useState(100);
	const [search, setSearch] = useState("");
	const [mapType, setMapType] = useState<string>("all");
	const [chapter, setChapter] = useState<string>("all");

	const matchesMapType = (s: Stage) => {
		if (mapType === "all") return true;
		if (mapType === "세계편") return s.StoryId === 3 && s.MapId === 9;
		if (mapType === "미래편") return s.StoryId === 3 && [3, 4, 5].includes(s.MapId);
		if (mapType === "우주편") return s.StoryId === 3 && [6, 7, 8].includes(s.MapId);
		if (mapType === "레전드 스토리") return s.StoryId === 0;
		if (mapType === "신 레전드 스토리") return s.StoryId === 13;
		if (mapType === "레전드 스토리 0") return s.StoryId === 34;
		return true;
	};

	const matchesSearch = (s: Stage) => {
		const normalize = (t: string) =>
			(t || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
		const q = normalize(search.trim());
		if (!q) return true;
		if (normalize(s.StageName ?? "").includes(q)) return true;
		// check enemy names (normalize both sides)
		for (const e of s.EnemiesData || []) {
			const en = enemies.find(x => x.Id === e.enemyId);
			if (en && en.Name && normalize(en.Name).includes(q)) return true;
		}
		return false;
	};

	const matchesChapter = (s: Stage) => {
		if (!chapter || chapter === "all") return true;
		// only applies for 미래편/우주편 within story 3
		const chMap: Record<string, number> = { "1장": 1, "2장": 2, "3장": 3 };
		const ch = chMap[chapter];
		if (!ch) return true;

		// 미래편 mapIds 3,4,5 correspond to chapter 1/2/3
		if (s.StoryId === 3 && [3,4,5].includes(s.MapId)) {
			return s.MapId === 2 + ch; // 1장->3, 2장->4, 3장->5
		}

		// 우주편 mapIds 6,7,8 correspond to chapter 1/2/3
		if (s.StoryId === 3 && [6,7,8].includes(s.MapId)) {
			return s.MapId === 5 + ch; // 1장->6, 2장->7, 3장->8
		}

		// other story/map combinations: ignore chapter filter
		return true;
	};

	const filteredStages = stages.filter(s => matchesMapType(s) && matchesSearch(s) && matchesChapter(s));

	return (
		<div className="space-y-6">
			<StageFilters
				search={search}
				setSearch={setSearch}
				mapType={mapType}
				setMapType={setMapType}
				chapter={chapter}
				setChapter={setChapter}
			/>

			<StageTable
				stages={filteredStages}
				enemies={enemies}
				onSelectStage={setSelectedStage}
			/>

			<StageDetailDialog
				stage={selectedStage}
				enemies={enemies}
				onSelectEnemy={(enemy: Enemy, mult: number) => {
					setSelectedEnemy(enemy);
					setEnemyMultiplier(mult);
					setIsEnemyDialog(true);
				}}
				onOpenChange={(open: boolean) => {
					if (!open) {
						setSelectedStage(null);
						setIsEnemyDialog(false);
					}
				}}
			/>

			<EnemyDetailDialog
				isOpen={isEnemyDialog}
				onOpenChange={setIsEnemyDialog}
				enemy={selectedEnemy}
			/>
		</div>
	);
}
