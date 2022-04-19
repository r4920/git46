/**
 * CommentRoutes.js
 * @description :: CRUD API routes for Comment
 */

const express = require('express');
const router = express.Router();
const CommentController = require('../../../controller/device/v1/CommentController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/comment/create').post(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.addComment);
router.route('/device/api/v1/comment/list').post(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.findAllComment);
router.route('/device/api/v1/comment/count').post(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.getCommentCount);
router.route('/device/api/v1/comment/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.softDeleteManyComment);
router.route('/device/api/v1/comment/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.bulkInsertComment);
router.route('/device/api/v1/comment/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.bulkUpdateComment);
router.route('/device/api/v1/comment/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.deleteManyComment);
router.route('/device/api/v1/comment/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.softDeleteComment);
router.route('/device/api/v1/comment/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.partialUpdateComment);
router.route('/device/api/v1/comment/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.updateComment);    
router.route('/device/api/v1/comment/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.getComment);
router.route('/device/api/v1/comment/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,CommentController.deleteComment);

module.exports = router;
