import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { signToken } from '../utils/jwt';
import { HTTP_STATUS } from '../constants';
import crypto from 'crypto';
import { sendEmail } from '../utils/email';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists'));
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse('Registration successful', { user: userResponse, token })
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide email and password'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password'));
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Login successful', { user: userResponse, token })
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById((req as any).user.userId);
    
    if (!user) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found'));
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('User profile fetched', { user: userResponse })
    );
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide current and new passwords'));
    }

    const user = await User.findById((req as any).user.userId).select('+password');
    
    if (!user) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found'));
    }

    if (!(await user.comparePassword(currentPassword))) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid current password'));
    }

    user.password = newPassword;
    await user.save();

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Password changed successfully', null)
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide an email address'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // For security, don't reveal if user exists or not
      return res.status(HTTP_STATUS.OK).json(
        new ApiResponse('If a user with that email exists, a reset link has been sent.', null)
      );
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expiry (1 hour)
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a POST request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(HTTP_STATUS.OK).json(
        new ApiResponse('Password reset link sent to email', null)
      );
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return next(new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Email could not be sent'));
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please provide a new password'));
    }

    // Hash the token from the URL to compare with hashed token in DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token as string)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token'));
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Password reset successful. You can now log in.', null)
    );
  } catch (error) {
    next(error);
  }
};
