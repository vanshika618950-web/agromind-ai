import geminiService from '../geminiService.js';

export const runRiskAssessment = async (cropData, problemAnalysis, cropReasoning) => {
  const startTime = Date.now();

  const prompt = `You are Agent 3: Risk Assessment Agent.
Evaluate the severity, urgency, and potential crop-loss impact based on previous agent analyses.

Context:
- Crop: ${cropData.crop} (${cropData.growthStage} stage, ${cropData.soilType} soil)
- Location: ${cropData.location}
- Symptoms: ${cropData.symptoms}
- Identified Problem: ${problemAnalysis.identifiedProblem}
- Possible Causes: ${JSON.stringify(problemAnalysis.possibleCauses)}
- Confidence: ${problemAnalysis.confidence}
- Reasoning: ${cropReasoning.analysis}

Task:
1. Assign riskLevel: Exactly one of ["LOW", "MEDIUM", "HIGH", "CRITICAL"].
   - LOW: Minor cosmetic symptoms, early stage, slow progression.
   - MEDIUM: Noticeable symptoms, potential yield penalty if unchecked in 24-48h.
   - HIGH: Spreading disease, intense pest pressure, or flowering/fruiting stage impairment.
   - CRITICAL: Rapidly spreading blight/wilt, systemic infestation, catastrophic crop failure danger.
2. Determine severity (e.g. Mild, Moderate, Severe, Critical).
3. Determine urgency (e.g. Within 12-24 hours, Within 24-48 hours, Within 3-5 days).
4. Provide a clear riskReason explaining what is at stake.
5. List 2-4 specific riskFactors.
6. Set expertConsultationRecommended (true if HIGH/CRITICAL or highly uncertain, false otherwise).`;

  const schema = `{
  "riskLevel": "MEDIUM",
  "severity": "Moderate",
  "urgency": "Within 24-48 hours",
  "riskReason": "Explanation of potential yield loss or symptom acceleration...",
  "riskFactors": ["Vulnerable crop growth stage", "Favorable weather for pathogen spread"],
  "expertConsultationRecommended": false
}`;

  let result = await geminiService.generateStructuredResponse(prompt, schema);

  if (!result) {
    // Agronomic Rule-based Expert Engine
    const symLower = cropData.symptoms.toLowerCase();
    let riskLevel = 'MEDIUM';
    let severity = 'Moderate';
    let urgency = 'Within 24-48 hours';
    let expertConsultationRecommended = false;

    if (
      symLower.includes('severe') ||
      symLower.includes('rapid') ||
      symLower.includes('dying') ||
      symLower.includes('black rot') ||
      symLower.includes('epidemic') ||
      symLower.includes('devastating')
    ) {
      riskLevel = 'CRITICAL';
      severity = 'Critical';
      urgency = 'Immediate (Within 12 hours)';
      expertConsultationRecommended = true;
    } else if (
      symLower.includes('blight') ||
      symLower.includes('wilt') ||
      symLower.includes('borer') ||
      symLower.includes('spreading') ||
      ['Flowering', 'Fruiting'].includes(cropData.growthStage)
    ) {
      riskLevel = 'HIGH';
      severity = 'High';
      urgency = 'Within 24 hours';
      expertConsultationRecommended = true;
    } else if (symLower.includes('minor') || symLower.includes('few') || cropData.growthStage === 'Seedling') {
      riskLevel = 'LOW';
      severity = 'Mild';
      urgency = 'Within 3-5 days';
      expertConsultationRecommended = false;
    }

    const riskReason = `${cropData.crop} at the ${cropData.growthStage} stage is vulnerable to yield loss if ${problemAnalysis.identifiedProblem} progresses untreated in ${cropData.soilType}.`;
    const riskFactors = [
      `Active ${cropData.growthStage} developmental window`,
      `Soil conditions in ${cropData.soilType} influencing symptom dynamics`,
      'Delayed diagnostic confirmation could escalate management costs',
    ];

    result = {
      riskLevel,
      severity,
      urgency,
      riskReason,
      riskFactors,
      expertConsultationRecommended,
    };
  }

  const executionTimeMs = Date.now() - startTime;
  return {
    output: result,
    executionTimeMs,
  };
};
