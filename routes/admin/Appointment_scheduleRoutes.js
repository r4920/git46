/**
 * Appointment_scheduleRoutes.js
 * @description :: CRUD API routes for Appointment_schedule
 */

const express = require('express');
const router = express.Router();
const Appointment_scheduleController = require('../../controller/admin/Appointment_scheduleController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/appointment_schedule/create').post(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.addAppointment_schedule);
router.route('/admin/appointment_schedule/list').post(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.findAllAppointment_schedule);
router.route('/admin/appointment_schedule/count').post(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.getAppointment_scheduleCount);
router.route('/admin/appointment_schedule/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.softDeleteManyAppointment_schedule);
router.route('/admin/appointment_schedule/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.bulkInsertAppointment_schedule);
router.route('/admin/appointment_schedule/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.bulkUpdateAppointment_schedule);
router.route('/admin/appointment_schedule/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.deleteManyAppointment_schedule);
router.route('/admin/appointment_schedule/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.softDeleteAppointment_schedule);
router.route('/admin/appointment_schedule/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.partialUpdateAppointment_schedule);
router.route('/admin/appointment_schedule/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.updateAppointment_schedule);    
router.route('/admin/appointment_schedule/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.getAppointment_schedule);
router.route('/admin/appointment_schedule/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,Appointment_scheduleController.deleteAppointment_schedule);

module.exports = router;
