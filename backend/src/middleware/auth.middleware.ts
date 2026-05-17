import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { verifyToken } from '../utils/jwt';
import { HTTP_STATUS } from '../constants';
import { UserRole } from '../types';

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, 'You are not logged in. Please login to get access.')
      );
    }

    const decoded = verifyToken(token);
    
    // Attach user to request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    
    if (!roles.includes(userRole)) {
      return next(
        new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action')
      );
    }

    next();
  };
};
