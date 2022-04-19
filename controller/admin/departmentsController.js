/**
 * departmentsController.js
 * @description :: exports action methods for departments.
 */

const { Op } = require('sequelize');
const Departments = require('../../model/departments');
const departmentsSchemaKey = require('../../utils/validation/departmentsValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of Departments in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Departments. {status, message, data}
 */ 
const addDepartments = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      departmentsSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdDepartments = await dbService.createOne(Departments,dataToCreate);
    return  res.success({ data :createdDepartments });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Departments from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Departments(s). {status, message, data}
 */
const findAllDepartments = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundDepartments;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      departmentsSchemaKey.findFilterKeys,
      Departments.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundDepartments = await dbService.count(Departments, query);
      if (!foundDepartments) {
        return res.recordNotFound();
      } 
      foundDepartments = { totalRecords: foundDepartments };
      return res.success({ data :foundDepartments });
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
    foundDepartments = await dbService.findMany( Departments,query,options);
            
    if (!foundDepartments){
      return res.recordNotFound();
    }
    return res.success({ data:foundDepartments });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Departments.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getDepartmentsCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      departmentsSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedDepartments = await dbService.count(Departments,where);
    if (!countedDepartments){
      return res.recordNotFound();
    }
    countedDepartments = { totalRecords:countedDepartments };
    return res.success({ data :countedDepartments });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Departments from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Departments.
 * @return {Object} : number of deactivated documents of Departments. {status, message, data}
 */
const softDeleteManyDepartments = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Departments,query,updateBody, options);
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
 * @description : create multiple records of Departments in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Departmentss. {status, message, data}
 */
const bulkInsertDepartments = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdDepartments = await dbService.createMany(Departments,dataToCreate);
      return  res.success({ data :createdDepartments });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Departments with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Departmentss.
 * @return {Object} : updated Departmentss. {status, message, data}
 */
const bulkUpdateDepartments = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedDepartments = await dbService.updateMany(Departments,filter,dataToUpdate);
    if (!updatedDepartments){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedDepartments });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Departments in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyDepartments = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedDepartments = await dbService.deleteMany(Departments,query);
    return res.success({ data :deletedDepartments });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Departments from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Departments.
 * @return {Object} : deactivated Departments. {status, message, data}
 */
const softDeleteDepartments = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Departments, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Departments with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Departments.
 * @return {Object} : updated Departments. {status, message, data}
 */
const partialUpdateDepartments = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      departmentsSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedDepartments = await dbService.updateMany(Departments, query, dataToUpdate);
    if (!updatedDepartments) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedDepartments });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Departments with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Departments.
 * @return {Object} : updated Departments. {status, message, data}
 */
const updateDepartments = async (req, res) => {
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
      departmentsSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedDepartments = await dbService.updateMany(Departments,query,dataToUpdate);

    return  res.success({ data :updatedDepartments });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Departments from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Departments. {status, message, data}
 */
const getDepartments = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundDepartments = await dbService.findByPk(Departments,id,options);
    if (!foundDepartments){
      return res.recordNotFound();
    }
    return  res.success({ data :foundDepartments });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Departments from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Departments. {status, message, data}
 */
const deleteDepartments = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Departments, req.params.id);
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
  addDepartments,
  findAllDepartments,
  getDepartmentsCount,
  softDeleteManyDepartments,
  bulkInsertDepartments,
  bulkUpdateDepartments,
  deleteManyDepartments,
  softDeleteDepartments,
  partialUpdateDepartments,
  updateDepartments,
  getDepartments,
  deleteDepartments,
};
