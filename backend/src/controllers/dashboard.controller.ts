import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead.model';
import { ApiResponse } from '../utils/ApiResponse';
import { HTTP_STATUS } from '../constants';

export const getDashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Total Leads
    const totalLeads = await Lead.countDocuments();

    // 2. Counts by Status
    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // 3. Counts by Source
    const sourceCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
    ]);

    // 4. Recent Leads (last 5)
    const recentLeads = await Lead.find()
      .sort('-createdAt')
      .limit(5)
      .populate('createdBy', 'name email');

    // Format stats for frontend
    const stats = {
      totalLeads,
      statusBreakdown: statusCounts.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      sourceBreakdown: sourceCounts.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentLeads,
    };

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Dashboard statistics fetched successfully', stats)
    );
  } catch (error) {
    next(error);
  }
};
