/**
 * ToDoValidation.js
 * @description :: validate each post and put request as per ToDo model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of ToDo */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  date: joi.date().options({ convert: true }).allow(null).allow(''),
  dueDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isCompleted: joi.boolean(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of ToDo for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  date: joi.date().options({ convert: true }).allow(null).allow(''),
  dueDate: joi.date().options({ convert: true }).allow(null).allow(''),
  isCompleted: joi.boolean(),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of ToDo for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      date: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      dueDate: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      isCompleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
