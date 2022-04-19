/**
 * MasterValidation.js
 * @description :: validate each post and put request as per Master model
 */

const joi = require('joi');
const {
  options, isCountOnly, include, select 
} = require('./commonFilterValidation');

/** validation keys and properties of Master */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  slug: joi.string().allow(null).allow(''),
  code: joi.string().allow(null).allow(''),
  group: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  sequence: joi.number().integer().allow(0),
  image: joi.string().allow(null).allow(''),
  parentId: joi.number().integer().allow(0),
  parentCode: joi.boolean(),
  isDefault: joi.boolean().default(false),
  isDeleted: joi.boolean().default(false),
  isActive: joi.boolean()
}).unknown(true);

/** validation keys and properties of Master for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  slug: joi.string().allow(null).allow(''),
  code: joi.string().allow(null).allow(''),
  group: joi.string().allow(null).allow(''),
  description: joi.string().allow(null).allow(''),
  sequence: joi.number().integer().allow(0),
  image: joi.string().allow(null).allow(''),
  parentId: joi.number().integer().allow(0),
  parentCode: joi.boolean(),
  isDefault: joi.boolean().default(false),
  isDeleted: joi.boolean().default(false),
  isActive: joi.boolean(),
  id: joi.number().integer()
}).unknown(true);

let keys = ['query', 'where'];
/** validation keys and properties of Master for filter documents from collection */
exports.findFilterKeys = joi.object({
  options: options,
  ...Object.fromEntries(
    keys.map(key => [key, joi.object({
      name: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      slug: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      code: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      group: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      description: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      sequence: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      image: joi.alternatives().try(joi.array().items(),joi.string(),joi.object()),
      parentId: joi.alternatives().try(joi.array().items(),joi.number().integer(),joi.object()),
      parentCode: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDefault: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isDeleted: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      isActive: joi.alternatives().try(joi.array().items(),joi.boolean(),joi.object()),
      id: joi.any()
    }).unknown(true),])
  ),
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select
    
}).unknown(true);
