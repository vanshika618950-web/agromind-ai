import geminiService from '../geminiService.js';

export const runActionPlanner = async (cropData, problemAnalysis, cropReasoning, riskAssessment, language = 'en') => {
  const startTime = Date.now();

  const langInstruction =
    language === 'te'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write all human-readable text values (immediate, today, next3Days, next7Days, preventive, finalSummary) entirely in simple spoken Telugu suitable for farmers. JSON keys MUST stay in English.'
      : language === 'hi'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write all human-readable text values (immediate, today, next3Days, next7Days, preventive, finalSummary) entirely in simple spoken Hindi suitable for farmers. JSON keys MUST stay in English.'
      : 'CRITICAL LANGUAGE REQUIREMENT: Write in clear simple English.';

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

${langInstruction}

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
    // Agronomic Rule-based Expert Engine (Multilingual: en, te, hi)
    const isHighRisk = ['HIGH', 'CRITICAL'].includes(riskAssessment.riskLevel);
    let immediate = [];
    let today = [];
    let next3Days = [];
    let next7Days = [];
    let preventive = [];
    let finalSummary = '';

    if (language === 'te') {
      immediate = [
        `పొలంలో 10-15 ${cropData.crop} మొక్కలను దగ్గరగా పరిశీలించి, తెగులు ఎంతవరకు వ్యాపించిందో చూడండి.`,
        isHighRisk
          ? 'తెగులు ఎక్కువగా ఉన్న మొక్కలను గుర్తించి, వ్యవసాయ అధికారికి చూపించడానికి స్పష్టమైన ఫోటో తీయండి.'
          : 'నేలలో తేమ స్థాయిని తనిఖీ చేయండి.',
      ];
      today = [
        `${cropData.soilType} నేలకు తగిన విధంగా నీటి యాజమాన్యాన్ని సరిచేసుకోండి.`,
        'ఆకుల అడుగుభాగాన్ని పరిశీలించి పురుగులు లేదా బూజు తెగులు ఆనవాళ్లు ఉన్నాయో లేదో గమనించండి.',
      ];
      next3Days = [
        'కొత్తగా వచ్చే లేత ఆకులకు కూడా ఈ సమస్య వ్యాపిస్తుందో లేదో ప్రతిరోజూ గమనించండి.',
        'సిఫార్సు చేసిన పోషకాలను లేదా సేంద్రియ ద్రావణాన్ని పిచికారీ చేయడానికి సిద్ధం చేసుకోండి.',
      ];
      next7Days = [
        'తీసుకున్న చర్యల తర్వాత పంట కోలుకుంటుందో లేదో అంచనా వేయండి.',
        isHighRisk
          ? 'లక్షణాలు తగ్గకపోతే వెంటనే స్థానిక వ్యవసాయ విస్తరణ అధికారి (AEO)ని సంప్రదించండి.'
          : 'మొక్కలు తిరిగి పచ్చగా మారుతున్నాయో లేదో ధృవీకరించండి.',
      ];
      preventive = [
        `${cropData.soilType} నేల సారాన్ని పెంచడానికి పశువుల ఎరువు లేదా వర్మీ కంపోస్ట్ వాడండి.`,
        'వారానికి ఒకసారి పొలాన్ని క్రమం తప్పకుండా పరిశీలించే అలవాటు చేసుకోండి.',
      ];
      finalSummary = `AgroMind AI విశ్లేషణ ప్రకారం, మీ ${cropData.crop} పంటకు ${problemAnalysis.identifiedProblem} సమస్య ఉంది. పైన సూచించిన 7 రోజుల ప్రణాళికను పాటిస్తే పంట త్వరగా కోలుకుని మంచి దిగుబడి వస్తుంది.`;
    } else if (language === 'hi') {
      immediate = [
        `खेत में 10-15 ${cropData.crop} पौधों की बारीकी से जांच करें ताकि पता चले कि समस्या कितनी फैली है।`,
        isHighRisk
          ? 'अधिक प्रभावित पौधों के फोटो लें ताकि स्थानीय कृषि अधिकारी को दिखा सकें।'
          : 'मिट्टी में नमी की स्थिति जांचें।',
      ];
      today = [
        `${cropData.soilType} मिट्टी के अनुसार सिंचाई का सही समय निर्धारित करें।`,
        'पत्तियों की निचली सतह पर कीट या फफूंद के लक्षणों की जांच करें।',
      ];
      next3Days = [
        'ध्यान दें कि क्या नए पत्तों में भी यह समस्या आ रही है।',
        'अनुशंसित पोषक तत्वों या जैविक स्प्रे की तैयारी करें।',
      ];
      next7Days = [
        'दिए गए उपचार के बाद फसल के सुधार का आकलन करें।',
        isHighRisk
          ? 'यदि सुधार न हो तो तुरंत नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।'
          : 'पौधों में नया हरापन और बढ़वार देखें।',
      ];
      preventive = [
        `${cropData.soilType} मिट्टी में जैविक खाद या गोबर की खाद का नियमित उपयोग करें।`,
        'हफ्ते में कम से कम एक बार खेत का निरीक्षण अवश्य करें।',
      ];
      finalSummary = `AgroMind AI के विश्लेषण के अनुसार, आपकी ${cropData.crop} फसल में ${problemAnalysis.identifiedProblem} की समस्या है। सुझाई गई 7-दिवसीय कार्य योजना का पालन करने से फसल सुरक्षित रहेगी।`;
    } else {
      immediate = [
        `Carefully inspect 10-15 random ${cropData.crop} plants across the plot to establish whether the symptom is localized or systemic.`,
        isHighRisk
          ? 'Flag heavily symptomatic rows and take high-resolution photos for local agronomist validation.'
          : 'Check moisture level in the top 4 inches of soil with a soil probe or clean trowel.',
      ];
      today = [
        `Align irrigation schedule in ${cropData.soilType}: ${cropReasoning.irrigationAdvice.slice(0, 150)}`,
        'Examine underside of leaves and stems under bright sunlight with a magnifying lens for micro-pests or fungal spores.',
      ];
      next3Days = [
        'Document symptom progression: check whether newly emerging foliage exhibits discoloration or necrotic lesions.',
        `Prepare soil/foliar nutrient balancing: ${cropReasoning.nutrientAdvice.slice(0, 140)}`,
      ];
      next7Days = [
        'Evaluate response to adjusted irrigation and nutrient inputs.',
        isHighRisk
          ? 'Consult local agricultural extension center if yellowing/lesion expansion has not halted by Day 5.'
          : 'Verify uniform greening and resumption of vegetative expansion.',
      ];
      preventive = [
        `Incorporate balanced organic matter (FYM or compost) to fortify moisture buffering in ${cropData.soilType}.`,
        'Adopt scheduled morning field scouting and avoid working in wet foliage to minimize spore transmission.',
        'Calibrate irrigation volume dynamically against local seasonal rainfall data.',
      ];
      finalSummary = `Based on multi-agent analysis, the ${cropData.crop} shows ${riskAssessment.severity.toLowerCase()} risk associated with ${problemAnalysis.identifiedProblem.toLowerCase()}. Prompt adherence to the 7-day action plan will stabilize crop health and preserve yield potential.`;
    }

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
