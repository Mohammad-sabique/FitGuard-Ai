export interface PoseSummary {
  formScore: number;
  issues: string[];
}

export interface FoodEstimate {
  label?: string;
  calories?: number;
  confidence?: number;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
}

export interface AssessmentInput {
  profile: UserProfile;
  poseSummary?: PoseSummary;
  foodEstimate?: FoodEstimate;
}

export interface Contribution {
  feature: string;
  value: number;
  weight: number;
}