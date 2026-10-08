import geminiService from '../geminiService.js';

export const runProblemAnalyzer = async (cropData) => {
  const startTime = Date.now();

  const prompt = `You are Agent 1: Problem Analyzer Agent.
Analyze this agricultural crop advisory request:
- Crop: ${cropData.crop}
- Location: ${cropData.location}
- Soil Type: ${cropData.soilType}
- Growth Stage: ${cropData.growthStage}
- Observed Symptoms: ${cropData.symptoms}
- Irrigation Type: ${cropData.irrigation}
- Weather / Environment: ${cropData.weather || 'Not specified'}
- Additional Information: ${cropData.additionalInformation || 'None provided'}

Task:
1. Categorize into one of: ["Crop Health", "Nutrient Management", "Irrigation", "Soil Management", "Pest/Disease Risk", "Weather/Environmental Stress", "General Crop Management"].
2. Identify the core problem clearly.
3. List 2-4 possible root causes (distinguishing possible causes from confirmed diagnoses).
4. Extract 2-4 key symptoms.
5. Provide a confidence score between 0.50 and 0.95.
6. List 1-3 critical missing information pieces that would help confirm diagnosis.`;

  const schema = `{
  "category": "Crop Health",
  "identifiedProblem": "Brief clear summary of the issue",
  "possibleCauses": ["Cause 1", "Cause 2"],
  "keySymptoms": ["Symptom 1", "Symptom 2"],
  "confidence": 0.78,
  "missingInformation": ["e.g. soil test pH", "recent pesticide spraying dates"]
}`;

  let result = await geminiService.generateStructuredResponse(prompt, schema);

  if (!result) {
    // Expert Agronomic Rules Engine Fallback
    const symLower = cropData.symptoms.toLowerCase();
    let category = 'Crop Health';
    let identifiedProblem = `Foliar stress and vigor suppression in ${cropData.crop}`;
    let possibleCauses = [
      'Nutrient imbalance or micro-nutrient deficiency',
      'Root zone moisture fluctuations affecting nutrient uptake',
    ];
    let keySymptoms = [cropData.symptoms.slice(0, 100)];
    let confidence = 0.78;
    let missingInfo = ['Recent fertilizer application schedule and dosage', 'Soil pH and electrical conductivity (EC)'];

    if (symLower.includes('yellow') || symLower.includes('chlorosis')) {
      category = 'Nutrient Management';
      identifiedProblem = `Chlorosis / leaf yellowing observed during ${cropData.growthStage} stage`;
      possibleCauses = [
        'Nitrogen (N) or Iron (Fe) deficiency',
        'Waterlogging causing root hypoxia in ' + cropData.soilType,
        'Nematode damage or early viral mosaic infection',
      ];
      keySymptoms = ['Leaf yellowing / Chlorosis', 'Reduced vegetative vigor'];
      confidence = 0.82;
      missingInfo = ['Whether yellowing started on older leaves (N) or young leaves (Fe/S)', 'Drainage status after recent watering'];
    } else if (symLower.includes('spot') || symLower.includes('rust') || symLower.includes('blight') || symLower.includes('fung') || symLower.includes('rot')) {
      category = 'Pest/Disease Risk';
      identifiedProblem = `Suspected fungal or bacterial foliar disease in ${cropData.crop}`;
      possibleCauses = [
        'Foliar fungal pathogen favored by humidity and warm temperatures',
        'Bacterial leaf blight or leaf spot disease',
        'Secondary lesion spread from rain splash or overhead irrigation',
      ];
      keySymptoms = ['Foliar spotting / lesions', 'Tissue necrosis'];
      confidence = 0.79;
      missingInfo = ['Presence of water-soaked margins or concentric rings', 'Microscopic or local lab examination'];
    } else if (symLower.includes('wilt') || symLower.includes('droop') || symLower.includes('dry')) {
      category = 'Irrigation';
      identifiedProblem = `Vascular wilting or acute water stress in ${cropData.soilType}`;
      possibleCauses = [
        'Insufficient moisture retention or moisture stress in ' + cropData.soilType,
        'Vascular wilt (Fusarium/Verticillium species)',
        'Root burn from excessive saline fertilizers',
      ];
      keySymptoms = ['Foliar wilting and drooping', 'Moisture deficit stress'];
      confidence = 0.81;
      missingInfo = ['Sub-surface soil moisture test depth', 'Vascular browning inside stem cross-section'];
    } else if (symLower.includes('pest') || symLower.includes('worm') || symLower.includes('insect') || symLower.includes('hole') || symLower.includes('eat')) {
      category = 'Pest/Disease Risk';
      identifiedProblem = `Insect pest feeding or borer infestation during ${cropData.growthStage}`;
      possibleCauses = [
        'Lepidopteran larvae (caterpillars / armyworms / bollworms)',
        'Sucking pests (aphids, thrips, or whiteflies)',
        'Chewing beetles damaging foliage',
      ];
      keySymptoms = ['Physical foliage perforation / damage', 'Pest activity'];
      confidence = 0.84;
      missingInfo = ['Direct insect sighting or frass (droppings) on underside of leaves'];
    }

    result = {
      category,
      identifiedProblem,
      possibleCauses,
      keySymptoms,
      confidence,
      missingInformation: missingInfo,
    };
  }

  const executionTimeMs = Date.now() - startTime;
  return {
    output: result,
    executionTimeMs,
  };
};
