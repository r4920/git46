/**
 * index.js
 * @description :: exports all the models and its relationships among other models
 */

const dbConnection = require('../config/dbConnection');
const db = {};
db.sequelize = dbConnection;

db.encounter = require('./encounter');
db.departments = require('./departments');
db.enterprise = require('./enterprise');
db.note = require('./note');
db.medication = require('./medication');
db.orderItem = require('./orderItem');
db.order = require('./order');
db.patient = require('./patient');
db.Customer = require('./Customer');
db.Plan = require('./Plan');
db.Task = require('./Task');
db.Chat_message = require('./Chat_message');
db.Comment = require('./Comment');
db.Chat_group = require('./Chat_group');
db.ToDo = require('./ToDo');
db.Appointment_schedule = require('./Appointment_schedule');
db.Appointment_slot = require('./Appointment_slot');
db.Event = require('./Event');
db.Master = require('./Master');
db.Blog = require('./Blog');
db.user = require('./user');
db.userAuthSettings = require('./userAuthSettings');
db.userToken = require('./userToken');
db.role = require('./role');
db.projectRoute = require('./projectRoute');
db.routeRole = require('./routeRole');
db.userRole = require('./userRole');

db.departments.belongsTo(db.enterprise, {
  foreignKey: 'enterprises',
  as: '_enterprises',
  targetKey: 'id' 
});
db.enterprise.hasMany(db.departments, {
  foreignKey: 'enterprises',
  sourceKey: 'id' 
});
db.note.belongsTo(db.enterprise, {
  foreignKey: 'encounterId',
  as: '_encounterId',
  targetKey: 'id' 
});
db.enterprise.hasMany(db.note, {
  foreignKey: 'encounterId',
  sourceKey: 'id' 
});
db.Comment.belongsTo(db.Comment, {
  foreignKey: 'parentItem',
  as: '_parentItem',
  targetKey: 'id' 
});
db.Comment.hasMany(db.Comment, {
  foreignKey: 'parentItem',
  sourceKey: 'id' 
});
db.Chat_message.belongsTo(db.Chat_group, {
  foreignKey: 'groupId',
  as: '_groupId',
  targetKey: 'id' 
});
db.Chat_group.hasMany(db.Chat_message, {
  foreignKey: 'groupId',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.Appointment_slot, {
  foreignKey: 'slot',
  as: '_slot',
  targetKey: 'id' 
});
db.Appointment_slot.hasMany(db.Appointment_schedule, {
  foreignKey: 'slot',
  sourceKey: 'id' 
});
db.Master.belongsTo(db.Master, {
  foreignKey: 'parentId',
  as: '_parentId',
  targetKey: 'id' 
});
db.Master.hasMany(db.Master, {
  foreignKey: 'parentId',
  sourceKey: 'id' 
});
db.encounter.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.encounter, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.encounter.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.encounter, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.departments.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.departments, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.departments.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.departments, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.enterprise.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.enterprise, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.enterprise.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.enterprise, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.note.belongsTo(db.user, {
  foreignKey: 'provider',
  as: '_provider',
  targetKey: 'id' 
});
db.user.hasMany(db.note, {
  foreignKey: 'provider',
  sourceKey: 'id' 
});
db.note.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.note, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.note.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.note, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.medication.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.medication, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.medication.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.medication, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.orderItem.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.orderItem, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.orderItem.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.orderItem, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.order.belongsTo(db.user, {
  foreignKey: 'orderBy',
  as: '_orderBy',
  targetKey: 'id' 
});
db.user.hasMany(db.order, {
  foreignKey: 'orderBy',
  sourceKey: 'id' 
});
db.order.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.order, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.order.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.order, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.patient.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.patient, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.patient.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.patient, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Customer.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Customer, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Customer.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Customer, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Plan.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Plan, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Plan.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Plan, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Task.belongsTo(db.user, {
  foreignKey: 'completedBy',
  as: '_completedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Task, {
  foreignKey: 'completedBy',
  sourceKey: 'id' 
});
db.Task.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Task, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Task.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Task, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Chat_message.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Chat_message, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Chat_message.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Chat_message, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Comment.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Comment, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Comment.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Comment, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Chat_group.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Chat_group, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Chat_group.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Chat_group, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.ToDo.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.ToDo, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.ToDo.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.ToDo, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.user, {
  foreignKey: 'host',
  as: '_host',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_schedule, {
  foreignKey: 'host',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_schedule, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Appointment_schedule.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_schedule, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Appointment_slot.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_slot, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.Appointment_slot.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_slot, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Appointment_slot.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Appointment_slot, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Event.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Event, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Event.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Event, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Master.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Master, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Master.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Master, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.Blog.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Blog, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.Blog.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.Blog, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.user.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.user, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.user.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.user, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.userAuthSettings.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.userAuthSettings, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.userAuthSettings.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userAuthSettings, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.userAuthSettings.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userAuthSettings, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.userToken.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.userToken, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.userToken.belongsTo(db.user, {
  foreignKey: 'addedBy',
  as: '_addedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userToken, {
  foreignKey: 'addedBy',
  sourceKey: 'id' 
});
db.userToken.belongsTo(db.user, {
  foreignKey: 'updatedBy',
  as: '_updatedBy',
  targetKey: 'id' 
});
db.user.hasMany(db.userToken, {
  foreignKey: 'updatedBy',
  sourceKey: 'id' 
});
db.userRole.belongsTo(db.user, {
  foreignKey: 'userId',
  as: '_userId',
  targetKey: 'id' 
});
db.user.hasMany(db.userRole, {
  foreignKey: 'userId',
  sourceKey: 'id' 
});
db.routeRole.belongsTo(db.role, {
  foreignKey: 'roleId',
  as: '_roleId',
  targetKey: 'id' 
});
db.role.hasMany(db.routeRole, {
  foreignKey: 'roleId',
  sourceKey: 'id' 
});
db.userRole.belongsTo(db.role, {
  foreignKey: 'roleId',
  as: '_roleId',
  targetKey: 'id' 
});
db.role.hasMany(db.userRole, {
  foreignKey: 'roleId',
  sourceKey: 'id' 
});
db.routeRole.belongsTo(db.projectRoute, {
  foreignKey: 'routeId',
  as: '_routeId',
  targetKey: 'id' 
});
db.projectRoute.hasMany(db.routeRole, {
  foreignKey: 'routeId',
  sourceKey: 'id' 
});

module.exports = db;