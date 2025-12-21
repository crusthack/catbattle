export interface MonthlyMission {
  month: string;
  missions: {
    id: number;
    description: string;
    descriptionKo: string;
    reward: string;
    completed: boolean;
  }[];
}