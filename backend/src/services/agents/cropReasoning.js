import geminiService from '../geminiService.js';

export const runCropReasoning = async (cropData, problemAnalysis) => {
  const startTime = Date.now();

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

Task:
1. Provide an in-depth agronomic analysis contextualized to ${cropData.crop} in ${cropData.soilType} soil during the ${cropData.growthStage} phase.
2. Provide 2-4 structured recommendations with "action", "reason", and "priority" (LOW, MEDIUM, HIGH, CRITICAL).
3. Provide tailored irrigation guidance specific to ${cropData.crop} and ${cropData.soilType}.
4. Provide tailored nutrient and fertilizer guidance suitable for this crop and stage.`;

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
  "nutrientAdvice": "Specific nutrient and soil amendment advice..."
}`;

  let result = await geminiService.generateStructuredResponse(prompt, schema);

  if (!result) {
    // Agronomic Rule-based Expert Engine
    const isFloweringOrFruiting = ['Flowering', 'Fruiting'].includes(cropData.growthStage);
    const isHeavySoil = ['Black Soil', 'Clay Soil'].includes(cropData.soilType);

    const soilDynamic = isHeavySoil
      ? `${cropData.soilType} holds significant moisture and is prone to waterlogging if drained poorly`
      : `${cropData.soilType} drains rapidly, requiring measured, split irrigation applications`;

    const stageDynamic = isFloweringOrFruiting
      ? `During the ${cropData.growthStage} stage, ${cropData.crop} is acutely sensitive to moisture stress and nutrient drops which can cause premature bloom drop`
      : `During the ${cropData.growthStage} stage, root establishment and foliar development are critical`;

    const analysis = `Detailed reasoning for ${cropData.crop}: ${problemAnalysis.identifiedProblem}. ${stageDynamic}. Furthermore, ${soilDynamic}, which directly modulates nutrient bioavailability in ${cropData.location}.`;

    const recommendations = [
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

    const irrigationAdvice = isHeavySoil
      ? `In ${cropData.soilType}, avoid standing water. Allow the top 2-3 inches of soil to dry before the next watering cycle to maintain root respiration.`
      : `In ${cropData.soilType}, provide consistent light irrigations, preferably in early mornings via ${cropData.irrigation}. Avoid midday water stress.`;

    const nutrientAdvice = isFloweringOrFruiting
      ? `Prioritize balanced potassium (K) and phosphorus (P) with chelated micronutrients (Zinc, Boron). Avoid excess unmeasured Nitrogen which promotes soft tissue vulnerability.`
      : `Apply measured nitrogen in split doses along with organic compost/humic acid to promote balanced vegetative vigor in ${cropData.crop}.`;

    result = {
      analysis,
      recommendations,
      irrigationAdvice,
      nutrientAdvice,
    };
  }

  const executionTimeMs = Date.now() - startTime;
  return {
    output: result,
    executionTimeMs,
  };
};
