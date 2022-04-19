/**
 * orderItemValidation.js
 * @description :: validate each post and put request as per orderItem model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of orderItem */
exports.schemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  item: joi.string().allow(null).allow(''),
  uom: joi.string().allow(null).allow(''),
  qty: joi.number().integer().allow(0),
  isActive: joi.boolean().default(true),
  isDeleted: joi.boolean().default(false)
}).unknown(true);

/** validation keys and properties of orderItem for updation */
exports.updateSchemaKeys = joi.object({
  orderId: joi.string().allow(null).allow(''),
  item: joi.string().allow(null).allow(''),
  uom: joi.string().allow(null).allow(''),
  qty: joi.number().integer().allow(0),
  isActive: joi.boolean().default(true),
  isDeleted: joi.boolean().default(false),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of orderItem for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      orderId: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      item: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      uom: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      qty: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
