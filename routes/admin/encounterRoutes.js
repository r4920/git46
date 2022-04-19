/**
 * encounterRoutes.js
 * @description :: CRUD API routes for encounter
 */

const express = require('express');
const router = express.Router();
const encounterController = require('../../controller/admin/encounterController');
const { PLATFORM } =  require('../../constants/authConstant'); 
const auth = require('../../middleware/auth');
const checkRolePermission = require('../../middleware/checkRolePermission');
router.route('/admin/encounter/create').post(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.addEncounter);
router.route('/admin/encounter/list').post(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.findAllEncounter);
router.route('/admin/encounter/count').post(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.getEncounterCount);
router.route('/admin/encounter/softDeleteMany').put(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.softDeleteManyEncounter);
router.route('/admin/encounter/addBulk').post(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.bulkInsertEncounter);
router.route('/admin/encounter/updateBulk').put(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.bulkUpdateEncounter);
router.route('/admin/encounter/deleteMany').post(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.deleteManyEncounter);
router.route('/admin/encounter/softDelete/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.softDeleteEncounter);
router.route('/admin/encounter/partial-update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.partialUpdateEncounter);
router.route('/admin/encounter/update/:id').put(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.updateEncounter);    
router.route('/admin/encounter/:id').get(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.getEncounter);
router.route('/admin/encounter/delete/:id').delete(auth(PLATFORM.ADMIN),checkRolePermission,encounterController.deleteEncounter);

module.exports = router;
