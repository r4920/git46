/**
 * departmentsRoutes.js
 * @description :: CRUD API routes for departments
 */

const express = require('express');
const router = express.Router();
const departmentsController = require('../../../controller/device/v1/departmentsController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/departments/create').post(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.addDepartments);
router.route('/device/api/v1/departments/list').post(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.findAllDepartments);
router.route('/device/api/v1/departments/count').post(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.getDepartmentsCount);
router.route('/device/api/v1/departments/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.softDeleteManyDepartments);
router.route('/device/api/v1/departments/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.bulkInsertDepartments);
router.route('/device/api/v1/departments/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.bulkUpdateDepartments);
router.route('/device/api/v1/departments/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.deleteManyDepartments);
router.route('/device/api/v1/departments/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.softDeleteDepartments);
router.route('/device/api/v1/departments/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.partialUpdateDepartments);
router.route('/device/api/v1/departments/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.updateDepartments);    
router.route('/device/api/v1/departments/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.getDepartments);
router.route('/device/api/v1/departments/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,departmentsController.deleteDepartments);

module.exports = router;
