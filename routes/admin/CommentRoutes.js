/**
 * CommentRoutes.js
 * @description :: CRUD API routes for Comment
 */

const express = require('express');
const router = express.Router();
const CommentController = require('../../controller/admin/CommentController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/comment/create').post(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.addComment);
router.route('/admin/comment/list').post(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.findAllComment);
router.route('/admin/comment/count').post(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.getCommentCount);
router.route('/admin/comment/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.softDeleteManyComment);
router.route('/admin/comment/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.bulkInsertComment);
router.route('/admin/comment/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.bulkUpdateComment);
router.route('/admin/comment/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.deleteManyComment);
router.route('/admin/comment/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.softDeleteComment);
router.route('/admin/comment/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.partialUpdateComment);
router.route('/admin/comment/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.updateComment);    
router.route('/admin/comment/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.getComment);
router.route('/admin/comment/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,CommentController.deleteComment);

module.exports = router;
