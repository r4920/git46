/**
 * EventController.js
 * @description :: exports action methods for Event.
 */

const { Op } = require('sequelize');
const Event = require('../../../model/Event');
const EventSchemaKey = require('../../../utils/validation/EventValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Event in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Event. {status, message, data}
 */ 
const addEvent = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      EventSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdEvent = await dbService.createOne(Event,dataToCreate);
    return  res.success({ data :createdEvent });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Event from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Event(s). {status, message, data}
 */
const findAllEvent = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundEvent;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      EventSchemaKey.findFilterKeys,
      Event.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundEvent = await dbService.count(Event, query);
      if (!foundEvent) {
        return res.recordNotFound();
      } 
      foundEvent = { totalRecords: foundEvent };
      return res.success({ data :foundEvent });
    }
    if (dataToFind && dataToFind.options !== undefined) {
      options = dataToFind.options;
    }
    if (options && options.select && options.select.length){
      options.attributes = options.select;
    }
    if (options && options.include && options.include.length){
      let include = [];
      options.include.forEach(i => {
        i.model = models[i.model];
        if (i.query) {
          i.where = dbService.queryBuilderParser(i.query);
        }
        include.push(i);
      });
      options.include = include;
    }
    if (options && options.sort){
      options.order = dbService.sortParser(options.sort);
      delete options.sort;
    }
    foundEvent = await dbService.findMany( Event,query,options);
            
    if (!foundEvent){
      return res.recordNotFound();
    }
    return res.success({ data:foundEvent });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Event.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getEventCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      EventSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedEvent = await dbService.count(Event,where);
    if (!countedEvent){
      return res.recordNotFound();
    }
    countedEvent = { totalRecords:countedEvent };
    return res.success({ data :countedEvent });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Event from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Event.
 * @return {Object} : number of deactivated documents of Event. {status, message, data}
 */
const softDeleteManyEvent = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Event,query,updateBody, options);
      if (!result) {
        return res.recordNotFound();
      }
      return  res.success({ data :result });
    }
    return res.badRequest();
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Event in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Events. {status, message, data}
 */
const bulkInsertEvent = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdEvent = await dbService.createMany(Event,dataToCreate);
      return  res.success({ data :createdEvent });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Event with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Events.
 * @return {Object} : updated Events. {status, message, data}
 */
const bulkUpdateEvent = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedEvent = await dbService.updateMany(Event,filter,dataToUpdate);
    if (!updatedEvent){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedEvent });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Event in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyEvent = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedEvent = await dbService.deleteMany(Event,query);
    return res.success({ data :deletedEvent });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Event from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Event.
 * @return {Object} : deactivated Event. {status, message, data}
 */
const softDeleteEvent = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Event, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Event with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Event.
 * @return {Object} : updated Event. {status, message, data}
 */
const partialUpdateEvent = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      EventSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedEvent = await dbService.updateMany(Event, query, dataToUpdate);
    if (!updatedEvent) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedEvent });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Event with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Event.
 * @return {Object} : updated Event. {status, message, data}
 */
const updateEvent = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }          
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      EventSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedEvent = await dbService.updateMany(Event,query,dataToUpdate);

    return  res.success({ data :updatedEvent });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Event from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Event. {status, message, data}
 */
const getEvent = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundEvent = await dbService.findByPk(Event,id,options);
    if (!foundEvent){
      return res.recordNotFound();
    }
    return  res.success({ data :foundEvent });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Event from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Event. {status, message, data}
 */
const deleteEvent = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Event, req.params.id);
    if (result){
      return  res.success({ data :result });
    }
    return res.recordNotFound();
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

module.exports = {
  addEvent,
  findAllEvent,
  getEventCount,
  softDeleteManyEvent,
  bulkInsertEvent,
  bulkUpdateEvent,
  deleteManyEvent,
  softDeleteEvent,
  partialUpdateEvent,
  updateEvent,
  getEvent,
  deleteEvent,
};
