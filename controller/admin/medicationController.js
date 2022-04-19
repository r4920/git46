/**
 * medicationController.js
 * @description :: exports action methods for medication.
 */

const { Op } = require('sequelize');
const Medication = require('../../model/medication');
const medicationSchemaKey = require('../../utils/validation/medicationValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of Medication in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Medication. {status, message, data}
 */ 
const addMedication = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      medicationSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdMedication = await dbService.createOne(Medication,dataToCreate);
    return  res.success({ data :createdMedication });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Medication from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Medication(s). {status, message, data}
 */
const findAllMedication = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundMedication;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      medicationSchemaKey.findFilterKeys,
      Medication.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundMedication = await dbService.count(Medication, query);
      if (!foundMedication) {
        return res.recordNotFound();
      } 
      foundMedication = { totalRecords: foundMedication };
      return res.success({ data :foundMedication });
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
    foundMedication = await dbService.findMany( Medication,query,options);
            
    if (!foundMedication){
      return res.recordNotFound();
    }
    return res.success({ data:foundMedication });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Medication.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getMedicationCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      medicationSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedMedication = await dbService.count(Medication,where);
    if (!countedMedication){
      return res.recordNotFound();
    }
    countedMedication = { totalRecords:countedMedication };
    return res.success({ data :countedMedication });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Medication from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Medication.
 * @return {Object} : number of deactivated documents of Medication. {status, message, data}
 */
const softDeleteManyMedication = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Medication,query,updateBody, options);
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
 * @description : create multiple records of Medication in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Medications. {status, message, data}
 */
const bulkInsertMedication = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdMedication = await dbService.createMany(Medication,dataToCreate);
      return  res.success({ data :createdMedication });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Medication with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Medications.
 * @return {Object} : updated Medications. {status, message, data}
 */
const bulkUpdateMedication = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedMedication = await dbService.updateMany(Medication,filter,dataToUpdate);
    if (!updatedMedication){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedMedication });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Medication in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyMedication = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedMedication = await dbService.deleteMany(Medication,query);
    return res.success({ data :deletedMedication });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Medication from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Medication.
 * @return {Object} : deactivated Medication. {status, message, data}
 */
const softDeleteMedication = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Medication, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Medication with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Medication.
 * @return {Object} : updated Medication. {status, message, data}
 */
const partialUpdateMedication = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      medicationSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedMedication = await dbService.updateMany(Medication, query, dataToUpdate);
    if (!updatedMedication) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedMedication });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Medication with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Medication.
 * @return {Object} : updated Medication. {status, message, data}
 */
const updateMedication = async (req, res) => {
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
      medicationSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedMedication = await dbService.updateMany(Medication,query,dataToUpdate);

    return  res.success({ data :updatedMedication });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Medication from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Medication. {status, message, data}
 */
const getMedication = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundMedication = await dbService.findByPk(Medication,id,options);
    if (!foundMedication){
      return res.recordNotFound();
    }
    return  res.success({ data :foundMedication });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Medication from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Medication. {status, message, data}
 */
const deleteMedication = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Medication, req.params.id);
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
  addMedication,
  findAllMedication,
  getMedicationCount,
  softDeleteManyMedication,
  bulkInsertMedication,
  bulkUpdateMedication,
  deleteManyMedication,
  softDeleteMedication,
  partialUpdateMedication,
  updateMedication,
  getMedication,
  deleteMedication,
};
