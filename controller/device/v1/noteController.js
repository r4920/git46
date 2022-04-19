/**
 * noteController.js
 * @description :: exports action methods for note.
 */

const { Op } = require('sequelize');
const Note = require('../../../model/note');
const noteSchemaKey = require('../../../utils/validation/noteValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Note in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Note. {status, message, data}
 */ 
const addNote = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      noteSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdNote = await dbService.createOne(Note,dataToCreate);
    return  res.success({ data :createdNote });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Note from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Note(s). {status, message, data}
 */
const findAllNote = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundNote;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      noteSchemaKey.findFilterKeys,
      Note.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundNote = await dbService.count(Note, query);
      if (!foundNote) {
        return res.recordNotFound();
      } 
      foundNote = { totalRecords: foundNote };
      return res.success({ data :foundNote });
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
    foundNote = await dbService.findMany( Note,query,options);
            
    if (!foundNote){
      return res.recordNotFound();
    }
    return res.success({ data:foundNote });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Note.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getNoteCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      noteSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedNote = await dbService.count(Note,where);
    if (!countedNote){
      return res.recordNotFound();
    }
    countedNote = { totalRecords:countedNote };
    return res.success({ data :countedNote });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Note from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Note.
 * @return {Object} : number of deactivated documents of Note. {status, message, data}
 */
const softDeleteManyNote = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Note,query,updateBody, options);
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
 * @description : create multiple records of Note in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Notes. {status, message, data}
 */
const bulkInsertNote = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdNote = await dbService.createMany(Note,dataToCreate);
      return  res.success({ data :createdNote });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Note with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Notes.
 * @return {Object} : updated Notes. {status, message, data}
 */
const bulkUpdateNote = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedNote = await dbService.updateMany(Note,filter,dataToUpdate);
    if (!updatedNote){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedNote });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Note in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyNote = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedNote = await dbService.deleteMany(Note,query);
    return res.success({ data :deletedNote });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Note from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Note.
 * @return {Object} : deactivated Note. {status, message, data}
 */
const softDeleteNote = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Note, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Note with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Note.
 * @return {Object} : updated Note. {status, message, data}
 */
const partialUpdateNote = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      noteSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedNote = await dbService.updateMany(Note, query, dataToUpdate);
    if (!updatedNote) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedNote });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Note with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Note.
 * @return {Object} : updated Note. {status, message, data}
 */
const updateNote = async (req, res) => {
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
      noteSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedNote = await dbService.updateMany(Note,query,dataToUpdate);

    return  res.success({ data :updatedNote });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Note from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Note. {status, message, data}
 */
const getNote = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundNote = await dbService.findByPk(Note,id,options);
    if (!foundNote){
      return res.recordNotFound();
    }
    return  res.success({ data :foundNote });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Note from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Note. {status, message, data}
 */
const deleteNote = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Note, req.params.id);
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
  addNote,
  findAllNote,
  getNoteCount,
  softDeleteManyNote,
  bulkInsertNote,
  bulkUpdateNote,
  deleteManyNote,
  softDeleteNote,
  partialUpdateNote,
  updateNote,
  getNote,
  deleteNote,
};
