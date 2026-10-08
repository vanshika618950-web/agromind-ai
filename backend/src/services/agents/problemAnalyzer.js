import geminiService from '../geminiService.js';

export const runProblemAnalyzer = async (cropData, language = 'en') => {
  const startTime = Date.now();

  const langInstruction =
    language === 'te'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write all human-readable text values (identifiedProblem, possibleCauses, keySymptoms, missingInformation) entirely in simple spoken Telugu suitable for farmers. JSON keys and category enum MUST stay in English.'
      : language === 'hi'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write all human-readable text values (identifiedProblem, possibleCauses, keySymptoms, missingInformation) entirely in simple spoken Hindi suitable for farmers. JSON keys and category enum MUST stay in English.'
      : 'CRITICAL LANGUAGE REQUIREMENT: Write in clear simple English.';

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

${langInstruction}

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
    // Expert Agronomic Rules Engine Fallback (Multilingual: en, te, hi)
    const symLower = cropData.symptoms.toLowerCase();
    let category = 'Crop Health';
    let identifiedProblem = '';
    let possibleCauses = [];
    let keySymptoms = [];
    let confidence = 0.78;
    let missingInfo = [];

    if (symLower.includes('yellow') || symLower.includes('chlorosis') || symLower.includes('పసుపు') || symLower.includes('पीला')) {
      category = 'Nutrient Management';
      confidence = 0.82;
      if (language === 'te') {
        identifiedProblem = `${cropData.growthStage} దశలో ఆకులు పసుపు రంగులోకి మారడం (క్లోరోసిస్)`;
        possibleCauses = [
          'నత్రజని (N) లేదా ఐరన్ (ఇనుము) లోపం',
          `${cropData.soilType} నేలలో అధిక నీరు నిలవడం వల్ల వేర్లకు గాలి అందకపోవడం`,
          'నెమటోడ్లు లేదా మొజాయిక్ తెగులు ప్రారంభ లక్షణం',
        ];
        keySymptoms = ['ఆకులు పసుపు రంగులోకి మారడం', 'మొక్క ఎదుగుదల మందగించడం'];
        missingInfo = ['పాత ఆకులా లేదా కొత్త ఆకులా పసుపు రంగులోకి మారినవి', 'నీరు పెట్టిన తర్వాత డ్రైనేజీ ఎలా ఉంది'];
      } else if (language === 'hi') {
        identifiedProblem = `${cropData.growthStage} अवस्था में पत्तियों का पीला पड़ना (क्लोरोसिस)`;
        possibleCauses = [
          'नाइट्रोजन (N) या आयरन (लोहे) की कमी',
          `${cropData.soilType} मिट्टी में पानी जमा होने से जड़ों को हवा न मिलना`,
          'नेमाटोड या मोज़ेक रोग के शुरुआती लक्षण',
        ];
        keySymptoms = ['पत्तियों का पीला होना', 'पौधे की धीमी बढ़वार'];
        missingInfo = ['पीलापन पुरानी पत्तियों पर है या नई पत्तियों पर', 'सिंचाई के बाद खेत में जल निकासी की स्थिति'];
      } else {
        identifiedProblem = `Chlorosis / leaf yellowing observed during ${cropData.growthStage} stage`;
        possibleCauses = [
          'Nitrogen (N) or Iron (Fe) deficiency',
          'Waterlogging causing root hypoxia in ' + cropData.soilType,
          'Nematode damage or early viral mosaic infection',
        ];
        keySymptoms = ['Leaf yellowing / Chlorosis', 'Reduced vegetative vigor'];
        missingInfo = ['Whether yellowing started on older leaves (N) or young leaves (Fe/S)', 'Drainage status after recent watering'];
      }
    } else if (symLower.includes('spot') || symLower.includes('rust') || symLower.includes('blight') || symLower.includes('fung') || symLower.includes('rot') || symLower.includes('మచ్చ') || symLower.includes('धब्बा')) {
      category = 'Pest/Disease Risk';
      confidence = 0.79;
      if (language === 'te') {
        identifiedProblem = `${cropData.crop} పంటలో ఆకులపై మచ్చలు / శిలీంధ్ర (ఫంగస్) తెగులు అనుమానం`;
        possibleCauses = [
          'తేమ మరియు వేడి వాతావరణం వల్ల వ్యాపించే శిలీంధ్ర తెగులు',
          'బ్యాక్టీరియల్ ఆకు మచ్చ తెగులు',
          'వర్షపు తుంపర్లు లేదా నీటి ద్వారా వ్యాపించే సంక్రమణ',
        ];
        keySymptoms = ['ఆకులపై మచ్చలు', 'కణజాలం ఎండిపోవడం'];
        missingInfo = ['మచ్చలపై వలయాలు ఉన్నాయా', 'స్థానిక వ్యవసాయ శాఖ ల్యాబ్ పరీక్ష'];
      } else if (language === 'hi') {
        identifiedProblem = `${cropData.crop} फसल में पत्तियों पर धब्बे / फफूंद (फंगल) रोग की आशंका`;
        possibleCauses = [
          'नमी और गर्म मौसम के कारण फैलने वाला फंगल संक्रमण',
          'बैक्टीरियल लीफ स्पॉट रोग',
          'पानी के छींटों से रोग का फैलाव',
        ];
        keySymptoms = ['पत्तियों पर धब्बे', 'ऊतकों का सूखना'];
        missingInfo = ['धब्बों के किनारे गोल छल्ले हैं या नहीं', 'निकटतम कृषि विज्ञान केंद्र की जांच'];
      } else {
        identifiedProblem = `Suspected fungal or bacterial foliar disease in ${cropData.crop}`;
        possibleCauses = [
          'Foliar fungal pathogen favored by humidity and warm temperatures',
          'Bacterial leaf blight or leaf spot disease',
          'Secondary lesion spread from rain splash or overhead irrigation',
        ];
        keySymptoms = ['Foliar spotting / lesions', 'Tissue necrosis'];
        missingInfo = ['Presence of water-soaked margins or concentric rings', 'Microscopic or local lab examination'];
      }
    } else {
      category = 'Crop Health';
      confidence = 0.78;
      if (language === 'te') {
        identifiedProblem = `${cropData.crop} పంటలో ఒత్తిడి మరియు ఎదుగుదల లోపం`;
        possibleCauses = [
          'పోషకాల అసమతుల్యత లేదా సూక్ష్మ పోషకాల లోపం',
          'నేలలో తేమ హెచ్చుతగ్గుల వల్ల పోషకాలు అందకపోవడం',
        ];
        keySymptoms = [cropData.symptoms.slice(0, 100)];
        missingInfo = ['ఇటీవల వేసిన ఎరువుల వివరాలు', 'నేల pH మరియు పరీక్ష వివరాలు'];
      } else if (language === 'hi') {
        identifiedProblem = `${cropData.crop} फसल में तनाव और धीमी वृद्धि`;
        possibleCauses = [
          'पोषक तत्वों का असंतुलन या सूक्ष्म पोषक तत्वों की कमी',
          'मिट्टी में नमी के उतार-चढ़ाव से पोषण में रुकावट',
        ];
        keySymptoms = [cropData.symptoms.slice(0, 100)];
        missingInfo = ['हाल ही में डाले गए उर्वरक की मात्रा', 'मिट्टी की जांच और pH मान'];
      } else {
        identifiedProblem = `Foliar stress and vigor suppression in ${cropData.crop}`;
        possibleCauses = [
          'Nutrient imbalance or micro-nutrient deficiency',
          'Root zone moisture fluctuations affecting nutrient uptake',
        ];
        keySymptoms = [cropData.symptoms.slice(0, 100)];
        missingInfo = ['Recent fertilizer application schedule and dosage', 'Soil pH and electrical conductivity (EC)'];
      }
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
