import Advisory from '../models/Advisory.js';
import AgentLog from '../models/AgentLog.js';
import { orchestrateAdvisory } from '../services/orchestrator.js';

// @desc    Generate a new AI crop advisory via multi-agent orchestration
// @route   POST /api/advisories
// @access  Private
export const createAdvisory = async (req, res, next) => {
  try {
    const cropData = req.body;
    const userId = req.user._id;

    const { advisory, agentLogs } = await orchestrateAdvisory(cropData, userId);

    res.status(201).json({
      success: true,
      message: 'AI Multi-Agent Advisory generated successfully',
      data: {
        advisory,
        agentLogs: agentLogs.map((log) => ({
          agentName: log.agentName,
          task: log.task,
          status: log.status,
          executionTimeMs: log.executionTimeMs,
          output: log.output,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all advisories for the authenticated user
// @route   GET /api/advisories
// @access  Private
export const getAdvisories = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { category, riskLevel, search } = req.query;

    const query = { userId };

    if (category) {
      query.category = category;
    }

    if (riskLevel) {
      query.riskLevel = riskLevel;
    }

    if (search) {
      query.$or = [
        { crop: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } },
      ];
    }

    const advisories = await Advisory.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: advisories.length,
      data: advisories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single advisory by ID (Strict Data Isolation)
// @route   GET /api/advisories/:id
// @access  Private
export const getAdvisoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const advisory = await Advisory.findById(id);

    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found',
      });
    }

    // Strict Data Isolation check
    if (advisory.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own crop advisories.',
      });
    }

    // Fetch related Agent execution logs
    const agentLogs = await AgentLog.find({ advisoryId: advisory._id }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        advisory,
        agentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent execution audit logs for an advisory
// @route   GET /api/advisories/:id/agents
// @access  Private
export const getAdvisoryAgents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const advisory = await Advisory.findById(id);

    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found',
      });
    }

    // Verify user authorization
    if (advisory.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    const agentLogs = await AgentLog.find({ advisoryId: advisory._id }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: agentLogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete advisory and its logs
// @route   DELETE /api/advisories/:id
// @access  Private
export const deleteAdvisory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const advisory = await Advisory.findById(id);

    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Advisory not found',
      });
    }

    if (advisory.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    await Advisory.deleteOne({ _id: id });
    await AgentLog.deleteMany({ advisoryId: id });

    res.json({
      success: true,
      message: 'Advisory and execution logs deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
