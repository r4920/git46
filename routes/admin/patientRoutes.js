/**
 * patientRoutes.js
 * @description :: CRUD API routes for patient
 */

const express = require('express');
const router = express.Router();
const patientController = require('../../controller/admin/patientController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/patient/create').post(auth(PLATFORM.ADMIN),checkRolePermission,patientController.addPatient);
router.route('/admin/patient/list').post(auth(PLATFORM.ADMIN),checkRolePermission,patientController.findAllPatient);
router.route('/admin/patient/count').post(auth(PLATFORM.ADMIN),checkRolePermission,patientController.getPatientCount);
router.route('/admin/patient/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,patientController.softDeleteManyPatient);
router.route('/admin/patient/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,patientController.bulkInsertPatient);
router.route('/admin/patient/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,patientController.bulkUpdatePatient);
router.route('/admin/patient/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,patientController.deleteManyPatient);
router.route('/admin/patient/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,patientController.softDeletePatient);
router.route('/admin/patient/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,patientController.partialUpdatePatient);
router.route('/admin/patient/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,patientController.updatePatient);    
router.route('/admin/patient/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,patientController.getPatient);
router.route('/admin/patient/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,patientController.deletePatient);

module.exports = router;
