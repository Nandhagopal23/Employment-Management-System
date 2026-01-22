const Joi = require('joi');

const createEmployeeSchema = Joi.object({
    first_name: Joi.string().required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    last_name: Joi.string().required().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'any.required': 'Email is required'
    }),
    phone: Joi.string().allow('', null).optional(),
    designation: Joi.string().allow('', null).optional(),
    salary: Joi.number().min(0).optional().messages({
        'number.base': 'Salary must be a number',
        'number.min': 'Salary cannot be negative'
    }),
    department_id: Joi.number().integer().required().messages({
        'number.base': 'Department ID must be a number',
        'any.required': 'Department is required'
    }),
    status: Joi.string().valid('Active', 'Inactive', 'OnLeave').default('Active'),
    // Allow extra fields if necessary, or strip them
}).unknown(true); // To allow other fields if frontend sends extra stuff, or use .unknown(false) for strictness

const updateEmployeeSchema = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().allow('', null).optional(),
    designation: Joi.string().allow('', null).optional(),
    salary: Joi.number().min(0).optional(),
    department_id: Joi.number().integer().optional(),
    status: Joi.string().valid('Active', 'Inactive', 'OnLeave').optional(),
}).unknown(true);

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema
};
