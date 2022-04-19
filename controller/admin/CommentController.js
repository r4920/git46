/**
 * CommentController.js
 * @description :: exports action methods for Comment.
 */

const { Op } = require('sequelize');
const Comment = require('../../model/Comment');
const CommentSchemaKey = require('../../utils/validation/CommentValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const models = require('../../model');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create record of Comment in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Comment. {status, message, data}
 */ 
const addComment = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      CommentSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdComment = await dbService.createOne(Comment,dataToCreate);
    return  res.success({ data :createdComment });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Comment from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Comment(s). {status, message, data}
 */
const findAllComment = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundComment;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      CommentSchemaKey.findFilterKeys,
      Comment.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundComment = await dbService.count(Comment, query);
      if (!foundComment) {
        return res.recordNotFound();
      } 
      foundComment = { totalRecords: foundComment };
      return res.success({ data :foundComment });
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
    foundComment = await dbService.findMany( Comment,query,options);
            
    if (!foundComment){
      return res.recordNotFound();
    }
    return res.success({ data:foundComment });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Comment.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getCommentCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      CommentSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedComment = await dbService.count(Comment,where);
    if (!countedComment){
      return res.recordNotFound();
    }
    countedComment = { totalRecords:countedComment };
    return res.success({ data :countedComment });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Comment from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Comment.
 * @return {Object} : number of deactivated documents of Comment. {status, message, data}
 */
const softDeleteManyComment = async (req, res) => {
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
    let updatedComment = await deleteDependentService.softDeleteComment(query, updateBody);
    if (!updatedComment) {
      return res.recordNotFound();
    }
    return  res.success({ data :updatedComment });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : create multiple records of Comment in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Comments. {status, message, data}
 */
const bulkInsertComment = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdComment = await dbService.createMany(Comment,dataToCreate);
      return  res.success({ data :createdComment });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Comment with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Comments.
 * @return {Object} : updated Comments. {status, message, data}
 */
const bulkUpdateComment = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedComment = await dbService.updateMany(Comment,filter,dataToUpdate);
    if (!updatedComment){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedComment });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Comment in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyComment = async (req, res) => {
  try {
    let dataToDelete = req.body;
    let query = {};
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }                              
    query = { id:{ [Op.in]:dataToDelete.ids } };
    if (dataToDelete.isWarning){
      let countedComment = await deleteDependentService.countComment(query);
      if (!countedComment) {
        return res.recordNotFound();
      }
      return res.success({ data: countedComment });            
    }
    let deletedComment = await deleteDependentService.deleteComment(query);
    if (!deletedComment) {
      return res.recordNotFound();
    }
    return res.success({ data: deletedComment });          
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Comment from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Comment.
 * @return {Object} : deactivated Comment. {status, message, data}
 */
const softDeleteComment = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return res.badRequest();
    }              
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
        
    let updatedComment = await deleteDependentService.softDeleteComment(query, updateBody);
    if (!updatedComment){
      return res.recordNotFound();
    }
    return  res.success({ data :updatedComment });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Comment with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Comment.
 * @return {Object} : updated Comment. {status, message, data}
 */
const partialUpdateComment = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      CommentSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedComment = await dbService.updateMany(Comment, query, dataToUpdate);
    if (!updatedComment) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedComment });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Comment with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Comment.
 * @return {Object} : updated Comment. {status, message, data}
 */
const updateComment = async (req, res) => {
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
      CommentSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedComment = await dbService.updateMany(Comment,query,dataToUpdate);

    return  res.success({ data :updatedComment });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Comment from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Comment. {status, message, data}
 */
const getComment = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundComment = await dbService.findByPk(Comment,id,options);
    if (!foundComment){
      return res.recordNotFound();
    }
    return  res.success({ data :foundComment });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Comment from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Comment. {status, message, data}
 */
const deleteComment = async (req, res) => {
  try {
    let dataToDeleted = req.body;
                 
    query = { id:req.params.id };
    if (dataToDeleted && dataToDeleted.isWarning) {
      let countedComment = await deleteDependentService.countComment(query);
      if (!countedComment){
        return res.recordNotFound();
      }
      return res.success({ data :countedComment });

    } 
    let deletedComment = await deleteDependentService.deleteComment(query);
    if (!deletedComment){
      return res.recordNotFound(); 
    }
    return  res.success({ data :deletedComment });    
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

module.exports = {
  addComment,
  findAllComment,
  getCommentCount,
  softDeleteManyComment,
  bulkInsertComment,
  bulkUpdateComment,
  deleteManyComment,
  softDeleteComment,
  partialUpdateComment,
  updateComment,
  getComment,
  deleteComment,
};
