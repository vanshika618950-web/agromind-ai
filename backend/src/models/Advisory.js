import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    reason: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  },
  { _id: false }
);

const prescriptionItemSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true },
    category: {
      type: String,
      default: 'Curative Treatment',
    },
    activeIngredient: { type: String, default: '' },
    dosage: { type: String, required: true },
    applicationMethod: { type: String, default: 'Foliar Spray' },
    timing: { type: String, default: 'Early morning (6:30 - 9:00 AM) or late afternoon' },
    waitingPeriod: { type: String, default: '7 days (Pre-Harvest Interval)' },
    targetPathogen: { type: String, default: '' },
    safetyPrecautions: { type: String, default: 'Wear mask and protective gloves during application.' },
    organicAlternative: { type: String, default: '' },
  },
  { _id: false }
);

const advisorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    soilType: {
      type: String,
      required: true,
      trim: true,
    },
    growthStage: {
      type: String,
      required: true,
      trim: true,
    },
    symptoms: {
      type: String,
      default: 'General crop health inspection and seasonal advisory',
      trim: true,
    },
    irrigation: {
      type: String,
      required: true,
      trim: true,
    },
    weather: {
      type: String,
      default: '',
      trim: true,
    },
    additionalInformation: {
      type: String,
      default: '',
      trim: true,
    },
    language: {
      type: String,
      enum: ['en', 'te', 'hi'],
      default: 'en',
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Crop Health',
        'Nutrient Management',
        'Irrigation',
        'Soil Management',
        'Pest/Disease Risk',
        'Weather/Environmental Stress',
        'General Crop Management',
      ],
      default: 'Crop Health',
    },

    problemAnalysis: {
      identifiedProblem: { type: String, default: '' },
      possibleCauses: [{ type: String }],
      keySymptoms: [{ type: String }],
      confidence: { type: Number, default: 0.8 },
      missingInformation: [{ type: String }],
    },

    cropReasoning: {
      analysis: { type: String, default: '' },
      recommendations: [recommendationSchema],
      irrigationAdvice: { type: String, default: '' },
      nutrientAdvice: { type: String, default: '' },
    },

    riskAssessment: {
      riskLevel: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'MEDIUM',
      },
      severity: { type: String, default: 'Moderate' },
      urgency: { type: String, default: 'Within 24-48 hours' },
      riskReason: { type: String, default: '' },
      riskFactors: [{ type: String }],
      expertConsultationRecommended: { type: Boolean, default: false },
    },

    actionPlan: {
      immediate: [{ type: String }],
      today: [{ type: String }],
      next3Days: [{ type: String }],
      next7Days: [{ type: String }],
      preventive: [{ type: String }],
    },

    recommendations: [recommendationSchema],
    irrigationAdvice: { type: String, default: '' },
    nutrientAdvice: { type: String, default: '' },

    prescription: {
      diagnosis: { type: String, default: '' },
      items: [prescriptionItemSchema],
      applicationWindow: { type: String, default: 'Spray during calm early morning (6:30 - 9:00 AM) or late afternoon. Avoid spraying in intense afternoon sun or rainy conditions.' },
      tankMixCompatibility: { type: String, default: 'Do not combine biological agents (Trichoderma/Pseudomonas) in the same tank with chemical fungicides. Always conduct a small jar test before mixing foliar fertilizers with crop protection chemicals.' },
      safetyNotice: { type: String, default: 'Always wear protective mask and gloves. Keep children and domestic animals away from spray area for 24 hours. Wash spray equipment thoroughly.' },
    },

    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    riskReason: { type: String, default: '' },
    urgency: { type: String, default: 'Within 24-48 hours' },

    finalSummary: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

advisorySchema.index({ userId: 1, createdAt: -1 });

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;
