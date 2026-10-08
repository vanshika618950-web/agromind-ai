import Advisory from '../models/Advisory.js';
import AgentLog from '../models/AgentLog.js';
import { runProblemAnalyzer } from './agents/problemAnalyzer.js';
import { runCropReasoning } from './agents/cropReasoning.js';
import { runRiskAssessment } from './agents/riskAssessment.js';
import { runActionPlanner } from './agents/actionPlanner.js';
import mongoose from 'mongoose';

export const orchestrateAdvisory = async (cropData, userId) => {
  const temporaryAdvisoryId = new mongoose.Types.ObjectId();
  const agentLogs = [];

  try {
    // Stage 1: Problem Analyzer Agent
    console.log('[Orchestrator] Executing Agent 1: Problem Analyzer...');
    const stage1Result = await runProblemAnalyzer(cropData);
    agentLogs.push({
      advisoryId: temporaryAdvisoryId,
      userId,
      agentName: 'problem_analyzer',
      task: 'Understand crop symptoms, possible causes, categorize and assign confidence',
      input: cropData,
      output: stage1Result.output,
      status: 'success',
      executionTimeMs: stage1Result.executionTimeMs,
    });
    const problemAnalysis = stage1Result.output;

    // Stage 2: Crop Reasoning Agent
    console.log('[Orchestrator] Executing Agent 2: Crop Reasoning...');
    const stage2Result = await runCropReasoning(cropData, problemAnalysis);
    agentLogs.push({
      advisoryId: temporaryAdvisoryId,
      userId,
      agentName: 'crop_reasoning',
      task: 'Analyze soil, stage, nutrient dynamics and generate recommendations',
      input: { cropData, problemAnalysis },
      output: stage2Result.output,
      status: 'success',
      executionTimeMs: stage2Result.executionTimeMs,
    });
    const cropReasoning = stage2Result.output;

    // Stage 3: Risk Assessment Agent
    console.log('[Orchestrator] Executing Agent 3: Risk Assessment...');
    const stage3Result = await runRiskAssessment(cropData, problemAnalysis, cropReasoning);
    agentLogs.push({
      advisoryId: temporaryAdvisoryId,
      userId,
      agentName: 'risk_assessment',
      task: 'Evaluate severity, urgency, risk factors and expert consultation threshold',
      input: { cropData, problemAnalysis, cropReasoning },
      output: stage3Result.output,
      status: 'success',
      executionTimeMs: stage3Result.executionTimeMs,
    });
    const riskAssessment = stage3Result.output;

    // Stage 4: Action Planner Agent
    console.log('[Orchestrator] Executing Agent 4: Action Planner...');
    const stage4Result = await runActionPlanner(cropData, problemAnalysis, cropReasoning, riskAssessment);
    agentLogs.push({
      advisoryId: temporaryAdvisoryId,
      userId,
      agentName: 'action_planner',
      task: 'Generate prioritized chronological action roadmap and final synthesis',
      input: { cropData, problemAnalysis, cropReasoning, riskAssessment },
      output: stage4Result.output,
      status: 'success',
      executionTimeMs: stage4Result.executionTimeMs,
    });
    const actionPlan = stage4Result.output;

    // Create & Save the Final Consolidated Advisory Document
    const advisory = new Advisory({
      _id: temporaryAdvisoryId,
      userId,
      crop: cropData.crop,
      location: cropData.location,
      soilType: cropData.soilType,
      growthStage: cropData.growthStage,
      symptoms: cropData.symptoms,
      irrigation: cropData.irrigation,
      weather: cropData.weather || '',
      additionalInformation: cropData.additionalInformation || '',

      category: problemAnalysis.category || 'Crop Health',
      problemAnalysis: {
        identifiedProblem: problemAnalysis.identifiedProblem || '',
        possibleCauses: problemAnalysis.possibleCauses || [],
        keySymptoms: problemAnalysis.keySymptoms || [],
        confidence: problemAnalysis.confidence || 0.8,
        missingInformation: problemAnalysis.missingInformation || [],
      },
      cropReasoning: {
        analysis: cropReasoning.analysis || '',
        recommendations: cropReasoning.recommendations || [],
        irrigationAdvice: cropReasoning.irrigationAdvice || '',
        nutrientAdvice: cropReasoning.nutrientAdvice || '',
      },
      riskAssessment: {
        riskLevel: riskAssessment.riskLevel || 'MEDIUM',
        severity: riskAssessment.severity || 'Moderate',
        urgency: riskAssessment.urgency || 'Within 24-48 hours',
        riskReason: riskAssessment.riskReason || '',
        riskFactors: riskAssessment.riskFactors || [],
        expertConsultationRecommended: Boolean(riskAssessment.expertConsultationRecommended),
      },
      actionPlan: {
        immediate: actionPlan.immediate || [],
        today: actionPlan.today || [],
        next3Days: actionPlan.next3Days || [],
        next7Days: actionPlan.next7Days || [],
        preventive: actionPlan.preventive || [],
      },

      recommendations: cropReasoning.recommendations || [],
      irrigationAdvice: cropReasoning.irrigationAdvice || '',
      nutrientAdvice: cropReasoning.nutrientAdvice || '',
      riskLevel: riskAssessment.riskLevel || 'MEDIUM',
      riskReason: riskAssessment.riskReason || '',
      urgency: riskAssessment.urgency || 'Within 24-48 hours',
      finalSummary: actionPlan.finalSummary || 'Advisory synthesized successfully.',
    });

    await advisory.save();

    // Persist all agent logs into MongoDB
    await AgentLog.insertMany(agentLogs);
    console.log(`[Orchestrator] Successfully saved Advisory ${advisory._id} and 4 Agent logs.`);

    return {
      advisory,
      agentLogs,
    };
  } catch (error) {
    console.error('[Orchestrator] Orchestration error:', error.message);
    // Persist failed state if possible
    if (agentLogs.length > 0) {
      try {
        await AgentLog.insertMany(agentLogs);
      } catch (logErr) {
        console.error('Failed to save partial agent logs:', logErr.message);
      }
    }
    throw new Error(`Agent orchestration failed: ${error.message}`);
  }
};
