/**
 * noteValidation.js
 * @description :: validate each post and put request as per note model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of note */
exports.schemaKeys = joi.object({
  _id: joi.string().allow(null).allow(''),
  encounterId: joi.number().integer().allow(0),
  provider: joi.number().integer().allow(0),
  text: joi.string().required().case('lower'),
  isActive: joi.boolean().default(true),
  isDeleted: joi.boolean().default(true)
}).unknown(true);

/** validation keys and properties of note for updation */
exports.updateSchemaKeys = joi.object({
  _id: joi.string().allow(null).allow(''),
  encounterId: joi.number().integer().allow(0),
  provider: joi.number().integer().allow(0),
  text: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }).case('lower'),
  isActive: joi.boolean().default(true),
  isDeleted: joi.boolean().default(true),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of note for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      _id: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      encounterId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      provider: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      text: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
