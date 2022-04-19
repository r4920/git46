/**
 * TaskController.js
 * @description :: exports action methods for Task.
 */

const { Op } = require('sequelize');
const Task = require('../../../model/Task');
const TaskSchemaKey = require('../../../utils/validation/TaskValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Task in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Task. {status, message, data}
 */ 
const addTask = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      TaskSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdTask = await dbService.createOne(Task,dataToCreate);
    return  res.success({ data :createdTask });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Task from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Task(s). {status, message, data}
 */
const findAllTask = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundTask;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      TaskSchemaKey.findFilterKeys,
      Task.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundTask = await dbService.count(Task, query);
      if (!foundTask) {
        return res.recordNotFound();
      } 
      foundTask = { totalRecords: foundTask };
      return res.success({ data :foundTask });
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
    foundTask = await dbService.findMany( Task,query,options);
            
    if (!foundTask){
      return res.recordNotFound();
    }
    return res.success({ data:foundTask });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Task.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getTaskCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      TaskSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedTask = await dbService.count(Task,where);
    if (!countedTask){
      return res.recordNotFound();
    }
    countedTask = { totalRecords:countedTask };
    return res.success({ data :countedTask });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Task from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Task.
 * @return {Object} : number of deactivated documents of Task. {status, message, data}
 */
const softDeleteManyTask = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Task,query,updateBody, options);
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
 * @description : create multiple records of Task in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Tasks. {status, message, data}
 */
const bulkInsertTask = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdTask = await dbService.createMany(Task,dataToCreate);
      return  res.success({ data :createdTask });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Task with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Tasks.
 * @return {Object} : updated Tasks. {status, message, data}
 */
const bulkUpdateTask = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedTask = await dbService.updateMany(Task,filter,dataToUpdate);
    if (!updatedTask){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedTask });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Task in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyTask = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedTask = await dbService.deleteMany(Task,query);
    return res.success({ data :deletedTask });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Task from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Task.
 * @return {Object} : deactivated Task. {status, message, data}
 */
const softDeleteTask = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Task, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Task with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Task.
 * @return {Object} : updated Task. {status, message, data}
 */
const partialUpdateTask = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      TaskSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedTask = await dbService.updateMany(Task, query, dataToUpdate);
    if (!updatedTask) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedTask });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Task with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Task.
 * @return {Object} : updated Task. {status, message, data}
 */
const updateTask = async (req, res) => {
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
      TaskSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedTask = await dbService.updateMany(Task,query,dataToUpdate);

    return  res.success({ data :updatedTask });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Task from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Task. {status, message, data}
 */
const getTask = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundTask = await dbService.findByPk(Task,id,options);
    if (!foundTask){
      return res.recordNotFound();
    }
    return  res.success({ data :foundTask });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Task from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Task. {status, message, data}
 */
const deleteTask = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Task, req.params.id);
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
  addTask,
  findAllTask,
  getTaskCount,
  softDeleteManyTask,
  bulkInsertTask,
  bulkUpdateTask,
  deleteManyTask,
  softDeleteTask,
  partialUpdateTask,
  updateTask,
  getTask,
  deleteTask,
};
