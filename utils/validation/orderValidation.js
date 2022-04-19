/**
 * orderValidation.js
 * @description :: validate each post and put request as per order model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of order */
exports.schemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  patientId: joi.number().integer().allow(0),
  status: joi.string().allow(null).allow(''),
  orderBy: joi.number().integer().allow(0),
  note: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDeleted: joi.boolean().default(false)
}).unknown(true);

/** validation keys and properties of order for updation */
exports.updateSchemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  patientId: joi.number().integer().allow(0),
  status: joi.string().allow(null).allow(''),
  orderBy: joi.number().integer().allow(0),
  note: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true),
  isDeleted: joi.boolean().default(false),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of order for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      orderId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      patientId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      status: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      orderBy: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      note: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
