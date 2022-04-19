/**
 * Appointment_slotValidation.js
 * @description :: validate each post and put request as per Appointment_slot model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Appointment_slot */
exports.schemaKeys = joi.object({
  startTime: joi.date().options({ convert: true }).allow(null).allow(''),
  endTime: joi.date().options({ convert: true }).allow(null).allow(''),
  offset: joi.number().integer().allow(0),
  appliedFrom: joi.date().options({ convert: true }).allow(null).allow(''),
  appliedTo: joi.date().options({ convert: true }).allow(null).allow(''),
  userId: joi.number().integer().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Appointment_slot for updation */
exports.updateSchemaKeys = joi.object({
  startTime: joi.date().options({ convert: true }).allow(null).allow(''),
  endTime: joi.date().options({ convert: true }).allow(null).allow(''),
  offset: joi.number().integer().allow(0),
  appliedFrom: joi.date().options({ convert: true }).allow(null).allow(''),
  appliedTo: joi.date().options({ convert: true }).allow(null).allow(''),
  userId: joi.number().integer().allow(0),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Appointment_slot for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      startTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      endTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      offset: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      appliedFrom: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      appliedTo: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      userId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
