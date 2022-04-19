/**
 * medicationRoutes.js
 * @description :: CRUD API routes for medication
 */

const express = require('express');
const router = express.Router();
const medicationController = require('../../controller/admin/medicationController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/medication/create').post(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.addMedication);
router.route('/admin/medication/list').post(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.findAllMedication);
router.route('/admin/medication/count').post(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.getMedicationCount);
router.route('/admin/medication/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.softDeleteManyMedication);
router.route('/admin/medication/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.bulkInsertMedication);
router.route('/admin/medication/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.bulkUpdateMedication);
router.route('/admin/medication/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.deleteManyMedication);
router.route('/admin/medication/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.softDeleteMedication);
router.route('/admin/medication/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.partialUpdateMedication);
router.route('/admin/medication/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.updateMedication);    
router.route('/admin/medication/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.getMedication);
router.route('/admin/medication/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,medicationController.deleteMedication);

module.exports = router;
