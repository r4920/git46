/**
 * CustomerRoutes.js
 * @description :: CRUD API routes for Customer
 */

const express = require('express');
const router = express.Router();
const CustomerController = require('../../controller/admin/CustomerController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/customer/create').post(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.addCustomer);
router.route('/admin/customer/list').post(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.findAllCustomer);
router.route('/admin/customer/count').post(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.getCustomerCount);
router.route('/admin/customer/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.softDeleteManyCustomer);
router.route('/admin/customer/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.bulkInsertCustomer);
router.route('/admin/customer/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.bulkUpdateCustomer);
router.route('/admin/customer/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.deleteManyCustomer);
router.route('/admin/customer/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.softDeleteCustomer);
router.route('/admin/customer/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.partialUpdateCustomer);
router.route('/admin/customer/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.updateCustomer);    
router.route('/admin/customer/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.getCustomer);
router.route('/admin/customer/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,CustomerController.deleteCustomer);

module.exports = router;
