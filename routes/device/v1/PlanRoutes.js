/**
 * PlanRoutes.js
 * @description :: CRUD API routes for Plan
 */

const express = require('express');
const router = express.Router();
const PlanController = require('../../../controller/device/v1/PlanController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/plan/create').post(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.addPlan);
router.route('/device/api/v1/plan/list').post(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.findAllPlan);
router.route('/device/api/v1/plan/count').post(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.getPlanCount);
router.route('/device/api/v1/plan/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.softDeleteManyPlan);
router.route('/device/api/v1/plan/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.bulkInsertPlan);
router.route('/device/api/v1/plan/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.bulkUpdatePlan);
router.route('/device/api/v1/plan/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.deleteManyPlan);
router.route('/device/api/v1/plan/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.softDeletePlan);
router.route('/device/api/v1/plan/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.partialUpdatePlan);
router.route('/device/api/v1/plan/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.updatePlan);    
router.route('/device/api/v1/plan/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.getPlan);
router.route('/device/api/v1/plan/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,PlanController.deletePlan);

module.exports = router;
