import mongoose from 'mongoose';

const agentLogSchema = new mongoose.Schema(
  {
    advisoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advisory',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    agentName: {
      type: String,
      required: true,
      enum: ['problem_analyzer', 'crop_reasoning', 'risk_assessment', 'action_planner'],
    },
    task: {
      type: String,
      required: true,
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    errorMessage: {
      type: String,
      default: null,
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

agentLogSchema.index({ advisoryId: 1, createdAt: 1 });
agentLogSchema.index({ userId: 1, createdAt: -1 });

const AgentLog = mongoose.model('AgentLog', agentLogSchema);
export default AgentLog;
