/**
 * Appointment_slotController.js
 * @description :: exports action methods for Appointment_slot.
 */

const { Op } = require('sequelize');
const Appointment_slot = require('../../../model/Appointment_slot');
const Appointment_slotSchemaKey = require('../../../utils/validation/Appointment_slotValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');
const deleteDependentService = require('../../../utils/deleteDependent');

/**
 * @description : create record of Appointment_slot in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Appointment_slot. {status, message, data}
 */ 
const addAppointment_slot = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Appointment_slotSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdAppointment_slot = await dbService.createOne(Appointment_slot,dataToCreate);
    return  res.success({ data :createdAppointment_slot });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Appointment_slot from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Appointment_slot(s). {status, message, data}
 */
const findAllAppointment_slot = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundAppointment_slot;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      Appointment_slotSchemaKey.findFilterKeys,
      Appointment_slot.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundAppointment_slot = await dbService.count(Appointment_slot, query);
      if (!foundAppointment_slot) {
        return res.recordNotFound();
      } 
      foundAppointment_slot = { totalRecords: foundAppointment_slot };
      return res.success({ data :foundAppointment_slot });
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
    foundAppointment_slot = await dbService.findMany( Appointment_slot,query,options);
            
    if (!foundAppointment_slot){
      return res.recordNotFound();
    }
    return res.success({ data:foundAppointment_slot });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Appointment_slot.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getAppointment_slotCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      Appointment_slotSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedAppointment_slot = await dbService.count(Appointment_slot,where);
    if (!countedAppointment_slot){
      return res.recordNotFound();
    }
    countedAppointment_slot = { totalRecords:countedAppointment_slot };
    return res.success({ data :countedAppointment_slot });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Appointment_slot from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Appointment_slot.
 * @return {Object} : number of deactivated documents of Appointment_slot. {status, message, data}
 */
const softDeleteManyAppointment_slot = async (req, res) => {
  try {
    let dataToUpdate = req.body;
    let query = {};
    if (!req.params || !req.params.id){
      return res.badRequest();
    }            
    query = { id:{ [Op.in]:dataToUpdate.ids } };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    let updatedAppointment_slot = await deleteDependentService.softDeleteAppointment_slot(query, updateBody);
    if (!updatedAppointment_slot) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Appointment_slot in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Appointment_slots. {status, message, data}
 */
const bulkInsertAppointment_slot = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdAppointment_slot = await dbService.createMany(Appointment_slot,dataToCreate);
      return  res.success({ data :createdAppointment_slot });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Appointment_slot with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_slots.
 * @return {Object} : updated Appointment_slots. {status, message, data}
 */
const bulkUpdateAppointment_slot = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedAppointment_slot = await dbService.updateMany(Appointment_slot,filter,dataToUpdate);
    if (!updatedAppointment_slot){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedAppointment_slot });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Appointment_slot in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyAppointment_slot = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedAppointment_slot = await deleteDependentService.countAppointment_slot(query);
      if (!countedAppointment_slot) {
        return res.recordNotFound();
      }
      return res.success({ data: countedAppointment_slot });            
    }
    let deletedAppointment_slot = await deleteDependentService.deleteAppointment_slot(query);
    if (!deletedAppointment_slot) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedAppointment_slot });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Appointment_slot from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Appointment_slot.
 * @return {Object} : deactivated Appointment_slot. {status, message, data}
 */
const softDeleteAppointment_slot = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedAppointment_slot = await deleteDependentService.softDeleteAppointment_slot(query, updateBody);
    if (!updatedAppointment_slot){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedAppointment_slot });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Appointment_slot with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_slot.
 * @return {Object} : updated Appointment_slot. {status, message, data}
 */
const partialUpdateAppointment_slot = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Appointment_slotSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedAppointment_slot = await dbService.updateMany(Appointment_slot, query, dataToUpdate);
    if (!updatedAppointment_slot) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedAppointment_slot });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Appointment_slot with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Appointment_slot.
 * @return {Object} : updated Appointment_slot. {status, message, data}
 */
const updateAppointment_slot = async (req, res) => {
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
      Appointment_slotSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedAppointment_slot = await dbService.updateMany(Appointment_slot,query,dataToUpdate);

    return  res.success({ data :updatedAppointment_slot });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Appointment_slot from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Appointment_slot. {status, message, data}
 */
const getAppointment_slot = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundAppointment_slot = await dbService.findByPk(Appointment_slot,id,options);
    if (!foundAppointment_slot){
      return res.recordNotFound();
    }
    return  res.success({ data :foundAppointment_slot });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Appointment_slot from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Appointment_slot. {status, message, data}
 */
const deleteAppointment_slot = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedAppointment_slot = await deleteDependentService.countAppointment_slot(query);
      if (!countedAppointment_slot){
        return res.recordNotFound();
      }
      return res.success({ data :countedAppointment_slot });

    } 
    let deletedAppointment_slot = await deleteDependentService.deleteAppointment_slot(query);
    if (!deletedAppointment_slot){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedAppointment_slot });    
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addAppointment_slot,
  findAllAppointment_slot,
  getAppointment_slotCount,
  softDeleteManyAppointment_slot,
  bulkInsertAppointment_slot,
  bulkUpdateAppointment_slot,
  deleteManyAppointment_slot,
  softDeleteAppointment_slot,
  partialUpdateAppointment_slot,
  updateAppointment_slot,
  getAppointment_slot,
  deleteAppointment_slot,
};
