import Advisory from '../models/Advisory.js';
import AgentLog from '../models/AgentLog.js';

// @desc    Get dashboard statistics for current user
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalAdvisories, highRiskCount, agentExecutionsCount, recentAdvisories] = await Promise.all([
      Advisory.countDocuments({ userId }),
      Advisory.countDocuments({ userId, riskLevel: { $in: ['HIGH', 'CRITICAL'] } }),
      AgentLog.countDocuments({ userId }),
      Advisory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('crop location riskLevel category createdAt symptoms identifiedProblem finalSummary')
        .lean(),
    ]);

    const recentAdvisory = recentAdvisories[0] || null;

    // Category breakdown aggregation
    const categoryStats = await Advisory.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalAdvisories,
        highRiskCount,
        agentExecutionsCount,
        recentAdvisory,
        recentAdvisories,
        categoryBreakdown: categoryStats.map((item) => ({
          category: item._id,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
