import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.json(new ApiResponse('Server is running', { status: 'OK', timestamp: new Date().toISOString() }));
});

export default healthRouter;
