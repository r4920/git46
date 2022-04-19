/**
 * enterpriseRoutes.js
 * @description :: CRUD API routes for enterprise
 */

const express = require('express');
const router = express.Router();
const enterpriseController = require('../../../controller/device/v1/enterpriseController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/enterprise/create').post(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.addEnterprise);
router.route('/device/api/v1/enterprise/list').post(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.findAllEnterprise);
router.route('/device/api/v1/enterprise/count').post(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.getEnterpriseCount);
router.route('/device/api/v1/enterprise/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.softDeleteManyEnterprise);
router.route('/device/api/v1/enterprise/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.bulkInsertEnterprise);
router.route('/device/api/v1/enterprise/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.bulkUpdateEnterprise);
router.route('/device/api/v1/enterprise/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.deleteManyEnterprise);
router.route('/device/api/v1/enterprise/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.softDeleteEnterprise);
router.route('/device/api/v1/enterprise/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.partialUpdateEnterprise);
router.route('/device/api/v1/enterprise/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.updateEnterprise);    
router.route('/device/api/v1/enterprise/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.getEnterprise);
router.route('/device/api/v1/enterprise/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,enterpriseController.deleteEnterprise);

module.exports = router;
