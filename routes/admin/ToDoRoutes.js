/**
 * ToDoRoutes.js
 * @description :: CRUD API routes for ToDo
 */

const express = require('express');
const router = express.Router();
const ToDoController = require('../../controller/admin/ToDoController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/todo/create').post(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.addToDo);
router.route('/admin/todo/list').post(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.findAllToDo);
router.route('/admin/todo/count').post(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.getToDoCount);
router.route('/admin/todo/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.softDeleteManyToDo);
router.route('/admin/todo/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.bulkInsertToDo);
router.route('/admin/todo/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.bulkUpdateToDo);
router.route('/admin/todo/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.deleteManyToDo);
router.route('/admin/todo/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.softDeleteToDo);
router.route('/admin/todo/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.partialUpdateToDo);
router.route('/admin/todo/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.updateToDo);    
router.route('/admin/todo/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.getToDo);
router.route('/admin/todo/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,ToDoController.deleteToDo);

module.exports = router;
