import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    reason: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
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
      required: true,
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
