/**
 * BlogController.js
 * @description :: exports action methods for Blog.
 */

const { Op } = require('sequelize');
const Blog = require('../../model/Blog');
const BlogSchemaKey = require('../../utils/validation/BlogValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');

/**
 * @description : create record of Blog in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Blog. {status, message, data}
 */ 
const addBlog = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      BlogSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdBlog = await dbService.createOne(Blog,dataToCreate);
    return  res.success({ data :createdBlog });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Blog from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Blog(s). {status, message, data}
 */
const findAllBlog = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundBlog;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      BlogSchemaKey.findFilterKeys,
      Blog.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundBlog = await dbService.count(Blog, query);
      if (!foundBlog) {
        return res.recordNotFound();
      } 
      foundBlog = { totalRecords: foundBlog };
      return res.success({ data :foundBlog });
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
    foundBlog = await dbService.findMany( Blog,query,options);
            
    if (!foundBlog){
      return res.recordNotFound();
    }
    return res.success({ data:foundBlog });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Blog.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getBlogCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      BlogSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedBlog = await dbService.count(Blog,where);
    if (!countedBlog){
      return res.recordNotFound();
    }
    countedBlog = { totalRecords:countedBlog };
    return res.success({ data :countedBlog });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Blog from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Blog.
 * @return {Object} : number of deactivated documents of Blog. {status, message, data}
 */
const softDeleteManyBlog = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Blog,query,updateBody, options);
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
 * @description : create multiple records of Blog in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Blogs. {status, message, data}
 */
const bulkInsertBlog = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdBlog = await dbService.createMany(Blog,dataToCreate);
      return  res.success({ data :createdBlog });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Blog with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Blogs.
 * @return {Object} : updated Blogs. {status, message, data}
 */
const bulkUpdateBlog = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedBlog = await dbService.updateMany(Blog,filter,dataToUpdate);
    if (!updatedBlog){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedBlog });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Blog in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyBlog = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedBlog = await dbService.deleteMany(Blog,query);
    return res.success({ data :deletedBlog });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Blog from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Blog.
 * @return {Object} : deactivated Blog. {status, message, data}
 */
const softDeleteBlog = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Blog, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Blog with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Blog.
 * @return {Object} : updated Blog. {status, message, data}
 */
const partialUpdateBlog = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      BlogSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedBlog = await dbService.updateMany(Blog, query, dataToUpdate);
    if (!updatedBlog) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedBlog });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Blog with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Blog.
 * @return {Object} : updated Blog. {status, message, data}
 */
const updateBlog = async (req, res) => {
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
      BlogSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedBlog = await dbService.updateMany(Blog,query,dataToUpdate);

    return  res.success({ data :updatedBlog });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Blog from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Blog. {status, message, data}
 */
const getBlog = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundBlog = await dbService.findByPk(Blog,id,options);
    if (!foundBlog){
      return res.recordNotFound();
    }
    return  res.success({ data :foundBlog });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Blog from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Blog. {status, message, data}
 */
const deleteBlog = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Blog, req.params.id);
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
  addBlog,
  findAllBlog,
  getBlogCount,
  softDeleteManyBlog,
  bulkInsertBlog,
  bulkUpdateBlog,
  deleteManyBlog,
  softDeleteBlog,
  partialUpdateBlog,
  updateBlog,
  getBlog,
  deleteBlog,
};
