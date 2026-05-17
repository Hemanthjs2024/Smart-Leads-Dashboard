import { Router } from 'express';
import { 
  createLead, 
  getAllLeads, 
  getLeadById, 
  updateLead, 
  deleteLead,
  bulkDeleteLeads,
  exportLeads
} from '../controllers/lead.controller';
import { createLeadValidation, updateLeadValidation } from '../validations/lead.validation';
import { protect, restrictTo } from '../middleware/auth.middleware';

const leadRouter = Router();

// All lead routes are protected
leadRouter.use(protect);

leadRouter.get('/export', exportLeads);

leadRouter.route('/')
  .get(getAllLeads)
  .post(createLeadValidation, createLead);

leadRouter.post('/bulk-delete', restrictTo('Admin', 'Sales User'), bulkDeleteLeads);

leadRouter.route('/:id')
  .get(getLeadById)
  .patch(updateLeadValidation, updateLead)
  .delete(restrictTo('Admin', 'Sales User'), deleteLead);

export default leadRouter;
