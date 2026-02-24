import { AssessmentInput, Contribution } from "@/types";

export function calculateScore(input: AssessmentInput) {
  const calories = input.foodEstimate?.calories ?? 0;
  const formScore = input.poseSummary?.formScore ?? 80;

  const calorieTarget = 2000;

  const calorieImpact = Math.abs(calorieTarget - calories) / calorieTarget;
  const formImpact = 1 - formScore / 100;

  const finalScore = 100 - (calorieImpact * 40 + formImpact * 60);

  const contributions: Contribution[] = [
    { feature: "Form Quality", value: formScore, weight: 0.6 },
    { feature: "Calorie Alignment", value: calories, weight: 0.4 },
  ];

  return {
    score: Math.max(0, Math.round(finalScore)),
    calories,
    formScore,
    contributions,
  };
}