/**
 * Chat_messageRoutes.js
 * @description :: CRUD API routes for Chat_message
 */

const express = require('express');
const router = express.Router();
const Chat_messageController = require('../../controller/admin/Chat_messageController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/chat_message/create').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.addChat_message);
router.route('/admin/chat_message/list').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.findAllChat_message);
router.route('/admin/chat_message/count').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.getChat_messageCount);
router.route('/admin/chat_message/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.softDeleteManyChat_message);
router.route('/admin/chat_message/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.bulkInsertChat_message);
router.route('/admin/chat_message/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.bulkUpdateChat_message);
router.route('/admin/chat_message/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.deleteManyChat_message);
router.route('/admin/chat_message/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.softDeleteChat_message);
router.route('/admin/chat_message/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.partialUpdateChat_message);
router.route('/admin/chat_message/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.updateChat_message);    
router.route('/admin/chat_message/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.getChat_message);
router.route('/admin/chat_message/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,Chat_messageController.deleteChat_message);

module.exports = router;
