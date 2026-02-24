export function generateExplanation(data: any) {
  return `
Overall Score: ${data.score}

Form Score: ${data.formScore}
Calorie Estimate: ${data.calories}

Recommendations:
- Improve exercise posture consistency if form score is below 80.
- Adjust calorie intake closer to target.
- Maintain balanced training intensity.
  `;
}