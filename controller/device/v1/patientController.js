/**
 * patientController.js
 * @description :: exports action methods for patient.
 */

const { Op } = require('sequelize');
const Patient = require('../../../model/patient');
const patientSchemaKey = require('../../../utils/validation/patientValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Patient in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Patient. {status, message, data}
 */ 
const addPatient = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      patientSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdPatient = await dbService.createOne(Patient,dataToCreate);
    return  res.success({ data :createdPatient });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Patient from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Patient(s). {status, message, data}
 */
const findAllPatient = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundPatient;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      patientSchemaKey.findFilterKeys,
      Patient.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundPatient = await dbService.count(Patient, query);
      if (!foundPatient) {
        return res.recordNotFound();
      } 
      foundPatient = { totalRecords: foundPatient };
      return res.success({ data :foundPatient });
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
    foundPatient = await dbService.findMany( Patient,query,options);
            
    if (!foundPatient){
      return res.recordNotFound();
    }
    return res.success({ data:foundPatient });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Patient.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getPatientCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      patientSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedPatient = await dbService.count(Patient,where);
    if (!countedPatient){
      return res.recordNotFound();
    }
    countedPatient = { totalRecords:countedPatient };
    return res.success({ data :countedPatient });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Patient from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Patient.
 * @return {Object} : number of deactivated documents of Patient. {status, message, data}
 */
const softDeleteManyPatient = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Patient,query,updateBody, options);
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
 * @description : create multiple records of Patient in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Patients. {status, message, data}
 */
const bulkInsertPatient = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdPatient = await dbService.createMany(Patient,dataToCreate);
      return  res.success({ data :createdPatient });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Patient with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Patients.
 * @return {Object} : updated Patients. {status, message, data}
 */
const bulkUpdatePatient = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedPatient = await dbService.updateMany(Patient,filter,dataToUpdate);
    if (!updatedPatient){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedPatient });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Patient in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyPatient = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedPatient = await dbService.deleteMany(Patient,query);
    return res.success({ data :deletedPatient });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Patient from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Patient.
 * @return {Object} : deactivated Patient. {status, message, data}
 */
const softDeletePatient = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Patient, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Patient with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Patient.
 * @return {Object} : updated Patient. {status, message, data}
 */
const partialUpdatePatient = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      patientSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedPatient = await dbService.updateMany(Patient, query, dataToUpdate);
    if (!updatedPatient) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedPatient });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Patient with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Patient.
 * @return {Object} : updated Patient. {status, message, data}
 */
const updatePatient = async (req, res) => {
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
      patientSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedPatient = await dbService.updateMany(Patient,query,dataToUpdate);

    return  res.success({ data :updatedPatient });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Patient from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Patient. {status, message, data}
 */
const getPatient = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundPatient = await dbService.findByPk(Patient,id,options);
    if (!foundPatient){
      return res.recordNotFound();
    }
    return  res.success({ data :foundPatient });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Patient from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Patient. {status, message, data}
 */
const deletePatient = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Patient, req.params.id);
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
  addPatient,
  findAllPatient,
  getPatientCount,
  softDeleteManyPatient,
  bulkInsertPatient,
  bulkUpdatePatient,
  deleteManyPatient,
  softDeletePatient,
  partialUpdatePatient,
  updatePatient,
  getPatient,
  deletePatient,
};
