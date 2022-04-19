/**
 * Chat_messageController.js
 * @description :: exports action methods for Chat_message.
 */

const { Op } = require('sequelize');
const Chat_message = require('../../../model/Chat_message');
const Chat_messageSchemaKey = require('../../../utils/validation/Chat_messageValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Chat_message in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Chat_message. {status, message, data}
 */ 
const addChat_message = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      Chat_messageSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdChat_message = await dbService.createOne(Chat_message,dataToCreate);
    return  res.success({ data :createdChat_message });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Chat_message from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Chat_message(s). {status, message, data}
 */
const findAllChat_message = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundChat_message;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      Chat_messageSchemaKey.findFilterKeys,
      Chat_message.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundChat_message = await dbService.count(Chat_message, query);
      if (!foundChat_message) {
        return res.recordNotFound();
      } 
      foundChat_message = { totalRecords: foundChat_message };
      return res.success({ data :foundChat_message });
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
    foundChat_message = await dbService.findMany( Chat_message,query,options);
            
    if (!foundChat_message){
      return res.recordNotFound();
    }
    return res.success({ data:foundChat_message });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Chat_message.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getChat_messageCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      Chat_messageSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedChat_message = await dbService.count(Chat_message,where);
    if (!countedChat_message){
      return res.recordNotFound();
    }
    countedChat_message = { totalRecords:countedChat_message };
    return res.success({ data :countedChat_message });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Chat_message from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Chat_message.
 * @return {Object} : number of deactivated documents of Chat_message. {status, message, data}
 */
const softDeleteManyChat_message = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Chat_message,query,updateBody, options);
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
 * @description : create multiple records of Chat_message in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Chat_messages. {status, message, data}
 */
const bulkInsertChat_message = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdChat_message = await dbService.createMany(Chat_message,dataToCreate);
      return  res.success({ data :createdChat_message });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Chat_message with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_messages.
 * @return {Object} : updated Chat_messages. {status, message, data}
 */
const bulkUpdateChat_message = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedChat_message = await dbService.updateMany(Chat_message,filter,dataToUpdate);
    if (!updatedChat_message){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedChat_message });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Chat_message in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyChat_message = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedChat_message = await dbService.deleteMany(Chat_message,query);
    return res.success({ data :deletedChat_message });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Chat_message from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Chat_message.
 * @return {Object} : deactivated Chat_message. {status, message, data}
 */
const softDeleteChat_message = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Chat_message, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Chat_message with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_message.
 * @return {Object} : updated Chat_message. {status, message, data}
 */
const partialUpdateChat_message = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      Chat_messageSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedChat_message = await dbService.updateMany(Chat_message, query, dataToUpdate);
    if (!updatedChat_message) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedChat_message });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Chat_message with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Chat_message.
 * @return {Object} : updated Chat_message. {status, message, data}
 */
const updateChat_message = async (req, res) => {
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
      Chat_messageSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedChat_message = await dbService.updateMany(Chat_message,query,dataToUpdate);

    return  res.success({ data :updatedChat_message });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Chat_message from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Chat_message. {status, message, data}
 */
const getChat_message = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundChat_message = await dbService.findByPk(Chat_message,id,options);
    if (!foundChat_message){
      return res.recordNotFound();
    }
    return  res.success({ data :foundChat_message });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Chat_message from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Chat_message. {status, message, data}
 */
const deleteChat_message = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Chat_message, req.params.id);
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
  addChat_message,
  findAllChat_message,
  getChat_messageCount,
  softDeleteManyChat_message,
  bulkInsertChat_message,
  bulkUpdateChat_message,
  deleteManyChat_message,
  softDeleteChat_message,
  partialUpdateChat_message,
  updateChat_message,
  getChat_message,
  deleteChat_message,
};
