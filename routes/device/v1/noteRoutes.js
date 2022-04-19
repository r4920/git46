/**
 * noteRoutes.js
 * @description :: CRUD API routes for note
 */

const express = require('express');
const router = express.Router();
const noteController = require('../../../controller/device/v1/noteController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/note/create').post(auth(PLATFORM.DEVICE),checkRolePermission,noteController.addNote);
router.route('/device/api/v1/note/list').post(auth(PLATFORM.DEVICE),checkRolePermission,noteController.findAllNote);
router.route('/device/api/v1/note/count').post(auth(PLATFORM.DEVICE),checkRolePermission,noteController.getNoteCount);
router.route('/device/api/v1/note/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,noteController.softDeleteManyNote);
router.route('/device/api/v1/note/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,noteController.bulkInsertNote);
router.route('/device/api/v1/note/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,noteController.bulkUpdateNote);
router.route('/device/api/v1/note/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,noteController.deleteManyNote);
router.route('/device/api/v1/note/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,noteController.softDeleteNote);
router.route('/device/api/v1/note/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,noteController.partialUpdateNote);
router.route('/device/api/v1/note/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,noteController.updateNote);    
router.route('/device/api/v1/note/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,noteController.getNote);
router.route('/device/api/v1/note/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,noteController.deleteNote);

module.exports = router;
