import { Router } from 'express';
import healthRouter from './health.route';
import authRouter from './auth.route';
import leadRouter from './lead.route';
import dashboardRouter from './dashboard.route';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/leads', leadRouter);
apiRouter.use('/dashboard', dashboardRouter);

export default apiRouter;
