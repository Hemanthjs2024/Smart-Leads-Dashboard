import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { HTTP_STATUS } from '../constants';
import { jsonToCsv } from '../utils/csv';

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;
    const userId = (req as any).user.userId;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: userId,
    });

    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse('Lead created successfully', lead)
    );
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      status, 
      source,
      sort = '-createdAt'
    } = req.query;

    const query: any = {};

    // Search logic (Name or Email)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter logic
    if (status) query.status = status;
    if (source) query.source = source;

    const skip = (Number(page) - 1) * Number(limit);

    const totalLeads = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('createdBy', 'name email')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit));

    const totalPages = Math.ceil(totalLeads / Number(limit));

    const response = new ApiResponse('Leads fetched successfully', leads);
    response.pagination = {
      total: totalLeads,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1,
    };

    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!lead) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Lead not found'));
    }

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Lead fetched successfully', lead)
    );
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Lead not found'));
    }

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Lead updated successfully', lead)
    );
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, 'Lead not found'));
    }

    const user = (req as any).user;
    if (user.role !== 'Admin' && lead.createdBy.toString() !== user.userId) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to delete this lead'));
    }

    await lead.deleteOne();

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse('Lead deleted successfully', null)
    );
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return next(new ApiError(HTTP_STATUS.BAD_REQUEST, 'No lead IDs provided'));
    }

    const user = (req as any).user;
    if (user.role !== 'Admin') {
      const leads = await Lead.find({ _id: { $in: ids } });
      const unauthorizedLeads = leads.filter(
        (lead) => lead.createdBy.toString() !== user.userId
      );

      if (unauthorizedLeads.length > 0) {
        return next(
          new ApiError(
            HTTP_STATUS.FORBIDDEN,
            'You do not have permission to delete one or more of the selected leads'
          )
        );
      }
    }

    await Lead.deleteMany({ _id: { $in: ids } });

    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(`Successfully deleted ${ids.length} leads`, null)
    );
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search = '', status, source, sort = '-createdAt' } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (source) query.source = source;

    const leads = await Lead.find(query)
      .populate('createdBy', 'name')
      .sort(sort as string);

    // Format data for CSV
    const csvData = leads.map((lead: any) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      'Created At': new Date(lead.createdAt).toLocaleString(),
      'Created By': lead.createdBy?.name || 'Unknown',
    }));

    const csv = jsonToCsv(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(HTTP_STATUS.OK).send(csv);
  } catch (error) {
    next(error);
  }
};
