/**
 * enterpriseController.js
 * @description :: exports action methods for enterprise.
 */

const { Op } = require('sequelize');
const Enterprise = require('../../model/enterprise');
const enterpriseSchemaKey = require('../../utils/validation/enterpriseValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create record of Enterprise in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Enterprise. {status, message, data}
 */ 
const addEnterprise = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      enterpriseSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdEnterprise = await dbService.createOne(Enterprise,dataToCreate);
    return  res.success({ data :createdEnterprise });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Enterprise from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Enterprise(s). {status, message, data}
 */
const findAllEnterprise = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundEnterprise;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      enterpriseSchemaKey.findFilterKeys,
      Enterprise.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundEnterprise = await dbService.count(Enterprise, query);
      if (!foundEnterprise) {
        return res.recordNotFound();
      } 
      foundEnterprise = { totalRecords: foundEnterprise };
      return res.success({ data :foundEnterprise });
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
    foundEnterprise = await dbService.findMany( Enterprise,query,options);
            
    if (!foundEnterprise){
      return res.recordNotFound();
    }
    return res.success({ data:foundEnterprise });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Enterprise.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getEnterpriseCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      enterpriseSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedEnterprise = await dbService.count(Enterprise,where);
    if (!countedEnterprise){
      return res.recordNotFound();
    }
    countedEnterprise = { totalRecords:countedEnterprise };
    return res.success({ data :countedEnterprise });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Enterprise from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Enterprise.
 * @return {Object} : number of deactivated documents of Enterprise. {status, message, data}
 */
const softDeleteManyEnterprise = async (req, res) => {
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
    let updatedEnterprise = await deleteDependentService.softDeleteEnterprise(query, updateBody);
    if (!updatedEnterprise) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Enterprise in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Enterprises. {status, message, data}
 */
const bulkInsertEnterprise = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdEnterprise = await dbService.createMany(Enterprise,dataToCreate);
      return  res.success({ data :createdEnterprise });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Enterprise with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Enterprises.
 * @return {Object} : updated Enterprises. {status, message, data}
 */
const bulkUpdateEnterprise = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedEnterprise = await dbService.updateMany(Enterprise,filter,dataToUpdate);
    if (!updatedEnterprise){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedEnterprise });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Enterprise in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyEnterprise = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedEnterprise = await deleteDependentService.countEnterprise(query);
      if (!countedEnterprise) {
        return res.recordNotFound();
      }
      return res.success({ data: countedEnterprise });            
    }
    let deletedEnterprise = await deleteDependentService.deleteEnterprise(query);
    if (!deletedEnterprise) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedEnterprise });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Enterprise from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Enterprise.
 * @return {Object} : deactivated Enterprise. {status, message, data}
 */
const softDeleteEnterprise = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedEnterprise = await deleteDependentService.softDeleteEnterprise(query, updateBody);
    if (!updatedEnterprise){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedEnterprise });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Enterprise with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Enterprise.
 * @return {Object} : updated Enterprise. {status, message, data}
 */
const partialUpdateEnterprise = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      enterpriseSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedEnterprise = await dbService.updateMany(Enterprise, query, dataToUpdate);
    if (!updatedEnterprise) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedEnterprise });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Enterprise with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Enterprise.
 * @return {Object} : updated Enterprise. {status, message, data}
 */
const updateEnterprise = async (req, res) => {
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
      enterpriseSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedEnterprise = await dbService.updateMany(Enterprise,query,dataToUpdate);

    return  res.success({ data :updatedEnterprise });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Enterprise from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Enterprise. {status, message, data}
 */
const getEnterprise = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundEnterprise = await dbService.findByPk(Enterprise,id,options);
    if (!foundEnterprise){
      return res.recordNotFound();
    }
    return  res.success({ data :foundEnterprise });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Enterprise from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Enterprise. {status, message, data}
 */
const deleteEnterprise = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedEnterprise = await deleteDependentService.countEnterprise(query);
      if (!countedEnterprise){
        return res.recordNotFound();
      }
      return res.success({ data :countedEnterprise });

    } 
    let deletedEnterprise = await deleteDependentService.deleteEnterprise(query);
    if (!deletedEnterprise){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedEnterprise });    
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addEnterprise,
  findAllEnterprise,
  getEnterpriseCount,
  softDeleteManyEnterprise,
  bulkInsertEnterprise,
  bulkUpdateEnterprise,
  deleteManyEnterprise,
  softDeleteEnterprise,
  partialUpdateEnterprise,
  updateEnterprise,
  getEnterprise,
  deleteEnterprise,
};
