/**
 * encounterController.js
 * @description :: exports action methods for encounter.
 */

const { Op } = require('sequelize');
const Encounter = require('../../../model/encounter');
const encounterSchemaKey = require('../../../utils/validation/encounterValidation');
const validation = require('../../../utils/validateRequest');
const dbService = require('../../../utils/dbService');
const models = require('../../../model');

/**
 * @description : create record of Encounter in SQL table.
 * @param {Object} req : request including body for creating record.
 * @param {Object} res : response of created record.
 * @return {Object} : created Encounter. {status, message, data}
 */ 
const addEncounter = async (req, res) => {
  let dataToCreate = { ...req.body || {} };
  try {
    let validateRequest = validation.validateParamsWithJoi(
      dataToCreate,
      encounterSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    } 
    delete dataToCreate['addedBy'];
    delete dataToCreate['updatedBy'];
    if (!req.user || !req.user.id){
      return res.badRequest();
    }
    dataToCreate.addedBy = req.user.id;

    let createdEncounter = await dbService.createOne(Encounter,dataToCreate);
    return  res.success({ data :createdEncounter });
  } catch (error) {
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : find all records of Encounter from table based on query and options.
 * @param {Object} req : request including option and query. {query, options : {page, limit, includes}, isCountOnly}
 * @param {Object} res : response contains data found from table.
 * @return {Object} : found Encounter(s). {status, message, data}
 */
const findAllEncounter = async (req, res) => {
  try {
    let dataToFind = req.body;
    let options = {};
    let query = {};
    let foundEncounter;
    let validateRequest = validation.validateFilterWithJoi(
      dataToFind,
      encounterSchemaKey.findFilterKeys,
      Encounter.tableAttributes
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToFind && dataToFind.query !== undefined) {
      query = dataToFind.query;
    }
    query = dbService.queryBuilderParser(query);
    if (dataToFind && dataToFind.isCountOnly){
      foundEncounter = await dbService.count(Encounter, query);
      if (!foundEncounter) {
        return res.recordNotFound();
      } 
      foundEncounter = { totalRecords: foundEncounter };
      return res.success({ data :foundEncounter });
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
    foundEncounter = await dbService.findMany( Encounter,query,options);
            
    if (!foundEncounter){
      return res.recordNotFound();
    }
    return res.success({ data:foundEncounter });   
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : returns total number of records of Encounter.
 * @param {Object} req : request including where object to apply filters in request body 
 * @param {Object} res : response that returns total number of records.
 * @return {Object} : number of records. {status, message, data}
 */
const getEncounterCount = async (req, res) => {
  try {
    let dataToCount = req.body;
    let where = {};
    let validateRequest = validation.validateFilterWithJoi(
      dataToCount,
      encounterSchemaKey.findFilterKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `${validateRequest.message}` });
    }
    if (dataToCount && dataToCount.where){
      where = dataToCount.where;
    }
    let countedEncounter = await dbService.count(Encounter,where);
    if (!countedEncounter){
      return res.recordNotFound();
    }
    countedEncounter = { totalRecords:countedEncounter };
    return res.success({ data :countedEncounter });

  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : deactivate multiple records of Encounter from table by ids;
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains updated records of Encounter.
 * @return {Object} : number of deactivated documents of Encounter. {status, message, data}
 */
const softDeleteManyEncounter = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      const query = { id:{ [Op.in]:ids } };
      const updateBody = {
        isDeleted: true,
        updatedBy: req.user.id,
      };
      const options = {};
      let result = await dbService.softDeleteMany(Encounter,query,updateBody, options);
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
 * @description : create multiple records of Encounter in SQL table.
 * @param {Object} req : request including body for creating records.
 * @param {Object} res : response of created records.
 * @return {Object} : created Encounters. {status, message, data}
 */
const bulkInsertEncounter = async (req, res)=>{
  try {
    let dataToCreate = req.body.data;   
    if (dataToCreate !== undefined && dataToCreate.length){
      dataToCreate = dataToCreate.map(item=>{
        delete item.addedBy;
        delete item.updatedBy;
        item.addedBy = req.user.id;
        return item;
      });        
      let createdEncounter = await dbService.createMany(Encounter,dataToCreate);
      return  res.success({ data :createdEncounter });
    } else {
      return res.badRequest();
    }  
  } catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : update multiple records of Encounter with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Encounters.
 * @return {Object} : updated Encounters. {status, message, data}
 */
const bulkUpdateEncounter = async (req, res)=>{
  try {
    let dataToUpdate = req.body;
    let filter = {};
    if (dataToUpdate && dataToUpdate.filter !== undefined) {
      filter = dataToUpdate.filter;
    }
    if (dataToUpdate && dataToUpdate.data !== undefined) {
      dataToUpdate.updatedBy = req.user.id;
    }
            
    let updatedEncounter = await dbService.updateMany(Encounter,filter,dataToUpdate);
    if (!updatedEncounter){
      return res.recordNotFound();
    }

    return  res.success({ data :updatedEncounter });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : delete records of Encounter in table by using ids.
 * @param {Object} req : request including array of ids in request body.
 * @param {Object} res : response contains no of records deleted.
 * @return {Object} : no of records deleted. {status, message, data}
 */
const deleteManyEncounter = async (req, res) => {
  try {
    let dataToDelete = req.body;
    if (!dataToDelete || !dataToDelete.ids) {
      return res.badRequest();
    }              
    let query = { id:{ [Op.in]:dataToDelete.ids } };
    let deletedEncounter = await dbService.deleteMany(Encounter,query);
    return res.success({ data :deletedEncounter });
  }
  catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : deactivate record of Encounter from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains updated record of Encounter.
 * @return {Object} : deactivated Encounter. {status, message, data}
 */
const softDeleteEncounter = async (req, res) => {
  try {
    query = { id:req.params.id };
    const updateBody = {
      isDeleted: true,
      updatedBy: req.user.id
    };
    const options = {};
    let result = await dbService.softDeleteMany(Encounter, query,updateBody, options);
    if (!result){
      return res.recordNotFound();
    }
    return  res.success({ data :result });
  } catch (error){
    return res.internalServerError({ message:error.message });  
  }
};

/**
 * @description : partially update record of Encounter with data by id;
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Encounter.
 * @return {Object} : updated Encounter. {status, message, data}
 */
const partialUpdateEncounter = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body, };
    delete dataToUpdate.addedBy;
    delete dataToUpdate.updatedBy;
    dataToUpdate.updatedBy = req.user.id;
    let validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      encounterSchemaKey.updateSchemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    const query = { id:req.params.id };
    let updatedEncounter = await dbService.updateMany(Encounter, query, dataToUpdate);
    if (!updatedEncounter) {
      return res.recordNotFound();
    }
        
    return res.success({ data :updatedEncounter });
        
  }
  catch (error){
    return res.internalServerError({ message:error.message });
  }
};

/**
 * @description : update record of Encounter with data by id.
 * @param {Object} req : request including id in request params and data in request body.
 * @param {Object} res : response of updated Encounter.
 * @return {Object} : updated Encounter. {status, message, data}
 */
const updateEncounter = async (req, res) => {
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
      encounterSchemaKey.schemaKeys
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message : `Invalid values in parameters, ${validateRequest.message}` });
    }

    query = { id:req.params.id };
    let updatedEncounter = await dbService.updateMany(Encounter,query,dataToUpdate);

    return  res.success({ data :updatedEncounter });
  }
  catch (error){
    return res.internalServerError({ data:error.message }); 
  }
};

/**
 * @description : find record of Encounter from table by id;
 * @param {Object} req : request including id in request params.
 * @param {Object} res : response contains record retrieved from table.
 * @return {Object} : found Encounter. {status, message, data}
 */
const getEncounter = async (req, res) => {
  try {
    let options = {};
    let id = req.params.id;
    let foundEncounter = await dbService.findByPk(Encounter,id,options);
    if (!foundEncounter){
      return res.recordNotFound();
    }
    return  res.success({ data :foundEncounter });

  }
  catch (error){
    return res.internalServerError();
  }
};

/**
 * @description : delete record of Encounter from table.
 * @param {Object} req : request including id as request param.
 * @param {Object} res : response contains deleted record.
 * @return {Object} : deleted Encounter. {status, message, data}
 */
const deleteEncounter = async (req, res) => {
  try {
    const result = await dbService.deleteByPk(Encounter, req.params.id);
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
  addEncounter,
  findAllEncounter,
  getEncounterCount,
  softDeleteManyEncounter,
  bulkInsertEncounter,
  bulkUpdateEncounter,
  deleteManyEncounter,
  softDeleteEncounter,
  partialUpdateEncounter,
  updateEncounter,
  getEncounter,
  deleteEncounter,
};
