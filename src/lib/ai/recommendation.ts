import { AssessmentInput } from "@/types";
import { calculateScore } from "./scoring";
import { generateExplanation } from "./explain";

export async function runAssessment(input: AssessmentInput) {
  const scoring = calculateScore(input);
  const explanation = generateExplanation(scoring);

  return {
    ...scoring,
    explanation,
  };
}