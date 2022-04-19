/**
 * orderItemController.js
 * @description :: exports action methods for orderItem.
 */

const { Op } = require('sequelize');
const OrderItem = require('../../../model/orderItem');
const orderItemSchemaKey = require('../../../utils/validation/orderItemValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of OrderItem in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created OrderItem. {status, message, data}
 */ 
const addOrderItem = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      orderItemSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdOrderItem = await dbService.createOne(OrderItem,dataToCreate);
    return  res.success({ data :createdOrderItem });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of OrderItem from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found OrderItem(s). {status, message, data}
 */
const findAllOrderItem = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundOrderItem;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      orderItemSchemaKey.findFilterKeys,
      OrderItem.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundOrderItem = await dbService.count(OrderItem, query);
      if (!foundOrderItem) {
        return res.recordNotFound();
      } 
      foundOrderItem = { totalRecords: foundOrderItem };
      return res.success({ data :foundOrderItem });
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
    foundOrderItem = await dbService.findMany( OrderItem,query,options);
            
    if (!foundOrderItem){
      return res.recordNotFound();
    }
    return res.success({ data:foundOrderItem });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of OrderItem.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getOrderItemCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      orderItemSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedOrderItem = await dbService.count(OrderItem,where);
    if (!countedOrderItem){
      return res.recordNotFound();
    }
    countedOrderItem = { totalRecords:countedOrderItem };
    return res.success({ data :countedOrderItem });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of OrderItem from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of OrderItem.
 * @return {Object} : number of deactivated documents of OrderItem. {status, message, data}
 */
const softDeleteManyOrderItem = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(OrderItem,query,updateBody, options);
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
 * @description : create multiple records of OrderItem in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created OrderItems. {status, message, data}
 */
const bulkInsertOrderItem = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdOrderItem = await dbService.createMany(OrderItem,dataToCreate);
      return  res.success({ data :createdOrderItem });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of OrderItem with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated OrderItems.
 * @return {Object} : updated OrderItems. {status, message, data}
 */
const bulkUpdateOrderItem = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedOrderItem = await dbService.updateMany(OrderItem,filter,dataToUpdate);
    if (!updatedOrderItem){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedOrderItem });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of OrderItem in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyOrderItem = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedOrderItem = await dbService.deleteMany(OrderItem,query);
    return res.success({ data :deletedOrderItem });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of OrderItem from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of OrderItem.
 * @return {Object} : deactivated OrderItem. {status, message, data}
 */
const softDeleteOrderItem = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(OrderItem, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of OrderItem with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated OrderItem.
 * @return {Object} : updated OrderItem. {status, message, data}
 */
const partialUpdateOrderItem = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      orderItemSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedOrderItem = await dbService.updateMany(OrderItem, query, dataToUpdate);
    if (!updatedOrderItem) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedOrderItem });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of OrderItem with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated OrderItem.
 * @return {Object} : updated OrderItem. {status, message, data}
 */
const updateOrderItem = async (req, res) => {
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
      orderItemSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedOrderItem = await dbService.updateMany(OrderItem,query,dataToUpdate);

    return  res.success({ data :updatedOrderItem });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of OrderItem from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found OrderItem. {status, message, data}
 */
const getOrderItem = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundOrderItem = await dbService.findByPk(OrderItem,id,options);
    if (!foundOrderItem){
      return res.recordNotFound();
    }
    return  res.success({ data :foundOrderItem });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of OrderItem from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted OrderItem. {status, message, data}
 */
const deleteOrderItem = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(OrderItem, req.params.id);
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
  addOrderItem,
  findAllOrderItem,
  getOrderItemCount,
  softDeleteManyOrderItem,
  bulkInsertOrderItem,
  bulkUpdateOrderItem,
  deleteManyOrderItem,
  softDeleteOrderItem,
  partialUpdateOrderItem,
  updateOrderItem,
  getOrderItem,
  deleteOrderItem,
};
