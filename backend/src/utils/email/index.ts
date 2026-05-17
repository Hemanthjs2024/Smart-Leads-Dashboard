import { logger } from '../logger';

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  // In a real application, you would use nodemailer or a service like SendGrid
  logger.info('--- EMAIL MOCK ---');
  logger.info(`To: ${options.email}`);
  logger.info(`Subject: ${options.subject}`);
  logger.info(`Message: ${options.message}`);
  logger.info('------------------');
};
