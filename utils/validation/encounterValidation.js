/**
 * encounterValidation.js
 * @description :: validate each post and put request as per encounter model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of encounter */
exports.schemaKeys = joi.object({
  name: joi.string().required().case('lower'),
  date: joi.date().options({ convert: true }).allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  patientId: joi.number().integer().allow(0),
  isDeleted: joi.boolean().default(false),
  isActive: joi.boolean().default(true)
}).unknown(true);

/** validation keys and properties of encounter for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().when({
    is:joi.exist(),
    then:joi.required(),
    otherwise:joi.optional()
  }).case('lower'),
  date: joi.date().options({ convert: true }).allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  patientId: joi.number().integer().allow(0),
  isDeleted: joi.boolean().default(false),
  isActive: joi.boolean().default(true),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of encounter for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      date: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      patientId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
