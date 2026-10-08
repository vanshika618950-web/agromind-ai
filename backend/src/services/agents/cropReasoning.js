import geminiService from '../geminiService.js';

// Helper to generate crop-tailored agronomic prescription
const getAgronomicPrescription = (cropData, problemAnalysis, language = 'en') => {
  const cropLower = (cropData.crop || '').toLowerCase();
  const problemLower = (problemAnalysis.identifiedProblem || '').toLowerCase();

  if (language === 'te') {
    if (cropLower.includes('tomato') || cropLower.includes('టమాట')) {
      return {
        diagnosis: `${cropData.crop}: ఆకు మచ్చ తెగులు & ప్రారంభ ఎండు తెగులు చికిత్స`,
        items: [
          {
            medicineName: 'మాంకోజెబ్ 75% WP (Mancozeb - Dithane M-45)',
            category: 'రసాయన బూజు నాశిని (Curative Fungicide)',
            activeIngredient: 'Mancozeb 75% WP',
            dosage: '2.5 గ్రాములు / లీటరు నీటికి (ఎకరాకు 500 గ్రాములు 200 లీటర్ల నీటిలో)',
            applicationMethod: 'ఆకులపై పిచికారీ (Foliar Spray)',
            timing: 'ఉదయం 6:30 నుండి 9:00 గంటల మధ్య లేదా సాయంత్రం వేళల్లో',
            waitingPeriod: '7 రోజులు (కోతకు ముందు నిరీక్షణ సమయం - PHI)',
            targetPathogen: 'ఆల్టర్నేరియా ఆకు మచ్చ & బూజు తెగులు',
            safetyPrecautions: 'పిచికారీ చేసేటప్పుడు తప్పనిసరిగా మాస్క్ మరియు చేతి తొడుగులు ధరించండి.',
            organicAlternative: 'వేపనూనె (Neem Oil 10,000 ppm) 3-5 మి.లీ/లీ + ట్రైకోడెర్మా విరిడే 5 గ్రా/లీ',
          },
          {
            medicineName: 'ట్రైకోడెర్మా విరిడే (Trichoderma viride 1.5% WP)',
            category: 'సేంద్రియ జీవ నియంత్రణ (Bio-Fungicide)',
            activeIngredient: 'Trichoderma viride (2x10^8 CFU/g)',
            dosage: '5 గ్రాములు / లీటరు నీటికి లేదా ఎకరాకు 1 కిలో పశువుల ఎరువుతో',
            applicationMethod: 'మొక్కల మొదళ్లలో తడపడం / పిచికారీ',
            timing: 'నేలలో తగినంత తేమ ఉన్నప్పుడు, సాయంత్రం వేళల్లో',
            waitingPeriod: 'సున్నా (రసాయన అవశేషాలు ఉండవు - సేంద్రీయం)',
            targetPathogen: 'వేరుకుళ్లు మరియు నేల ద్వారా సంక్రమించే బూజు తెగుళ్లు',
            safetyPrecautions: 'రసాయన మందులతో కలిపి ఒకేసారి పిచికారీ చేయకూడదు.',
            organicAlternative: 'సూడోమోనాస్ ఫ్లోరోసెన్స్ (Pseudomonas fluorescens) 5 గ్రా/లీ',
          },
          {
            medicineName: '19:19:19 NPK + చిలేటెడ్ సూక్ష్మ పోషకాలు (Zinc & Boron)',
            category: 'పోషక పునరుద్ధరణ స్ప్రే (Nutritional Foliar)',
            activeIngredient: 'Water Soluble NPK + Chelated Micronutrients',
            dosage: '4-5 గ్రాములు / లీటరు నీటికి',
            applicationMethod: 'ఆకులపై పిచికారీ (Foliar Spray)',
            timing: 'రోగ నివారణ మందు పిచికారీ చేసిన 3-4 రోజుల తర్వాత',
            waitingPeriod: 'వర్తించదు (పోషక అనుబంధం)',
            targetPathogen: 'పసుపు పచ్చదనం నివారణ & కొత్త చిగుళ్ల పెరుగుదల',
            safetyPrecautions: 'ఎండ తీవ్రంగా ఉన్నప్పుడు పిచికారీ చేయవద్దు.',
            organicAlternative: 'పంచగవ్య 30 మి.లీ / లీటరు నీటికి లేదా జీవామృతం',
          },
        ],
        applicationWindow: 'ఉదయం 6:30 - 9:00 లేదా సాయంత్రం 4:30 - 6:30 (ఎండ లేని వేళల్లో)',
        tankMixCompatibility: 'జీవ రసాయనాలను (ట్రైకోడెర్మా) రసాయన మందులతో నేరుగా ఒకే ట్యాంకులో కలపవద్దు.',
        safetyNotice: 'రసాయన మందుల డబ్బాలను పిల్లలకు, పశువులకు దూరంగా ఉంచండి. ఖాళీ డబ్బాలను జాగ్రత్తగా పారవేయండి.',
      };
    }

    // Default Telugu prescription for all other crops
    return {
      diagnosis: `${cropData.crop}: సమగ్ర పంట రక్షణ & చికిత్స ప్రిస్క్రిప్షన్`,
      items: [
        {
          medicineName: 'కాపర్ ఆక్సిక్లోరైడ్ 50% WP లేదా మాంకోజెబ్ 75% WP',
          category: 'రక్షణ & నివారణ బూజు నాశిని (Broad-Spectrum Fungicide)',
          activeIngredient: 'Copper Oxychloride 50% WP / Mancozeb 75% WP',
          dosage: '2.5 - 3.0 గ్రాములు / లీటరు నీటికి (ఎకరాకు 500-600 గ్రాములు)',
          applicationMethod: 'మొక్క అంతా తడిసేలా పిచికారీ',
          timing: 'ఉదయం వేళల్లో గాలి వేగం తక్కువగా ఉన్నప్పుడు',
          waitingPeriod: '7-10 రోజులు (Pre-Harvest Interval)',
          targetPathogen: 'ఆకు మచ్చలు, బూజు తెగుళ్లు మరియు ఎండు తెగులు',
          safetyPrecautions: 'గాలికి ఎదురుగా పిచికారీ చేయవద్దు. మాస్క్ ధరించండి.',
          organicAlternative: 'వేపనూనె 10,000 ppm @ 4-5 మి.లీ/లీటరు లేదా పులిసిన మజ్జిగ ద్రావణం',
        },
        {
          medicineName: 'ట్రైకోడెర్మా విరిడే లేదా సూడోమోనాస్ ఫ్లోరోసెన్స్',
          category: 'సేంద్రియ జీవ నియంత్రణ (Biological Alternative)',
          activeIngredient: 'Beneficial Bio-Agent Culture (CFU > 2x10^8)',
          dosage: '5 గ్రాములు / లీటరు నీటికి లేదా ఎకరాకు 1-2 కిలోలు',
          applicationMethod: 'మొక్కల మొదళ్లలో పోయడం లేదా పిచికారీ',
          timing: 'సాయంత్రం వేళల్లో',
          waitingPeriod: 'సేంద్రీయం (నిరీక్షణ సమయం అవసరం లేదు)',
          targetPathogen: 'నేల ద్వారా వ్యాపించే తెగుళ్లు',
          safetyPrecautions: 'తయారుచేసిన ద్రావణాన్ని 24 గంటలలోపు వాడాలి.',
          organicAlternative: 'జీవామృతం లేదా ఘన జీవామృతం',
        },
        {
          medicineName: 'చిలేటెడ్ జింక్ (Zn EDTA 12%) + బోరాన్ 20%',
          category: 'సూక్ష్మ పోషక టానిక్ (Micronutrient Booster)',
          activeIngredient: 'Chelated Zinc (12%) + Disodium Octaborate (20%)',
          dosage: '1.0 గ్రాము జింక్ + 1.0 గ్రాము బోరాన్ / లీటరు నీటికి',
          applicationMethod: 'ఆకులపై పిచికారీ',
          timing: 'ఉదయం లేదా సాయంత్రం',
          waitingPeriod: 'వర్తించదు',
          targetPathogen: 'పోషకాహార లోపం, పూత రాలడం నివారణ',
          safetyPrecautions: 'సిఫార్సు చేసిన మోతాదులోనే వాడండి.',
          organicAlternative: 'వర్మీవాష్ లేదా వేస్ట్ డీకంపోజర్ ద్రావణం',
        },
      ],
      applicationWindow: 'ఉదయం 6:30 - 9:00 లేదా సాయంత్రం 4:30 - 6:30',
      tankMixCompatibility: 'రసాయన మందులు మరియు జీవ శిలీంద్రాలను వేర్వేరుగా పిచికారీ చేయండి.',
      safetyNotice: 'రక్షణ పరికరాలు ధరించండి. పిచికారీ తర్వాత చేతులు శుభ్రంగా కడుక్కోండి.',
    };
  }

  if (language === 'hi') {
    if (cropLower.includes('tomato') || cropLower.includes('टमाटर')) {
      return {
        diagnosis: `${cropData.crop}: पर्ण धब्बा और अगेती झुलसा रोग उपचार`,
        items: [
          {
            medicineName: 'मैंकोजेब 75% WP (Mancozeb - Dithane M-45)',
            category: 'उपचारात्मक फफूंदनाशी (Curative Fungicide)',
            activeIngredient: 'Mancozeb 75% WP',
            dosage: '2.5 ग्राम / लीटर पानी (एकड़ में 500 ग्राम 200 लीटर पानी में)',
            applicationMethod: 'पत्तियों पर छिड़काव (Foliar Spray)',
            timing: 'सुबह 6:30 से 9:00 बजे के बीच या शाम के समय',
            waitingPeriod: '7 दिन (तुड़ाई से पहले प्रतीक्षा अवधि - PHI)',
            targetPathogen: 'अल्टरनेरिया पत्ती धब्बा व झुलसा फफूंद',
            safetyPrecautions: 'छिड़काव के समय दस्ताने और मास्क अवश्य पहनें।',
            organicAlternative: 'नीम का तेल (Neem Oil 10,000 ppm) 3-5 मिली/लीटर + ट्राइकोडर्मा 5 ग्राम/लीटर',
          },
          {
            medicineName: 'ट्राइकोडर्मा विरिडी (Trichoderma viride 1.5% WP)',
            category: 'जैविक नियंत्रण (Bio-Fungicide)',
            activeIngredient: 'Trichoderma viride (2x10^8 CFU/g)',
            dosage: '5 ग्राम / लीटर पानी या 1 किलो प्रति एकड़ गोबर की खाद में मिलाकर',
            applicationMethod: 'जड़ों के पास ड्रेंचिंग या पत्तियों पर छिड़काव',
            timing: 'शाम के समय जब मिट्टी में पर्याप्त नमी हो',
            waitingPeriod: 'शून्य (कोई रासायनिक अवशेष नहीं - 100% जैविक)',
            targetPathogen: 'जड़ गलन और मिट्टी जनित कवक रोग',
            safetyPrecautions: 'रासायनिक फफूंदनाशी के साथ मिलाकर न डालें।',
            organicAlternative: 'स्यूडोमोनास फ्लोरोसेंस 5 ग्राम/लीटर',
          },
          {
            medicineName: 'घुलनशील NPK 19:19:19 + कीलेटेड जिंक व बोरोन',
            category: 'पोषक तत्व स्प्रे (Foliar Nutrition)',
            activeIngredient: '100% Water Soluble NPK + Chelated Micronutrients',
            dosage: '4-5 ग्राम / लीटर पानी',
            applicationMethod: 'पत्तियों पर छिड़काव (Foliar Spray)',
            timing: 'दवा छिड़काव के 3-4 दिन बाद',
            waitingPeriod: 'लागू नहीं (पोषक पूरक)',
            targetPathogen: 'पत्तियों का पीलापन दूर करना और नई शाखाओं की बढ़वार',
            safetyPrecautions: 'तेज धूप में छिड़काव न करें।',
            organicAlternative: 'पंचगव्य 30 मिली / लीटर या जीवामृत',
          },
        ],
        applicationWindow: 'सुबह 6:30 - 9:00 या शाम 4:30 - 6:30 बजे',
        tankMixCompatibility: 'जैविक दवाओं को सीधे रासायनिक कीटनाशकों के साथ न मिलाएं।',
        safetyNotice: 'छिड़काव के बाद हाथ साबुन से धोएं और बच्चों को दूर रखें।',
      };
    }

    // Default Hindi prescription
    return {
      diagnosis: `${cropData.crop}: संपूर्ण पौध संरक्षण एवं उपचार प्रिस्क्रिप्शन`,
      items: [
        {
          medicineName: 'कॉपर ऑक्सीक्लोराइड 50% WP या मैंकोजेब 75% WP',
          category: 'व्यापक सुरक्षात्मक फफूंदनाशी (Broad-Spectrum Fungicide)',
          activeIngredient: 'Copper Oxychloride 50% WP / Mancozeb 75% WP',
          dosage: '2.5 - 3.0 ग्राम / लीटर पानी (500-600 ग्राम प्रति एकड़)',
          applicationMethod: 'पौधों पर पूर्ण छिड़काव',
          timing: 'सुबह के समय जब हवा शांत हो',
          waitingPeriod: '7-10 दिन (तुड़ाई से पूर्व सुरक्षा अवधि)',
          targetPathogen: 'पत्ती धब्बा, झुलसा और फफूंद जनित रोग',
          safetyPrecautions: 'हवा के विपरीत दिशा में छिड़काव न करें।',
          organicAlternative: 'नीम तेल 10,000 ppm @ 4-5 मिली/लीटर या खट्टी छाछ का घोल',
        },
        {
          medicineName: 'ट्राइकोडर्मा विरिडी या स्यूडोमोनास फ्लोरोसेंस',
          category: 'जैविक बायो-एजेंट (Biological Control)',
          activeIngredient: 'Beneficial Microorganism Culture (> 2x10^8 CFU)',
          dosage: '5 ग्राम / लीटर पानी या 1-2 किलो प्रति एकड़',
          applicationMethod: 'जड़ों के पास सिंचन या छिड़काव',
          timing: 'शाम के समय',
          waitingPeriod: 'जैविक (प्रतीक्षा अवधि नहीं)',
          targetPathogen: 'मिट्टी जनित बीमारियां एवं जड़ सुरक्षा',
          safetyPrecautions: 'घोल बनाने के 24 घंटे के भीतर उपयोग करें।',
          organicAlternative: 'जीवामृत या वर्मीवाश',
        },
        {
          medicineName: 'कीलेटेड जिंक (Zn EDTA 12%) + बोरोन 20%',
          category: 'सूक्ष्म पोषक टॉनिक (Micronutrient Booster)',
          activeIngredient: 'Chelated Zinc (12%) + Disodium Octaborate (20%)',
          dosage: '1 ग्राम जिंक + 1 ग्राम बोरोन / लीटर पानी',
          applicationMethod: 'पर्ण छिड़काव (Foliar Spray)',
          timing: 'सुबह या शाम',
          waitingPeriod: 'लागू नहीं',
          targetPathogen: 'सूक्ष्म पोषक तत्वों की कमी और फूल झड़ने से रोकथाम',
          safetyPrecautions: 'अनुशंसित मात्रा से अधिक न डालें।',
          organicAlternative: 'वर्मीवाश या अपशिष्ट डीकंपोजर घोल',
        },
      ],
      applicationWindow: 'सुबह 6:30 - 9:00 या शाम 4:30 - 6:30 बजे',
      tankMixCompatibility: 'रासायनिक और जैविक खादों को अलग-अलग छिड़कें।',
      safetyNotice: 'सुरक्षात्मक मास्क और दस्ताने पहनें। पशुओं को दूर रखें।',
    };
  }

  // English Prescription
  if (cropLower.includes('tomato')) {
    return {
      diagnosis: `${cropData.crop}: Targeted Foliar Blight & Vigor Restoration Protocol`,
      items: [
        {
          medicineName: 'Mancozeb 75% WP (Dithane M-45)',
          category: 'Curative Fungicide',
          activeIngredient: 'Mancozeb 75% WP (Dithiocarbamate group)',
          dosage: '2.5 g / Liter of water (500 g / acre in 200 Liters of water)',
          applicationMethod: 'Uniform Foliar Spray (cover upper and lower leaf surfaces)',
          timing: 'Early morning (6:30 - 8:30 AM) or late afternoon; repeat in 10 days if symptoms persist',
          waitingPeriod: '7 days (Pre-Harvest Interval - PHI)',
          targetPathogen: 'Alternaria solani (Early Blight) & Septoria Leaf Spot',
          safetyPrecautions: 'Wear protective mask, goggles, and gloves. Do not spray against headwind.',
          organicAlternative: 'Neem Oil (Azadirachtin 10,000 ppm) @ 3-5 ml/L + Trichoderma viride 5 g/L',
        },
        {
          medicineName: 'Trichoderma viride 1.5% WP (Bio-Fungicide)',
          category: 'Organic / Bio-Control Agent',
          activeIngredient: 'Trichoderma viride antagonistic fungal spores (2x10^8 CFU/g)',
          dosage: '5.0 g / Liter of water (or 1 kg / acre mixed with 100 kg compost)',
          applicationMethod: 'Root Zone Drenching & Light Foliar Canopy Mist',
          timing: 'Late afternoon in moist soil conditions',
          waitingPeriod: '0 days (Eco-friendly, certified organic biological)',
          targetPathogen: 'Rhizoctonia & Fusarium root-rot complexes',
          safetyPrecautions: 'Do not tank-mix with chemical fungicides. Store in cool, shaded area.',
          organicAlternative: 'Pseudomonas fluorescens 1.5% WP @ 5 g/L',
        },
        {
          medicineName: '19:19:19 NPK + Chelated Zinc (Zn-EDTA 12%) & Boron (20%)',
          category: 'Nutritional Recovery Booster',
          activeIngredient: 'Water-Soluble NPK + Chelated Micronutrients',
          dosage: '4.0 g / Liter of water (800 g / acre in 200 Liters)',
          applicationMethod: 'Foliar Spray',
          timing: 'Apply 3-4 days following the curative fungicide spray',
          waitingPeriod: 'Not applicable (Nutritional supplement)',
          targetPathogen: 'Interveinal chlorosis, foliar yellowing & blossom drop prevention',
          safetyPrecautions: 'Avoid applying during high-temperature midday sun to prevent leaf scorch.',
          organicAlternative: 'Fermented Panchagavya @ 30 ml/L or Seaweed Extract @ 2 ml/L',
        },
      ],
      applicationWindow: 'Calm morning (6:30 - 9:00 AM) or late afternoon (4:30 - 6:30 PM)',
      tankMixCompatibility: 'Never mix live bio-agents (Trichoderma) in the same tank with chemical fungicides. Always conduct a small jar test before combining fertilizers with crop protection chemicals.',
      safetyNotice: 'Keep chemical containers out of reach of children and livestock. Rinse spraying equipment three times in drainage areas away from open water wells.',
    };
  }

  // General English fallback
  return {
    diagnosis: `${cropData.crop}: Comprehensive Therapeutic Plant Health Protocol`,
    items: [
      {
        medicineName: 'Copper Oxychloride 50% WP or Mancozeb 75% WP',
        category: 'Broad-Spectrum Curative Fungicide',
        activeIngredient: 'Copper Oxychloride 50% WP / Mancozeb 75% WP',
        dosage: '2.5 - 3.0 g / Liter of water (500-600 g / acre in 200 Liters)',
        applicationMethod: 'Foliar Spray evenly covering plant canopy',
        timing: 'Early morning under calm wind conditions; re-evaluate after 10 days',
        waitingPeriod: '7-10 days (Pre-Harvest Interval - PHI)',
        targetPathogen: 'Fungal leaf spots, anthracnose, and foliar blights',
        safetyPrecautions: 'Wear protective mask and gloves. Avoid spraying when rain is forecasted within 4 hours.',
        organicAlternative: 'Cold-pressed Neem Oil 10,000 ppm @ 4 ml/L with liquid organic soap emulsifier',
      },
      {
        medicineName: 'Trichoderma viride or Pseudomonas fluorescens',
        category: 'Biological Antagonist / Bio-Control',
        activeIngredient: 'Beneficial Microorganism Spores (> 2x10^8 CFU/g)',
        dosage: '5.0 g / Liter of water (or 1-2 kg / acre enriched in farmyard manure)',
        applicationMethod: 'Soil application / Root collar drench',
        timing: 'Late afternoon in moist soil conditions',
        waitingPeriod: '0 days (Non-toxic biological)',
        targetPathogen: 'Soil-borne pathogens and root health suppression',
        safetyPrecautions: 'Apply within 24 hours of mixing with water. Do not expose to direct noon sunlight.',
        organicAlternative: 'Liquid Jeevamrutham or Vermiwash @ 50 ml/L',
      },
      {
        medicineName: 'Chelated Zinc (Zn-EDTA 12%) + Soluble Boron (20%)',
        category: 'Micronutrient Foliar Supplement',
        activeIngredient: 'Chelated Micronutrient Complex',
        dosage: '1.0 g Zinc + 1.0 g Boron / Liter of water',
        applicationMethod: 'Fine droplet foliar spray',
        timing: 'Morning or late afternoon',
        waitingPeriod: 'Not applicable (Nutritional supplement)',
        targetPathogen: 'Micronutrient deficiency chlorosis & tissue vigor restoration',
        safetyPrecautions: 'Ensure correct dosage; avoid over-concentration.',
        organicAlternative: 'Humic acid 12% @ 3 ml/L or Seaweed extract',
      },
    ],
    applicationWindow: 'Calm morning (6:30 - 9:00 AM) or late afternoon (4:30 - 6:30 PM)',
    tankMixCompatibility: 'Do not combine biological agents in the same tank with synthetic chemical fungicides. Spray bio-agents 4-5 days apart from chemical sprays.',
    safetyNotice: 'Wear full protective personal equipment. Wash hands and face thoroughly following application.',
  };
};

