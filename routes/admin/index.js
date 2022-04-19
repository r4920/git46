/**
 * index route file of admin platform.
 * @description: exports all routes of admin platform.
 */
const express =  require('express');
const router =  express.Router();
router.use('/admin/auth',require('./auth'));
router.use(require('./encounterRoutes'));
router.use(require('./departmentsRoutes'));
router.use(require('./enterpriseRoutes'));
router.use(require('./noteRoutes'));
router.use(require('./medicationRoutes'));
router.use(require('./orderItemRoutes'));
router.use(require('./orderRoutes'));
router.use(require('./patientRoutes'));
router.use(require('./CustomerRoutes'));
router.use(require('./PlanRoutes'));
router.use(require('./TaskRoutes'));
router.use(require('./Chat_messageRoutes'));
router.use(require('./CommentRoutes'));
router.use(require('./Chat_groupRoutes'));
router.use(require('./ToDoRoutes'));
router.use(require('./Appointment_scheduleRoutes'));
router.use(require('./Appointment_slotRoutes'));
router.use(require('./EventRoutes'));
router.use(require('./MasterRoutes'));
router.use(require('./BlogRoutes'));
router.use(require('./userRoutes'));
router.use(require('./roleRoutes'));
router.use(require('./projectRouteRoutes'));
router.use(require('./routeRoleRoutes'));
router.use(require('./userRoleRoutes'));

module.exports = router;
