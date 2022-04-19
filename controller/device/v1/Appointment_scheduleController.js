/**
 * Appointment_scheduleController.js
 * @description :: exports action methods for Appointment_schedule.
 */

const { Op } = require('sequelize');
const Appointment_schedule = require('../../../model/Appointment_schedule');
const Appointment_scheduleSchemaKey = require('../../../utils/validation/Appointment_scheduleValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Appointment_schedule in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Appointment_schedule. {status, message, data}
 */ 
const addAppointment_schedule = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Appointment_scheduleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdAppointment_schedule = await dbService.createOne(Appointment_schedule,dataToCreate);
    return  res.success({ data :createdAppointment_schedule });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Appointment_schedule from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Appointment_schedule(s). {status, message, data}
 */
const findAllAppointment_schedule = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundAppointment_schedule;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      Appointment_scheduleSchemaKey.findFilterKeys,
      Appointment_schedule.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundAppointment_schedule = await dbService.count(Appointment_schedule, query);
      if (!foundAppointment_schedule) {
        return res.recordNotFound();
      } 
      foundAppointment_schedule = { totalRecords: foundAppointment_schedule };
      return res.success({ data :foundAppointment_schedule });
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
    foundAppointment_schedule = await dbService.findMany( Appointment_schedule,query,options);
            
    if (!foundAppointment_schedule){
      return res.recordNotFound();
    }
    return res.success({ data:foundAppointment_schedule });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Appointment_schedule.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getAppointment_scheduleCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      Appointment_scheduleSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedAppointment_schedule = await dbService.count(Appointment_schedule,where);
    if (!countedAppointment_schedule){
      return res.recordNotFound();
    }
    countedAppointment_schedule = { totalRecords:countedAppointment_schedule };
    return res.success({ data :countedAppointment_schedule });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Appointment_schedule from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Appointment_schedule.
 * @return {Object} : number of deactivated documents of Appointment_schedule. {status, message, data}
 */
const softDeleteManyAppointment_schedule = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Appointment_schedule,query,updateBody, options);
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
 * @description : create multiple records of Appointment_schedule in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Appointment_schedules. {status, message, data}
 */
const bulkInsertAppointment_schedule = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdAppointment_schedule = await dbService.createMany(Appointment_schedule,dataToCreate);
      return  res.success({ data :createdAppointment_schedule });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Appointment_schedule with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_schedules.
 * @return {Object} : updated Appointment_schedules. {status, message, data}
 */
const bulkUpdateAppointment_schedule = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedAppointment_schedule = await dbService.updateMany(Appointment_schedule,filter,dataToUpdate);
    if (!updatedAppointment_schedule){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedAppointment_schedule });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Appointment_schedule in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyAppointment_schedule = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedAppointment_schedule = await dbService.deleteMany(Appointment_schedule,query);
    return res.success({ data :deletedAppointment_schedule });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Appointment_schedule from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Appointment_schedule.
 * @return {Object} : deactivated Appointment_schedule. {status, message, data}
 */
const softDeleteAppointment_schedule = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Appointment_schedule, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Appointment_schedule with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_schedule.
 * @return {Object} : updated Appointment_schedule. {status, message, data}
 */
const partialUpdateAppointment_schedule = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Appointment_scheduleSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedAppointment_schedule = await dbService.updateMany(Appointment_schedule, query, dataToUpdate);
    if (!updatedAppointment_schedule) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedAppointment_schedule });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Appointment_schedule with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_schedule.
 * @return {Object} : updated Appointment_schedule. {status, message, data}
 */
const updateAppointment_schedule = async (req, res) => {
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
      Appointment_scheduleSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedAppointment_schedule = await dbService.updateMany(Appointment_schedule,query,dataToUpdate);

    return  res.success({ data :updatedAppointment_schedule });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Appointment_schedule from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Appointment_schedule. {status, message, data}
 */
const getAppointment_schedule = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundAppointment_schedule = await dbService.findByPk(Appointment_schedule,id,options);
    if (!foundAppointment_schedule){
      return res.recordNotFound();
    }
    return  res.success({ data :foundAppointment_schedule });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Appointment_schedule from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Appointment_schedule. {status, message, data}
 */
const deleteAppointment_schedule = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Appointment_schedule, req.params.id);
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
  addAppointment_schedule,
  findAllAppointment_schedule,
  getAppointment_scheduleCount,
  softDeleteManyAppointment_schedule,
  bulkInsertAppointment_schedule,
  bulkUpdateAppointment_schedule,
  deleteManyAppointment_schedule,
  softDeleteAppointment_schedule,
  partialUpdateAppointment_schedule,
  updateAppointment_schedule,
  getAppointment_schedule,
  deleteAppointment_schedule,
};
