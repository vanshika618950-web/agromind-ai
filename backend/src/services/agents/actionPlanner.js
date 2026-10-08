import geminiService from '../geminiService.js';

export const runActionPlanner = async (cropData, problemAnalysis, cropReasoning, riskAssessment) => {
  const startTime = Date.now();

  const prompt = `You are Agent 4: Action Planner Agent.
Convert the synthesized agronomic reasoning and risk level into a prioritized, chronological action plan for the farmer.

Context:
- Crop: ${cropData.crop} (${cropData.growthStage})
- Soil & Irrigation: ${cropData.soilType}, ${cropData.irrigation}
- Problem Identified: ${problemAnalysis.identifiedProblem}
- Risk Level: ${riskAssessment.riskLevel} (Severity: ${riskAssessment.severity}, Urgency: ${riskAssessment.urgency})
- Recommendations from Agent 2: ${JSON.stringify(cropReasoning.recommendations)}
- Irrigation Advice: ${cropReasoning.irrigationAdvice}
- Nutrient Advice: ${cropReasoning.nutrientAdvice}

Task:
Generate a structured chronological plan prioritized by risk:
1. immediate: 1-2 urgent steps to take immediately.
2. today: 2-3 specific steps for today.
3. next3Days: 2-3 monitoring or corrective steps for the next 72 hours.
4. next7Days: 2-3 follow-up steps for the remainder of the week.
5. preventive: 2-3 forward-looking management actions for future cycles.
6. finalSummary: A clear, encouraging 2-3 sentence executive summary for the farmer.`;

  const schema = `{
  "immediate": ["Inspect affected plants closely", "Isolate heavily affected specimens if practical"],
  "today": ["Verify root-zone moisture", "Check recent fertilizer logs"],
  "next3Days": ["Observe whether symptoms spread to new shoots", "Implement targeted organic or prescribed spray"],
  "next7Days": ["Reassess overall plant vigor", "Calibrate irrigation cycles based on weather"],
  "preventive": ["Maintain crop rotation", "Routine weekly field scouting"],
  "finalSummary": "Comprehensive closing summary synthesized for the grower..."
}`;

  let result = await geminiService.generateStructuredResponse(prompt, schema);

  if (!result) {
    // Agronomic Rule-based Expert Engine
    const isHighRisk = ['HIGH', 'CRITICAL'].includes(riskAssessment.riskLevel);

    const immediate = [
      `Carefully inspect 10-15 random ${cropData.crop} plants across the plot to establish whether the symptom is localized or systemic.`,
      isHighRisk
        ? 'Flag heavily symptomatic rows and take high-resolution photos for local agronomist validation.'
        : 'Check moisture level in the top 4 inches of soil with a soil probe or clean trowel.',
    ];

    const today = [
      `Align irrigation schedule in ${cropData.soilType}: ${cropReasoning.irrigationAdvice.slice(0, 150)}`,
      'Examine underside of leaves and stems under bright sunlight with a magnifying lens for micro-pests or fungal spores.',
    ];

    const next3Days = [
      'Document symptom progression: check whether newly emerging foliage exhibits discoloration or necrotic lesions.',
      `Prepare soil/foliar nutrient balancing: ${cropReasoning.nutrientAdvice.slice(0, 140)}`,
    ];

    const next7Days = [
      'Evaluate response to adjusted irrigation and nutrient inputs.',
      isHighRisk
        ? 'Consult local agricultural extension center if yellowing/lesion expansion has not halted by Day 5.'
        : 'Verify uniform greening and resumption of vegetative expansion.',
    ];

    const preventive = [
      `Incorporate balanced organic matter (FYM or compost) to fortify moisture buffering in ${cropData.soilType}.`,
      'Adopt scheduled morning field scouting and avoid working in wet foliage to minimize spore transmission.',
      'Calibrate irrigation volume dynamically against local seasonal rainfall data.',
    ];

    const finalSummary = `Based on multi-agent analysis, the ${cropData.crop} shows ${riskAssessment.severity.toLowerCase()} risk associated with ${problemAnalysis.identifiedProblem.toLowerCase()}. Prompt adherence to the 7-day action plan will stabilize crop health and preserve yield potential.`;

    result = {
      immediate,
      today,
      next3Days,
      next7Days,
      preventive,
      finalSummary,
    };
  }

  const executionTimeMs = Date.now() - startTime;
  return {
    output: result,
    executionTimeMs,
  };
};
