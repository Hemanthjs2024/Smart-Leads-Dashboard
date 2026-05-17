import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const dashboardRouter = Router();

dashboardRouter.get('/stats', protect, getDashboardStats);

export default dashboardRouter;
