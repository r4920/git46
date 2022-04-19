/**
 * CustomerController.js
 * @description :: exports action methods for Customer.
 */

const { Op } = require('sequelize');
const Customer = require('../../model/Customer');
const CustomerSchemaKey = require('../../utils/validation/CustomerValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of Customer in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Customer. {status, message, data}
 */ 
const addCustomer = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      CustomerSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdCustomer = await dbService.createOne(Customer,dataToCreate);
    return  res.success({ data :createdCustomer });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Customer from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Customer(s). {status, message, data}
 */
const findAllCustomer = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundCustomer;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      CustomerSchemaKey.findFilterKeys,
      Customer.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundCustomer = await dbService.count(Customer, query);
      if (!foundCustomer) {
        return res.recordNotFound();
      } 
      foundCustomer = { totalRecords: foundCustomer };
      return res.success({ data :foundCustomer });
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
    foundCustomer = await dbService.findMany( Customer,query,options);
            
    if (!foundCustomer){
      return res.recordNotFound();
    }
    return res.success({ data:foundCustomer });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Customer.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getCustomerCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      CustomerSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedCustomer = await dbService.count(Customer,where);
    if (!countedCustomer){
      return res.recordNotFound();
    }
    countedCustomer = { totalRecords:countedCustomer };
    return res.success({ data :countedCustomer });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Customer from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Customer.
 * @return {Object} : number of deactivated documents of Customer. {status, message, data}
 */
const softDeleteManyCustomer = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Customer,query,updateBody, options);
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
 * @description : create multiple records of Customer in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Customers. {status, message, data}
 */
const bulkInsertCustomer = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdCustomer = await dbService.createMany(Customer,dataToCreate);
      return  res.success({ data :createdCustomer });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Customer with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Customers.
 * @return {Object} : updated Customers. {status, message, data}
 */
const bulkUpdateCustomer = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedCustomer = await dbService.updateMany(Customer,filter,dataToUpdate);
    if (!updatedCustomer){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedCustomer });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Customer in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyCustomer = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedCustomer = await dbService.deleteMany(Customer,query);
    return res.success({ data :deletedCustomer });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Customer from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Customer.
 * @return {Object} : deactivated Customer. {status, message, data}
 */
const softDeleteCustomer = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Customer, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Customer with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Customer.
 * @return {Object} : updated Customer. {status, message, data}
 */
const partialUpdateCustomer = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      CustomerSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedCustomer = await dbService.updateMany(Customer, query, dataToUpdate);
    if (!updatedCustomer) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedCustomer });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Customer with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Customer.
 * @return {Object} : updated Customer. {status, message, data}
 */
const updateCustomer = async (req, res) => {
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
      CustomerSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedCustomer = await dbService.updateMany(Customer,query,dataToUpdate);

    return  res.success({ data :updatedCustomer });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Customer from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Customer. {status, message, data}
 */
const getCustomer = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundCustomer = await dbService.findByPk(Customer,id,options);
    if (!foundCustomer){
      return res.recordNotFound();
    }
    return  res.success({ data :foundCustomer });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Customer from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Customer. {status, message, data}
 */
const deleteCustomer = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Customer, req.params.id);
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
  addCustomer,
  findAllCustomer,
  getCustomerCount,
  softDeleteManyCustomer,
  bulkInsertCustomer,
  bulkUpdateCustomer,
  deleteManyCustomer,
  softDeleteCustomer,
  partialUpdateCustomer,
  updateCustomer,
  getCustomer,
  deleteCustomer,
};