export const runCropReasoning = async (cropData, problemAnalysis, language = 'en') => {
  const startTime = Date.now();

  const langInstruction =
    language === 'te'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write all human-readable text values (analysis, action, reason, irrigationAdvice, nutrientAdvice, and prescription fields) entirely in simple spoken Telugu suitable for farmers. JSON keys and priority enum (LOW, MEDIUM, HIGH, CRITICAL) MUST stay in English.'
      : language === 'hi'
      ? 'CRITICAL LANGUAGE REQUIREMENT: Write all human-readable text values (analysis, action, reason, irrigationAdvice, nutrientAdvice, and prescription fields) entirely in simple spoken Hindi suitable for farmers. JSON keys and priority enum (LOW, MEDIUM, HIGH, CRITICAL) MUST stay in English.'
      : 'CRITICAL LANGUAGE REQUIREMENT: Write in clear simple English.';

  const prompt = `You are Agent 2: Crop Reasoning Agent.
You are receiving the agricultural facts and the output from Agent 1 (Problem Analyzer).

Agricultural Input:
- Crop: ${cropData.crop}
- Location: ${cropData.location}
- Soil: ${cropData.soilType}
- Growth Stage: ${cropData.growthStage}
- Irrigation Method: ${cropData.irrigation}
- Weather / Environment: ${cropData.weather || 'Normal'}
- Additional Notes: ${cropData.additionalInformation || 'None'}

Agent 1 Problem Analysis:
- Category: ${problemAnalysis.category}
- Identified Problem: ${problemAnalysis.identifiedProblem}
- Possible Causes: ${JSON.stringify(problemAnalysis.possibleCauses)}
- Key Symptoms: ${JSON.stringify(problemAnalysis.keySymptoms)}
- Confidence: ${problemAnalysis.confidence}

${langInstruction}

Task:
1. Provide an in-depth agronomic analysis contextualized to ${cropData.crop} in ${cropData.soilType} soil during the ${cropData.growthStage} phase.
2. Provide 2-4 structured recommendations with "action", "reason", and "priority" (LOW, MEDIUM, HIGH, CRITICAL).
3. Provide tailored irrigation guidance specific to ${cropData.crop} and ${cropData.soilType}.
4. Provide tailored nutrient and fertilizer guidance suitable for this crop and stage.
5. Provide a detailed, practical crop Rx PRESCRIPTION recommendation with exact medicines/formulations (Chemical curative, Bio-control/Organic alternative, Micronutrient booster), exact dosage per liter of water and per acre, application method, timing, Pre-Harvest Interval (waiting period), and safety precautions.`;

  const schema = `{
  "analysis": "Detailed agricultural reasoning about the crop physiology and soil context...",
  "recommendations": [
    {
      "action": "Inspect root zone and check aeration",
      "reason": "Allows verification of root health and moisture saturation levels in the soil",
      "priority": "HIGH"
    }
  ],
  "irrigationAdvice": "Specific irrigation scheduling and quantity advice...",
  "nutrientAdvice": "Specific nutrient and soil amendment advice...",
  "prescription": {
    "diagnosis": "Targeted diagnostic condition...",
    "items": [
      {
        "medicineName": "Mancozeb 75% WP (Dithane M-45)",
        "category": "Curative Fungicide",
        "activeIngredient": "Mancozeb 75% WP",
        "dosage": "2.5 g / Liter of water (500 g / acre in 200 Liters)",
        "applicationMethod": "Foliar Spray",
        "timing": "Early morning (6:30 - 8:30 AM)",
        "waitingPeriod": "7 days (Pre-Harvest Interval)",
        "targetPathogen": "Foliar blight and leaf spot fungi",
        "safetyPrecautions": "Wear mask and gloves during application.",
        "organicAlternative": "Neem Oil 10,000 ppm @ 3-5 ml/L + Trichoderma viride 5 g/L"
      }
    ],
    "applicationWindow": "Early morning (6:30 - 9:00 AM) or late afternoon",
    "tankMixCompatibility": "Do not mix live bio-agents with chemical fungicides. Conduct jar test.",
    "safetyNotice": "Wear protective gear. Keep livestock and children away from treated area."
  }
}`;

  let result = await geminiService.generateStructuredResponse(prompt, schema);

  const fallbackPrescription = getAgronomicPrescription(cropData, problemAnalysis, language);

  if (!result) {
    // Agronomic Rule-based Expert Engine (Multilingual: en, te, hi)
    let analysis = '';
    let recommendations = [];
    let irrigationAdvice = '';
    let nutrientAdvice = '';

    if (language === 'te') {
      analysis = `${cropData.crop} పంట ${cropData.growthStage} దశలో ఉంది. ${cropData.soilType} నేలలో తేమ సమతుల్యత చాలా ముఖ్యం. ${problemAnalysis.identifiedProblem} సమస్యను అరికట్టడానికి సకాలంలో చర్యలు చేపట్టాలి.`;
      recommendations = [
        {
          action: `${cropData.soilType} నేలలో వేర్ల ఆరోగ్యాన్ని మరియు నేలలో తేమను పరిశీలించండి`,
          reason: 'వేర్లు కుళ్ళిపోకుండా మరియు నేల బిగుసుకుపోకుండా చూసుకోవడం అవసరం.',
          priority: 'HIGH',
        },
        {
          action: 'రసాయన ఎరువులు వేసే ముందు నేల తేమను మరియు pH పరీక్షించండి',
          reason: 'తేమ లేనప్పుడు ఎరువులు వేస్తే మొక్కల వేర్లు దెబ్బతింటాయి.',
          priority: 'MEDIUM',
        },
        {
          action: 'తెగులు సోకిన ఆకులను తీసివేసి నాశనం చేయండి',
          reason: 'ఇతర ఆరోగ్యకరమైన మొక్కలకు తెగులు వ్యాపించకుండా నివారిస్తుంది.',
          priority: 'HIGH',
        },
      ];
      irrigationAdvice = `${cropData.soilType} నేలలో నీరు నిల్వ ఉండకుండా చూసుకోండి. నేలలో తేమను బట్టి తగినంత నీరు మాత్రమే అందించండి.`;
      nutrientAdvice = `నత్రజని మరియు సూక్ష్మ పోషకాలను తగిన మోతాదులో అందించండి. సిఫార్సు చేసిన మోతాదులోనే ఎరువులు వాడండి.`;
    } else if (language === 'hi') {
      analysis = `${cropData.crop} फसल अभी ${cropData.growthStage} अवस्था में है। ${cropData.soilType} मिट्टी में नमी का संतुलन बनाए रखना बहुत जरूरी है। ${problemAnalysis.identifiedProblem} को नियंत्रित करने के लिए तुरंत उचित उपाय करें।`;
      recommendations = [
        {
          action: `${cropData.soilType} मिट्टी में पौधों की जड़ों और नमी की जांच करें`,
          reason: 'जड़ों में सड़न या मिट्टी के अधिक गीले होने की पहचान के लिए।',
          priority: 'HIGH',
        },
        {
          action: 'रासायनिक खाद देने से पहले मिट्टी की नमी की जांच करें',
          reason: 'कम नमी में खाद देने से जड़ों को नुकसान हो सकता है।',
          priority: 'MEDIUM',
        },
        {
          action: 'रोगग्रस्त पत्तियों को तोड़कर खेत से दूर नष्ट करें',
          reason: 'स्वस्थ पौधों में बीमारी को फैलने से रोकने के लिए।',
          priority: 'HIGH',
        },
      ];
      irrigationAdvice = `${cropData.soilType} मिट्टी में पानी जमा न होने दें। आवश्यकतानुसार ही हल्की सिंचाई करें।`;
      nutrientAdvice = `नाइट्रोजन और सूक्ष्म पोषक तत्वों का संतुलित उपयोग करें। जरूरत से ज्यादा उर्वरक न डालें।`;
    } else {
      const isFloweringOrFruiting = ['Flowering', 'Fruiting'].includes(cropData.growthStage);
      const isHeavySoil = ['Black Soil', 'Clay Soil'].includes(cropData.soilType);
      const soilDynamic = isHeavySoil
        ? `${cropData.soilType} holds significant moisture and is prone to waterlogging if drained poorly`
        : `${cropData.soilType} drains rapidly, requiring measured, split irrigation applications`;

      const stageDynamic = isFloweringOrFruiting
        ? `During the ${cropData.growthStage} stage, ${cropData.crop} is acutely sensitive to moisture stress and nutrient drops which can cause premature bloom drop`
        : `During the ${cropData.growthStage} stage, root establishment and foliar development are critical`;

      analysis = `Detailed reasoning for ${cropData.crop}: ${problemAnalysis.identifiedProblem}. ${stageDynamic}. Furthermore, ${soilDynamic}, which directly modulates nutrient bioavailability in ${cropData.location}.`;

      recommendations = [
        {
          action: `Perform physical inspection of lower root zone and rhizosphere in ${cropData.soilType}`,
          reason: 'Verifies whether root browning, compaction, or root rot is driving the symptoms.',
          priority: 'HIGH',
        },
        {
          action: 'Conduct quick soil electrical conductivity (EC) and pH strip test',
          reason: 'Nutrient lockout frequently mimics deficiencies even when fertilizer is present.',
          priority: 'MEDIUM',
        },
        {
          action: 'Sanitize equipment and prune heavily diseased foliage if bacterial/fungal symptoms exist',
          reason: 'Prevents secondary inoculation across healthy neighbouring plants.',
          priority: 'HIGH',
        },
      ];

      irrigationAdvice = isHeavySoil
        ? `In ${cropData.soilType}, avoid standing water. Allow the top 2-3 inches of soil to dry before the next watering cycle to maintain root respiration.`
        : `In ${cropData.soilType}, provide consistent light irrigations, preferably in early mornings via ${cropData.irrigation}. Avoid midday water stress.`;

      nutrientAdvice = isFloweringOrFruiting
        ? `Prioritize balanced potassium (K) and phosphorus (P) with chelated micronutrients (Zinc, Boron). Avoid excess unmeasured Nitrogen which promotes soft tissue vulnerability.`
        : `Apply measured nitrogen in split doses along with organic compost/humic acid to promote balanced vegetative vigor in ${cropData.crop}.`;
    }

    result = {
      analysis,
      recommendations,
      irrigationAdvice,
      nutrientAdvice,
      prescription: fallbackPrescription,
    };
  } else {
    // If Gemini result was missing prescription or empty items, merge with fallbackPrescription
    if (!result.prescription || !Array.isArray(result.prescription.items) || result.prescription.items.length === 0) {
      result.prescription = fallbackPrescription;
    }
  }

  const executionTimeMs = Date.now() - startTime;
  return {
    output: result,
    executionTimeMs,
  };
};
