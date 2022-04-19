/**
 * encounterRoutes.js
 * @description :: CRUD API routes for encounter
 */

const express = require('express');
const router = express.Router();
const encounterController = require('../../../controller/device/v1/encounterController');
const { PLATFORM } =  require('../../../constants/authConstant'); 
const auth = require('../../../middleware/auth');
const checkRolePermission = require('../../../middleware/checkRolePermission');
router.route('/device/api/v1/encounter/create').post(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.addEncounter);
router.route('/device/api/v1/encounter/list').post(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.findAllEncounter);
router.route('/device/api/v1/encounter/count').post(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.getEncounterCount);
router.route('/device/api/v1/encounter/softDeleteMany').put(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.softDeleteManyEncounter);
router.route('/device/api/v1/encounter/addBulk').post(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.bulkInsertEncounter);
router.route('/device/api/v1/encounter/updateBulk').put(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.bulkUpdateEncounter);
router.route('/device/api/v1/encounter/deleteMany').post(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.deleteManyEncounter);
router.route('/device/api/v1/encounter/softDelete/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.softDeleteEncounter);
router.route('/device/api/v1/encounter/partial-update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.partialUpdateEncounter);
router.route('/device/api/v1/encounter/update/:id').put(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.updateEncounter);    
router.route('/device/api/v1/encounter/:id').get(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.getEncounter);
router.route('/device/api/v1/encounter/delete/:id').delete(auth(PLATFORM.DEVICE),checkRolePermission,encounterController.deleteEncounter);

module.exports = router;
