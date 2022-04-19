/**
 * Chat_groupRoutes.js
 * @description :: CRUD API routes for Chat_group
 */

const express = require('express');
const router = express.Router();
const Chat_groupController = require('../../controller/admin/Chat_groupController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/chat_group/create').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.addChat_group);
router.route('/admin/chat_group/list').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.findAllChat_group);
router.route('/admin/chat_group/count').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.getChat_groupCount);
router.route('/admin/chat_group/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.softDeleteManyChat_group);
router.route('/admin/chat_group/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.bulkInsertChat_group);
router.route('/admin/chat_group/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.bulkUpdateChat_group);
router.route('/admin/chat_group/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.deleteManyChat_group);
router.route('/admin/chat_group/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.softDeleteChat_group);
router.route('/admin/chat_group/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.partialUpdateChat_group);
router.route('/admin/chat_group/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.updateChat_group);    
router.route('/admin/chat_group/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.getChat_group);
router.route('/admin/chat_group/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,Chat_groupController.deleteChat_group);

module.exports = router;
