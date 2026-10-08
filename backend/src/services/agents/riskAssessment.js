import geminiService from '../geminiService.js';

export const runRiskAssessment = async (cropData, problemAnalysis, cropReasoning, language = 'en') => {
  const startTime = Date.now();

  const langInstruction =
    language === 'te'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write human-readable text values (severity, urgency, riskReason, riskFactors) entirely in simple spoken Telugu suitable for farmers. JSON keys and riskLevel enum (LOW, MEDIUM, HIGH, CRITICAL) MUST stay in English.'
      : language === 'hi'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write human-readable text values (severity, urgency, riskReason, riskFactors) entirely in simple spoken Hindi suitable for farmers. JSON keys and riskLevel enum (LOW, MEDIUM, HIGH, CRITICAL) MUST stay in English.'
      : 'CRITICAL LANGUAGE REQUIREMENT: Write in clear simple English.';

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

${langInstruction}

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
    // Agronomic Rule-based Expert Engine (Multilingual: en, te, hi)
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
      symLower.includes('devastating') ||
      symLower.includes('తీవ్ర') ||
      symLower.includes('గంభీర')
    ) {
      riskLevel = 'CRITICAL';
      severity = language === 'te' ? 'తీవ్రమైనది' : language === 'hi' ? 'गंभीर' : 'Critical';
      urgency = language === 'te' ? 'వెంటనే (12 గంటల్లో)' : language === 'hi' ? 'तुरंत (12 घंटे के भीतर)' : 'Immediate (Within 12 hours)';
      expertConsultationRecommended = true;
    } else if (
      symLower.includes('blight') ||
      symLower.includes('wilt') ||
      symLower.includes('borer') ||
      symLower.includes('spreading') ||
      ['Flowering', 'Fruiting'].includes(cropData.growthStage)
    ) {
      riskLevel = 'HIGH';
      severity = language === 'te' ? 'అధికం' : language === 'hi' ? 'उच्च' : 'High';
      urgency = language === 'te' ? '24 గంటల్లో' : language === 'hi' ? '24 घंटे के भीतर' : 'Within 24 hours';
      expertConsultationRecommended = true;
    } else if (symLower.includes('minor') || symLower.includes('few') || cropData.growthStage === 'Seedling') {
      riskLevel = 'LOW';
      severity = language === 'te' ? 'తక్కువ' : language === 'hi' ? 'कम' : 'Mild';
      urgency = language === 'te' ? '3-5 రోజుల్లో' : language === 'hi' ? '3-5 दिनों में' : 'Within 3-5 days';
      expertConsultationRecommended = false;
    } else {
      severity = language === 'te' ? 'మధ్యస్థం' : language === 'hi' ? 'मध्यम' : 'Moderate';
      urgency = language === 'te' ? '24-48 గంటల్లో' : language === 'hi' ? '24-48 घंटों में' : 'Within 24-48 hours';
    }

    let riskReason = '';
    let riskFactors = [];

    if (language === 'te') {
      riskReason = `${cropData.growthStage} దశలో ఉన్న ${cropData.crop} పంటకు సకాలంలో చికిత్స చేయకపోతే దిగుబడి తగ్గే ప్రమాదం ఉంది.`;
      riskFactors = [
        `పంట ${cropData.growthStage} కీలకమైన దశలో ఉండటం`,
        `${cropData.soilType} నేలలో తేమ హెచ్చుతగ్గులు`,
        'సకాలంలో చర్యలు తీసుకోకపోతే నివారణ ఖర్చు పెరిగే అవకాశం',
      ];
    } else if (language === 'hi') {
      riskReason = `${cropData.growthStage} अवस्था में ${cropData.crop} फसल का समय पर उपचार न करने से पैदावार में कमी आ सकती है।`;
      riskFactors = [
        `फसल का ${cropData.growthStage} संवेदनशील अवस्था में होना`,
        `${cropData.soilType} मिट्टी में नमी का प्रभाव`,
        'देरी करने से बीमारी बढ़ने और खर्च बढ़ने की आशंका',
      ];
    } else {
      riskReason = `${cropData.crop} at the ${cropData.growthStage} stage is vulnerable to yield loss if ${problemAnalysis.identifiedProblem} progresses untreated in ${cropData.soilType}.`;
      riskFactors = [
        `Active ${cropData.growthStage} developmental window`,
        `Soil conditions in ${cropData.soilType} influencing symptom dynamics`,
        'Delayed diagnostic confirmation could escalate management costs',
      ];
    }

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
