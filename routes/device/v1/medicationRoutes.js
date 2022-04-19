/**
 * medicationRoutes.js
 * @description :: CRUD API routes for medication
 */

const express = require('express');
const router = express.Router();
const medicationController = require('../../../controller/device/v1/medicationController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/medication/create').post(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.addMedication);
router.route('/device/api/v1/medication/list').post(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.findAllMedication);
router.route('/device/api/v1/medication/count').post(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.getMedicationCount);
router.route('/device/api/v1/medication/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.softDeleteManyMedication);
router.route('/device/api/v1/medication/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.bulkInsertMedication);
router.route('/device/api/v1/medication/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.bulkUpdateMedication);
router.route('/device/api/v1/medication/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.deleteManyMedication);
router.route('/device/api/v1/medication/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.softDeleteMedication);
router.route('/device/api/v1/medication/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.partialUpdateMedication);
router.route('/device/api/v1/medication/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.updateMedication);    
router.route('/device/api/v1/medication/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.getMedication);
router.route('/device/api/v1/medication/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,medicationController.deleteMedication);

module.exports = router;
