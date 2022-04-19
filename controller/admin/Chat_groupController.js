/**
 * Chat_groupController.js
 * @description :: exports action methods for Chat_group.
 */

const { Op } = require('sequelize');
const Chat_group = require('../../model/Chat_group');
const Chat_groupSchemaKey = require('../../utils/validation/Chat_groupValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create record of Chat_group in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Chat_group. {status, message, data}
 */ 
const addChat_group = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Chat_groupSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdChat_group = await dbService.createOne(Chat_group,dataToCreate);
    return  res.success({ data :createdChat_group });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Chat_group from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Chat_group(s). {status, message, data}
 */
const findAllChat_group = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundChat_group;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      Chat_groupSchemaKey.findFilterKeys,
      Chat_group.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundChat_group = await dbService.count(Chat_group, query);
      if (!foundChat_group) {
        return res.recordNotFound();
      } 
      foundChat_group = { totalRecords: foundChat_group };
      return res.success({ data :foundChat_group });
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
    foundChat_group = await dbService.findMany( Chat_group,query,options);
            
    if (!foundChat_group){
      return res.recordNotFound();
    }
    return res.success({ data:foundChat_group });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Chat_group.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getChat_groupCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      Chat_groupSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedChat_group = await dbService.count(Chat_group,where);
    if (!countedChat_group){
      return res.recordNotFound();
    }
    countedChat_group = { totalRecords:countedChat_group };
    return res.success({ data :countedChat_group });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Chat_group from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Chat_group.
 * @return {Object} : number of deactivated documents of Chat_group. {status, message, data}
 */
const softDeleteManyChat_group = async (req, res) => {
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
    let updatedChat_group = await deleteDependentService.softDeleteChat_group(query, updateBody);
    if (!updatedChat_group) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Chat_group in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Chat_groups. {status, message, data}
 */
const bulkInsertChat_group = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdChat_group = await dbService.createMany(Chat_group,dataToCreate);
      return  res.success({ data :createdChat_group });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Chat_group with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_groups.
 * @return {Object} : updated Chat_groups. {status, message, data}
 */
const bulkUpdateChat_group = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedChat_group = await dbService.updateMany(Chat_group,filter,dataToUpdate);
    if (!updatedChat_group){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedChat_group });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Chat_group in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyChat_group = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedChat_group = await deleteDependentService.countChat_group(query);
      if (!countedChat_group) {
        return res.recordNotFound();
      }
      return res.success({ data: countedChat_group });            
    }
    let deletedChat_group = await deleteDependentService.deleteChat_group(query);
    if (!deletedChat_group) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedChat_group });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Chat_group from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Chat_group.
 * @return {Object} : deactivated Chat_group. {status, message, data}
 */
const softDeleteChat_group = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedChat_group = await deleteDependentService.softDeleteChat_group(query, updateBody);
    if (!updatedChat_group){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedChat_group });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Chat_group with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_group.
 * @return {Object} : updated Chat_group. {status, message, data}
 */
const partialUpdateChat_group = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Chat_groupSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedChat_group = await dbService.updateMany(Chat_group, query, dataToUpdate);
    if (!updatedChat_group) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedChat_group });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Chat_group with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_group.
 * @return {Object} : updated Chat_group. {status, message, data}
 */
const updateChat_group = async (req, res) => {
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
      Chat_groupSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedChat_group = await dbService.updateMany(Chat_group,query,dataToUpdate);

    return  res.success({ data :updatedChat_group });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Chat_group from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Chat_group. {status, message, data}
 */
const getChat_group = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundChat_group = await dbService.findByPk(Chat_group,id,options);
    if (!foundChat_group){
      return res.recordNotFound();
    }
    return  res.success({ data :foundChat_group });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Chat_group from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Chat_group. {status, message, data}
 */
const deleteChat_group = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedChat_group = await deleteDependentService.countChat_group(query);
      if (!countedChat_group){
        return res.recordNotFound();
      }
      return res.success({ data :countedChat_group });

    } 
    let deletedChat_group = await deleteDependentService.deleteChat_group(query);
    if (!deletedChat_group){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedChat_group });    
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addChat_group,
  findAllChat_group,
  getChat_groupCount,
  softDeleteManyChat_group,
  bulkInsertChat_group,
  bulkUpdateChat_group,
  deleteManyChat_group,
  softDeleteChat_group,
  partialUpdateChat_group,
  updateChat_group,
  getChat_group,
  deleteChat_group,
};
