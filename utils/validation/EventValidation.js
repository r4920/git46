/**
 * EventValidation.js
 * @description :: validate each post and put request as per Event model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Event */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  address_line1: joi.string().allow(null).allow(''),
  address_line2: joi.string().allow(null).allow(''),
  address_city: joi.string().allow(null).allow(''),
  address_country: joi.string().allow(null).allow(''),
  address_state: joi.string().allow(null).allow(''),
  address_pincode: joi.string().allow(null).allow(''),
  address_lat: joi.number().integer().allow(0),
  address_lng: joi.number().integer().allow(0),
  startDateTime: joi.date().options({ convert: true }).allow(null).allow(''),
  endDateTime: joi.date().options({ convert: true }).allow(null).allow(''),
  speakers_name: joi.string().allow(null).allow(''),
  speakers_image: joi.string().allow(null).allow(''),
  speakers_email: joi.string().allow(null).allow(''),
  organizer_name: joi.string().allow(null).allow(''),
  organizer_image: joi.string().allow(null).allow(''),
  organizer_email: joi.string().allow(null).allow(''),
  organizer_url: joi.string().allow(null).allow(''),
  image: joi.string().allow(null).allow(''),
  attachments: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean()
}).unknown(true);

/** validation keys and properties of Event for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  address_line1: joi.string().allow(null).allow(''),
  address_line2: joi.string().allow(null).allow(''),
  address_city: joi.string().allow(null).allow(''),
  address_country: joi.string().allow(null).allow(''),
  address_state: joi.string().allow(null).allow(''),
  address_pincode: joi.string().allow(null).allow(''),
  address_lat: joi.number().integer().allow(0),
  address_lng: joi.number().integer().allow(0),
  startDateTime: joi.date().options({ convert: true }).allow(null).allow(''),
  endDateTime: joi.date().options({ convert: true }).allow(null).allow(''),
  speakers_name: joi.string().allow(null).allow(''),
  speakers_image: joi.string().allow(null).allow(''),
  speakers_email: joi.string().allow(null).allow(''),
  organizer_name: joi.string().allow(null).allow(''),
  organizer_image: joi.string().allow(null).allow(''),
  organizer_email: joi.string().allow(null).allow(''),
  organizer_url: joi.string().allow(null).allow(''),
  image: joi.string().allow(null).allow(''),
  attachments: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Event for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_line1: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_line2: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_city: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_country: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_state: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_pincode: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      address_lat: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      address_lng: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      startDateTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      endDateTime: joi.alternatives().try(joi.array().items(),joi.date().options({ convert: true }),joi.object()),
      speakers_name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      speakers_image: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      speakers_email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      organizer_name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      organizer_image: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      organizer_email: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      organizer_url: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      image: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      attachments: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
