/**
 * PlanController.js
 * @description :: exports action methods for Plan.
 */

const { Op } = require('sequelize');
const Plan = require('../../../model/Plan');
const PlanSchemaKey = require('../../../utils/validation/PlanValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Plan in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Plan. {status, message, data}
 */ 
const addPlan = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      PlanSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdPlan = await dbService.createOne(Plan,dataToCreate);
    return  res.success({ data :createdPlan });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Plan from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Plan(s). {status, message, data}
 */
const findAllPlan = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundPlan;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      PlanSchemaKey.findFilterKeys,
      Plan.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundPlan = await dbService.count(Plan, query);
      if (!foundPlan) {
        return res.recordNotFound();
      } 
      foundPlan = { totalRecords: foundPlan };
      return res.success({ data :foundPlan });
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
    foundPlan = await dbService.findMany( Plan,query,options);
            
    if (!foundPlan){
      return res.recordNotFound();
    }
    return res.success({ data:foundPlan });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Plan.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getPlanCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      PlanSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedPlan = await dbService.count(Plan,where);
    if (!countedPlan){
      return res.recordNotFound();
    }
    countedPlan = { totalRecords:countedPlan };
    return res.success({ data :countedPlan });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Plan from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Plan.
 * @return {Object} : number of deactivated documents of Plan. {status, message, data}
 */
const softDeleteManyPlan = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Plan,query,updateBody, options);
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
 * @description : create multiple records of Plan in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Plans. {status, message, data}
 */
const bulkInsertPlan = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdPlan = await dbService.createMany(Plan,dataToCreate);
      return  res.success({ data :createdPlan });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Plan with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Plans.
 * @return {Object} : updated Plans. {status, message, data}
 */
const bulkUpdatePlan = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedPlan = await dbService.updateMany(Plan,filter,dataToUpdate);
    if (!updatedPlan){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedPlan });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Plan in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyPlan = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedPlan = await dbService.deleteMany(Plan,query);
    return res.success({ data :deletedPlan });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Plan from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Plan.
 * @return {Object} : deactivated Plan. {status, message, data}
 */
const softDeletePlan = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Plan, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Plan with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Plan.
 * @return {Object} : updated Plan. {status, message, data}
 */
const partialUpdatePlan = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      PlanSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedPlan = await dbService.updateMany(Plan, query, dataToUpdate);
    if (!updatedPlan) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedPlan });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Plan with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Plan.
 * @return {Object} : updated Plan. {status, message, data}
 */
const updatePlan = async (req, res) => {
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
      PlanSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedPlan = await dbService.updateMany(Plan,query,dataToUpdate);

    return  res.success({ data :updatedPlan });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Plan from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Plan. {status, message, data}
 */
const getPlan = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundPlan = await dbService.findByPk(Plan,id,options);
    if (!foundPlan){
      return res.recordNotFound();
    }
    return  res.success({ data :foundPlan });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Plan from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Plan. {status, message, data}
 */
const deletePlan = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Plan, req.params.id);
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
  addPlan,
  findAllPlan,
  getPlanCount,
  softDeleteManyPlan,
  bulkInsertPlan,
  bulkUpdatePlan,
  deleteManyPlan,
  softDeletePlan,
  partialUpdatePlan,
  updatePlan,
  getPlan,
  deletePlan,
};
