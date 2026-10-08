import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Advisory from '../models/Advisory.js';
import AgentLog from '../models/AgentLog.js';

dotenv.config();

const seed = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ SEEDING ABORTED: Cannot run seed script in production environment!');
    process.exit(1);
  }

  console.log('🌱 Starting AgroMind AI Demo Data Seeder...');
  await connectDB();

  // Clear existing collections
  await User.deleteMany({ email: 'farmer@agromind.ai' });
  console.log('🧹 Cleaned existing demo user data.');

  // Create demo user
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  const demoUser = await User.create({
    name: 'Ramesh Patel',
    email: 'farmer@agromind.ai',
    passwordHash,
    role: 'farmer',
  });
  console.log(`👤 Created Demo User: ${demoUser.email} (Password: Password123!)`);

  // Advisory 1: Rice with Nitrogen deficiency / Leaf streak
  const adv1Id = new mongoose.Types.ObjectId();
  const advisory1 = await Advisory.create({
    _id: adv1Id,
    userId: demoUser._id,
    crop: 'Rice',
    location: 'Telangana',
    soilType: 'Black Soil',
    growthStage: 'Vegetative',
    symptoms: 'Older leaves are turning pale yellow starting from leaf tips backwards into V-shapes. Stunted tillering.',
    irrigation: 'Flood/Furrow',
    weather: 'Sunny and humid (33°C), moderate breeze',
    additionalInformation: 'Last basal fertilizer was applied 22 days ago.',
    category: 'Nutrient Management',
    problemAnalysis: {
      identifiedProblem: 'Acute Nitrogen (N) deficiency in vegetative stage rice',
      possibleCauses: [
        'Nitrogen leaching and volatilization in flooded black soil',
        'Inadequate split application timing',
        'Root zone compaction impeding nutrient mobility',
      ],
      keySymptoms: ['V-shaped chlorosis on older leaves', 'Reduced tillering count'],
      confidence: 0.88,
      missingInformation: ['Recent leaf color chart (LCC) index score', 'Submergence depth of flood water'],
    },
    cropReasoning: {
      analysis: 'Vegetative paddy in heavy black soil requires active nitrogen uptake for tillering. In standing flood waters, nitrogen often undergoes denitrification if urea isn’t incorporated.',
      recommendations: [
        {
          action: 'Apply top-dressing of neem-coated urea calibrated via Leaf Color Chart (LCC)',
          reason: 'Corrects nitrogen deficit and revitalizes active vegetative tiller formation.',
          priority: 'HIGH',
        },
        {
          action: 'Drain standing water to a thin 2cm film before fertilizer application',
          reason: 'Prevents surface runoff and enhances root zone absorption.',
          priority: 'MEDIUM',
        },
      ],
      irrigationAdvice: 'Maintain intermittent shallow submergence (2-3 cm) during the tillering stage; avoid deep ponding above 5 cm.',
      nutrientAdvice: 'Split nitrogen application: 50% basal, 25% active tillering, 25% panicle initiation. Supplement with zinc sulfate (25 kg/ha) if black soil has alkaline pH.',
    },
    riskAssessment: {
      riskLevel: 'MEDIUM',
      severity: 'Moderate',
      urgency: 'Within 24-48 hours',
      riskReason: 'Delayed nitrogen supplementation during active tillering will irreversibly reduce effective panicle numbers.',
      riskFactors: ['High tillering sensitivity window', 'Nutrient leaching in standing flood conditions'],
      expertConsultationRecommended: false,
    },
    actionPlan: {
      immediate: ['Perform Leaf Color Chart (LCC) scoring across 10 random hills'],
      today: ['Drain standing floodwater down to 2cm moist saturation'],
      next3Days: ['Broadcast calibrated neem-coated urea mixed with dry sand in early morning'],
      next7Days: ['Re-flood field to 3cm and observe leaf greening recovery'],
      preventive: ['Adopt customized split dosage fertilizer calendars and deep placement of urea briquettes'],
    },
    recommendations: [
      {
        action: 'Apply top-dressing of neem-coated urea calibrated via Leaf Color Chart (LCC)',
        reason: 'Corrects nitrogen deficit and revitalizes active vegetative tiller formation.',
        priority: 'HIGH',
      },
    ],
    irrigationAdvice: 'Maintain intermittent shallow submergence (2-3 cm) during the tillering stage; avoid deep ponding above 5 cm.',
    nutrientAdvice: 'Split nitrogen application: 50% basal, 25% active tillering, 25% panicle initiation.',
    riskLevel: 'MEDIUM',
    riskReason: 'Delayed nitrogen supplementation during active tillering will irreversibly reduce effective panicle numbers.',
    urgency: 'Within 24-48 hours',
    finalSummary: 'Advisory synthesized: Vegetative rice exhibits clear nitrogen deficiency symptoms in black soil. Controlled draining followed by neem-coated urea application within 48 hours will restore photosynthetic efficiency.',
  });

  // Seed Agent Logs for Advisory 1
  await AgentLog.insertMany([
    {
      advisoryId: adv1Id,
      userId: demoUser._id,
      agentName: 'problem_analyzer',
      task: 'Understand crop symptoms, possible causes, categorize and assign confidence',
      input: { crop: 'Rice', symptoms: advisory1.symptoms },
      output: advisory1.problemAnalysis,
      status: 'success',
      executionTimeMs: 412,
    },
    {
      advisoryId: adv1Id,
      userId: demoUser._id,
      agentName: 'crop_reasoning',
      task: 'Analyze soil, stage, nutrient dynamics and generate recommendations',
      input: { crop: 'Rice', problem: advisory1.problemAnalysis.identifiedProblem },
      output: advisory1.cropReasoning,
      status: 'success',
      executionTimeMs: 520,
    },
    {
      advisoryId: adv1Id,
      userId: demoUser._id,
      agentName: 'risk_assessment',
      task: 'Evaluate severity, urgency, risk factors and expert consultation threshold',
      input: { crop: 'Rice', reasoning: advisory1.cropReasoning.analysis },
      output: advisory1.riskAssessment,
      status: 'success',
      executionTimeMs: 388,
    },
    {
      advisoryId: adv1Id,
      userId: demoUser._id,
      agentName: 'action_planner',
      task: 'Generate prioritized chronological action roadmap and final synthesis',
      input: { crop: 'Rice', risk: advisory1.riskAssessment.riskLevel },
      output: advisory1.actionPlan,
      status: 'success',
      executionTimeMs: 460,
    },
  ]);

  // Advisory 2: Cotton with Pink Bollworm / Foliar Lesions (HIGH Risk)
  const adv2Id = new mongoose.Types.ObjectId();
  const advisory2 = await Advisory.create({
    _id: adv2Id,
    userId: demoUser._id,
    crop: 'Cotton',
    location: 'Maharashtra',
    soilType: 'Red Soil',
    growthStage: 'Flowering',
    symptoms: 'Rosette flower formation, boreholes observed at base of green bolls, flower shedding.',
    irrigation: 'Drip',
    weather: 'Hot and dry, 35°C',
    additionalInformation: 'Nearby farms also reporting pest activity in squares and blooms.',
    category: 'Pest/Disease Risk',
    problemAnalysis: {
      identifiedProblem: 'Early Pink Bollworm (Pectinophora gossypiella) infestation during flowering',
      possibleCauses: [
        'Larval entry into squaring blooms and young squares',
        'Emergence of overwintering generation matching peak flowering',
      ],
      keySymptoms: ['Rosette flower appearance', 'Floral bud shedding', 'Visible entry hole at boll base'],
      confidence: 0.91,
      missingInformation: ['Pheromone trap daily moth catch count', 'Percentage of sampled bolls with larval exit holes'],
    },
    cropReasoning: {
      analysis: 'During flowering in cotton, pink bollworm larvae enter flower buds causing characteristic rosette blossoms (twisted petals) followed by premature fruit drop.',
      recommendations: [
        {
          action: 'Install Delta pheromone traps with Gossyplure at 5 traps per acre immediately',
          reason: 'Monitors adult male moth population to evaluate economic threshold (ETL).',
          priority: 'CRITICAL',
        },
        {
          action: 'Manually collect and destroy rosette flowers to eradicate inner larvae',
          reason: 'Breaks the initial life-cycle wave before second generation attacks developing bolls.',
          priority: 'HIGH',
        },
        {
          action: 'Spray biological formulation (Bt / Bacillus thuringiensis) or Neem-based Azadirachtin 1500 ppm',
          reason: 'Safeguards natural predators while repelling ovicidal laying.',
          priority: 'HIGH',
        },
      ],
      irrigationAdvice: 'Maintain regular drip irrigation cycles to prevent water stress, which exacerbates square shedding.',
      nutrientAdvice: 'Avoid excessive nitrogenous top dressings that create succulent dense canopy favored by bollworms.',
    },
    riskAssessment: {
      riskLevel: 'HIGH',
      severity: 'Severe',
      urgency: 'Within 24 hours',
      riskReason: 'Cotton in flowering stage cannot recover shed squares. Unchecked pink bollworm causes direct fiber staining and up to 40% boll destruction.',
      riskFactors: ['Critical flowering window', 'Neighborhood pest pressure', 'Rapid generational cycle'],
      expertConsultationRecommended: true,
    },
    actionPlan: {
      immediate: ['Scout 20 plants across field diagonals; count percentage of rosette flowers'],
      today: ['Erect 5 pheromone traps with Gossyplure lures at canopy height'],
      next3Days: ['Inspect traps daily; if catches exceed 8 moths/trap/night for 3 consecutive days, prepare targeted intervention'],
      next7Days: ['Apply biological spray (Azadirachtin 1500ppm @ 5ml/L) during late evening'],
      preventive: ['Refrain from late-season ratoon cotton and practice clean post-harvest shredding'],
    },
    recommendations: [
      {
        action: 'Install Delta pheromone traps with Gossyplure at 5 traps per acre immediately',
        reason: 'Monitors adult male moth population to evaluate economic threshold (ETL).',
        priority: 'CRITICAL',
      },
    ],
    irrigationAdvice: 'Maintain regular drip irrigation cycles to prevent water stress.',
    nutrientAdvice: 'Avoid excessive nitrogenous top dressings.',
    riskLevel: 'HIGH',
    riskReason: 'Cotton in flowering stage cannot recover shed squares. Direct fiber staining and up to 40% boll destruction.',
    urgency: 'Within 24 hours',
    finalSummary: 'High-risk bollworm infestation detected in flowering cotton. Immediate installation of pheromone traps and mechanical destruction of rosette flowers is essential to safeguard boll set.',
  });

  await AgentLog.insertMany([
    {
      advisoryId: adv2Id,
      userId: demoUser._id,
      agentName: 'problem_analyzer',
      task: 'Understand crop symptoms, possible causes, categorize and assign confidence',
      input: { crop: 'Cotton', symptoms: advisory2.symptoms },
      output: advisory2.problemAnalysis,
      status: 'success',
      executionTimeMs: 440,
    },
    {
      advisoryId: adv2Id,
      userId: demoUser._id,
      agentName: 'crop_reasoning',
      task: 'Analyze soil, stage, nutrient dynamics and generate recommendations',
      input: { crop: 'Cotton', problem: advisory2.problemAnalysis.identifiedProblem },
      output: advisory2.cropReasoning,
      status: 'success',
      executionTimeMs: 510,
    },
    {
      advisoryId: adv2Id,
      userId: demoUser._id,
      agentName: 'risk_assessment',
      task: 'Evaluate severity, urgency, risk factors and expert consultation threshold',
      input: { crop: 'Cotton', reasoning: advisory2.cropReasoning.analysis },
      output: advisory2.riskAssessment,
      status: 'success',
      executionTimeMs: 405,
    },
    {
      advisoryId: adv2Id,
      userId: demoUser._id,
      agentName: 'action_planner',
      task: 'Generate prioritized chronological action roadmap and final synthesis',
      input: { crop: 'Cotton', risk: advisory2.riskAssessment.riskLevel },
      output: advisory2.actionPlan,
      status: 'success',
      executionTimeMs: 480,
    },
  ]);

  console.log(`✅ Seed completed successfully! Created 2 full multi-agent advisories and 8 agent execution logs for ${demoUser.email}.`);
  await disconnectDB();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
