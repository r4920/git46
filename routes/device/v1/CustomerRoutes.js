/**
 * CustomerRoutes.js
 * @description :: CRUD API routes for Customer
 */

const express = require('express');
const router = express.Router();
const CustomerController = require('../../../controller/device/v1/CustomerController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/customer/create').post(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.addCustomer);
router.route('/device/api/v1/customer/list').post(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.findAllCustomer);
router.route('/device/api/v1/customer/count').post(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.getCustomerCount);
router.route('/device/api/v1/customer/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.softDeleteManyCustomer);
router.route('/device/api/v1/customer/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.bulkInsertCustomer);
router.route('/device/api/v1/customer/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.bulkUpdateCustomer);
router.route('/device/api/v1/customer/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.deleteManyCustomer);
router.route('/device/api/v1/customer/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.softDeleteCustomer);
router.route('/device/api/v1/customer/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.partialUpdateCustomer);
router.route('/device/api/v1/customer/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.updateCustomer);    
router.route('/device/api/v1/customer/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.getCustomer);
router.route('/device/api/v1/customer/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,CustomerController.deleteCustomer);

module.exports = router;
