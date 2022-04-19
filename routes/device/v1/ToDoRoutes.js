/**
 * ToDoRoutes.js
 * @description :: CRUD API routes for ToDo
 */

const express = require('express');
const router = express.Router();
const ToDoController = require('../../../controller/device/v1/ToDoController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/todo/create').post(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.addToDo);
router.route('/device/api/v1/todo/list').post(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.findAllToDo);
router.route('/device/api/v1/todo/count').post(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.getToDoCount);
router.route('/device/api/v1/todo/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.softDeleteManyToDo);
router.route('/device/api/v1/todo/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.bulkInsertToDo);
router.route('/device/api/v1/todo/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.bulkUpdateToDo);
router.route('/device/api/v1/todo/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.deleteManyToDo);
router.route('/device/api/v1/todo/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.softDeleteToDo);
router.route('/device/api/v1/todo/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.partialUpdateToDo);
router.route('/device/api/v1/todo/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.updateToDo);    
router.route('/device/api/v1/todo/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.getToDo);
router.route('/device/api/v1/todo/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,ToDoController.deleteToDo);

module.exports = router;
