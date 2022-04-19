/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

let Encounter = require('../model/encounter');
let Departments = require('../model/departments');
let Enterprise = require('../model/enterprise');
let Note = require('../model/note');
let Medication = require('../model/medication');
let OrderItem = require('../model/orderItem');
let Order = require('../model/order');
let Patient = require('../model/patient');
let Customer = require('../model/Customer');
let Plan = require('../model/Plan');
let Task = require('../model/Task');
let Chat_message = require('../model/Chat_message');
let Comment = require('../model/Comment');
let Chat_group = require('../model/Chat_group');
let ToDo = require('../model/ToDo');
let Appointment_schedule = require('../model/Appointment_schedule');
let Appointment_slot = require('../model/Appointment_slot');
let Event = require('../model/Event');
let Master = require('../model/Master');
let Blog = require('../model/Blog');
let User = require('../model/user');
let UserAuthSettings = require('../model/userAuthSettings');
let UserToken = require('../model/userToken');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('.//dbService');
const { Op } = require('sequelize');

const deleteEncounter = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Encounter,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteDepartments = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Departments,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEnterprise = async (filter) =>{
  try {
    let enterprise = await Enterprise.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (enterprise && enterprise.length){
      enterprise = enterprise.map((obj) => obj.id);

      const departmentsFilter = { [Op.or]: [{ enterprises : { [Op.in] : enterprise } }] };
      await dbService.deleteMany(Departments,departmentsFilter);

      const noteFilter = { [Op.or]: [{ encounterId : { [Op.in] : enterprise } }] };
      await dbService.deleteMany(Note,noteFilter);

      let response  = await dbService.deleteMany(Enterprise,filter);
      return response;

    } else {
      return 'No enterprise found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteNote = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Note,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteMedication = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Medication,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteOrderItem = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(OrderItem,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteOrder = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Order,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deletePatient = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Patient,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteCustomer = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Customer,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deletePlan = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Plan,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteTask = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Task,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteChat_message = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Chat_message,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteComment = async (filter) =>{
  try {
    let comment = await Comment.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (comment && comment.length){
      comment = comment.map((obj) => obj.id);

      const CommentFilter = { [Op.or]: [{ parentItem : { [Op.in] : comment } }] };
      await dbService.deleteMany(Comment,CommentFilter);

      let response  = await dbService.deleteMany(Comment,filter);
      return response;

    } else {
      return 'No Comment found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteChat_group = async (filter) =>{
  try {
    let chat_group = await Chat_group.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (chat_group && chat_group.length){
      chat_group = chat_group.map((obj) => obj.id);

      const Chat_messageFilter = { [Op.or]: [{ groupId : { [Op.in] : chat_group } }] };
      await dbService.deleteMany(Chat_message,Chat_messageFilter);

      let response  = await dbService.deleteMany(Chat_group,filter);
      return response;

    } else {
      return 'No Chat_group found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteToDo = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(ToDo,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAppointment_schedule = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Appointment_schedule,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteAppointment_slot = async (filter) =>{
  try {
    let appointment_slot = await Appointment_slot.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (appointment_slot && appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj.id);

      const Appointment_scheduleFilter = { [Op.or]: [{ slot : { [Op.in] : appointment_slot } }] };
      await dbService.deleteMany(Appointment_schedule,Appointment_scheduleFilter);

      let response  = await dbService.deleteMany(Appointment_slot,filter);
      return response;

    } else {
      return 'No Appointment_slot found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteEvent = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Event,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteMaster = async (filter) =>{
  try {
    let master = await Master.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (master && master.length){
      master = master.map((obj) => obj.id);

      const MasterFilter = { [Op.or]: [{ parentId : { [Op.in] : master } }] };
      await dbService.deleteMany(Master,MasterFilter);

      let response  = await dbService.deleteMany(Master,filter);
      return response;

    } else {
      return 'No Master found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteBlog = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(Blog,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const encounterFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Encounter,encounterFilter);

      const departmentsFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Departments,departmentsFilter);

      const enterpriseFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Enterprise,enterpriseFilter);

      const noteFilter = { [Op.or]: [{ provider : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Note,noteFilter);

      const medicationFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Medication,medicationFilter);

      const orderItemFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(OrderItem,orderItemFilter);

      const orderFilter = { [Op.or]: [{ orderBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Order,orderFilter);

      const patientFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Patient,patientFilter);

      const CustomerFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Customer,CustomerFilter);

      const PlanFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Plan,PlanFilter);

      const TaskFilter = { [Op.or]: [{ completedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Task,TaskFilter);

      const Chat_messageFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Chat_message,Chat_messageFilter);

      const CommentFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Comment,CommentFilter);

      const Chat_groupFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Chat_group,Chat_groupFilter);

      const ToDoFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(ToDo,ToDoFilter);

      const Appointment_scheduleFilter = { [Op.or]: [{ host : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Appointment_schedule,Appointment_scheduleFilter);

      const Appointment_slotFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Appointment_slot,Appointment_slotFilter);

      const EventFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Event,EventFilter);

      const MasterFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Master,MasterFilter);

      const BlogFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(Blog,BlogFilter);

      const userFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(User,userFilter);

      const userAuthSettingsFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      await dbService.deleteMany(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{ userId : { [Op.in] : user } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);

      let response  = await dbService.deleteMany(User,filter);
      return response;

    } else {
      return 'No user found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserAuthSettings = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserAuthSettings,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserToken = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserToken,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      await dbService.deleteMany(UserRole,userRoleFilter);

      let response  = await dbService.deleteMany(Role,filter);
      return response;

    } else {
      return 'No role found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ routeId : { [Op.in] : projectroute } }] };
      await dbService.deleteMany(RouteRole,routeRoleFilter);

      let response  = await dbService.deleteMany(ProjectRoute,filter);
      return response;

    } else {
      return 'No projectRoute found.';
    }

  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(RouteRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    let response  = await dbService.deleteMany(UserRole,filter);
    return response;
  } catch (error){
    throw new Error(error.message);
  }
};

const countEncounter = async (filter) =>{
  try {
    const encounterCnt =  await Encounter.count(filter);
    return { encounter : encounterCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countDepartments = async (filter) =>{
  try {
    const departmentsCnt =  await Departments.count(filter);
    return { departments : departmentsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countEnterprise = async (filter) =>{
  try {
    let enterprise = await Enterprise.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (enterprise && enterprise.length){
      enterprise = enterprise.map((obj) => obj.id);

      const departmentsFilter = { [Op.or]: [{ enterprises : { [Op.in] : enterprise } }] };
      const departmentsCnt =  await dbService.count(Departments,departmentsFilter);

      const noteFilter = { [Op.or]: [{ encounterId : { [Op.in] : enterprise } }] };
      const noteCnt =  await dbService.count(Note,noteFilter);

      let response = {
        departments : departmentsCnt,
        note : noteCnt,
      };
      return response; 
    } else {
      return {  enterprise : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countNote = async (filter) =>{
  try {
    const noteCnt =  await Note.count(filter);
    return { note : noteCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countMedication = async (filter) =>{
  try {
    const medicationCnt =  await Medication.count(filter);
    return { medication : medicationCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrderItem = async (filter) =>{
  try {
    const orderItemCnt =  await OrderItem.count(filter);
    return { orderItem : orderItemCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countOrder = async (filter) =>{
  try {
    const orderCnt =  await Order.count(filter);
    return { order : orderCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countPatient = async (filter) =>{
  try {
    const patientCnt =  await Patient.count(filter);
    return { patient : patientCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countCustomer = async (filter) =>{
  try {
    const CustomerCnt =  await Customer.count(filter);
    return { Customer : CustomerCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countPlan = async (filter) =>{
  try {
    const PlanCnt =  await Plan.count(filter);
    return { Plan : PlanCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countTask = async (filter) =>{
  try {
    const TaskCnt =  await Task.count(filter);
    return { Task : TaskCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countChat_message = async (filter) =>{
  try {
    const Chat_messageCnt =  await Chat_message.count(filter);
    return { Chat_message : Chat_messageCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countComment = async (filter) =>{
  try {
    let comment = await Comment.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (comment && comment.length){
      comment = comment.map((obj) => obj.id);

      const CommentFilter = { [Op.or]: [{ parentItem : { [Op.in] : comment } }] };
      const CommentCnt =  await dbService.count(Comment,CommentFilter);

      let response = { Comment : CommentCnt, };
      return response; 
    } else {
      return {  comment : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countChat_group = async (filter) =>{
  try {
    let chat_group = await Chat_group.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (chat_group && chat_group.length){
      chat_group = chat_group.map((obj) => obj.id);

      const Chat_messageFilter = { [Op.or]: [{ groupId : { [Op.in] : chat_group } }] };
      const Chat_messageCnt =  await dbService.count(Chat_message,Chat_messageFilter);

      let response = { Chat_message : Chat_messageCnt, };
      return response; 
    } else {
      return {  chat_group : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countToDo = async (filter) =>{
  try {
    const ToDoCnt =  await ToDo.count(filter);
    return { ToDo : ToDoCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAppointment_schedule = async (filter) =>{
  try {
    const Appointment_scheduleCnt =  await Appointment_schedule.count(filter);
    return { Appointment_schedule : Appointment_scheduleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countAppointment_slot = async (filter) =>{
  try {
    let appointment_slot = await Appointment_slot.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (appointment_slot && appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj.id);

      const Appointment_scheduleFilter = { [Op.or]: [{ slot : { [Op.in] : appointment_slot } }] };
      const Appointment_scheduleCnt =  await dbService.count(Appointment_schedule,Appointment_scheduleFilter);

      let response = { Appointment_schedule : Appointment_scheduleCnt, };
      return response; 
    } else {
      return {  appointment_slot : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countEvent = async (filter) =>{
  try {
    const EventCnt =  await Event.count(filter);
    return { Event : EventCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countMaster = async (filter) =>{
  try {
    let master = await Master.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (master && master.length){
      master = master.map((obj) => obj.id);

      const MasterFilter = { [Op.or]: [{ parentId : { [Op.in] : master } }] };
      const MasterCnt =  await dbService.count(Master,MasterFilter);

      let response = { Master : MasterCnt, };
      return response; 
    } else {
      return {  master : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countBlog = async (filter) =>{
  try {
    const BlogCnt =  await Blog.count(filter);
    return { Blog : BlogCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);

      const encounterFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const encounterCnt =  await dbService.count(Encounter,encounterFilter);

      const departmentsFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const departmentsCnt =  await dbService.count(Departments,departmentsFilter);

      const enterpriseFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const enterpriseCnt =  await dbService.count(Enterprise,enterpriseFilter);

      const noteFilter = { [Op.or]: [{ provider : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const noteCnt =  await dbService.count(Note,noteFilter);

      const medicationFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const medicationCnt =  await dbService.count(Medication,medicationFilter);

      const orderItemFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const orderItemCnt =  await dbService.count(OrderItem,orderItemFilter);

      const orderFilter = { [Op.or]: [{ orderBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const orderCnt =  await dbService.count(Order,orderFilter);

      const patientFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const patientCnt =  await dbService.count(Patient,patientFilter);

      const CustomerFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const CustomerCnt =  await dbService.count(Customer,CustomerFilter);

      const PlanFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const PlanCnt =  await dbService.count(Plan,PlanFilter);

      const TaskFilter = { [Op.or]: [{ completedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const TaskCnt =  await dbService.count(Task,TaskFilter);

      const Chat_messageFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Chat_messageCnt =  await dbService.count(Chat_message,Chat_messageFilter);

      const CommentFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const CommentCnt =  await dbService.count(Comment,CommentFilter);

      const Chat_groupFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Chat_groupCnt =  await dbService.count(Chat_group,Chat_groupFilter);

      const ToDoFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const ToDoCnt =  await dbService.count(ToDo,ToDoFilter);

      const Appointment_scheduleFilter = { [Op.or]: [{ host : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Appointment_scheduleCnt =  await dbService.count(Appointment_schedule,Appointment_scheduleFilter);

      const Appointment_slotFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const Appointment_slotCnt =  await dbService.count(Appointment_slot,Appointment_slotFilter);

      const EventFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const EventCnt =  await dbService.count(Event,EventFilter);

      const MasterFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const MasterCnt =  await dbService.count(Master,MasterFilter);

      const BlogFilter = { [Op.or]: [{ updatedBy : { [Op.in] : user } },{ addedBy : { [Op.in] : user } }] };
      const BlogCnt =  await dbService.count(Blog,BlogFilter);

      const userFilter = { [Op.or]: [{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userCnt =  await dbService.count(User,userFilter);

      const userAuthSettingsFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userAuthSettingsCnt =  await dbService.count(UserAuthSettings,userAuthSettingsFilter);

      const userTokenFilter = { [Op.or]: [{ userId : { [Op.in] : user } },{ addedBy : { [Op.in] : user } },{ updatedBy : { [Op.in] : user } }] };
      const userTokenCnt =  await dbService.count(UserToken,userTokenFilter);

      const userRoleFilter = { [Op.or]: [{ userId : { [Op.in] : user } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        encounter : encounterCnt,
        departments : departmentsCnt,
        enterprise : enterpriseCnt,
        note : noteCnt,
        medication : medicationCnt,
        orderItem : orderItemCnt,
        order : orderCnt,
        patient : patientCnt,
        Customer : CustomerCnt,
        Plan : PlanCnt,
        Task : TaskCnt,
        Chat_message : Chat_messageCnt,
        Comment : CommentCnt,
        Chat_group : Chat_groupCnt,
        ToDo : ToDoCnt,
        Appointment_schedule : Appointment_scheduleCnt,
        Appointment_slot : Appointment_slotCnt,
        Event : EventCnt,
        Master : MasterCnt,
        Blog : BlogCnt,
        user : userCnt,
        userAuthSettings : userAuthSettingsCnt,
        userToken : userTokenCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  user : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserAuthSettings = async (filter) =>{
  try {
    const userAuthSettingsCnt =  await UserAuthSettings.count(filter);
    return { userAuthSettings : userAuthSettingsCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserToken = async (filter) =>{
  try {
    const userTokenCnt =  await UserToken.count(filter);
    return { userToken : userTokenCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      const userRoleFilter = { [Op.or]: [{ roleId : { [Op.in] : role } }] };
      const userRoleCnt =  await dbService.count(UserRole,userRoleFilter);

      let response = {
        routeRole : routeRoleCnt,
        userRole : userRoleCnt,
      };
      return response; 
    } else {
      return {  role : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);

      const routeRoleFilter = { [Op.or]: [{ routeId : { [Op.in] : projectroute } }] };
      const routeRoleCnt =  await dbService.count(RouteRole,routeRoleFilter);

      let response = { routeRole : routeRoleCnt, };
      return response; 
    } else {
      return {  projectroute : 0 };
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.count(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.count(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEncounter = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Encounter.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteDepartments = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Departments.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEnterprise = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let enterprise = await Enterprise.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (enterprise && enterprise.length){
      enterprise = enterprise.map((obj) => obj.id);
      const departmentsFilter8146 = { 'enterprises': { [Op.in]: enterprise } };
      const departments9633 = await softDeleteDepartments(departmentsFilter8146,updateBody);
      const noteFilter7566 = { 'encounterId': { [Op.in]: enterprise } };
      const note2931 = await softDeleteNote(noteFilter7566,updateBody);
      return await Enterprise.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No enterprise found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteNote = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Note.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteMedication = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Medication.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrderItem = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await OrderItem.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteOrder = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Order.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePatient = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Patient.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteCustomer = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Customer.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeletePlan = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Plan.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteTask = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Task.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteChat_message = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Chat_message.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteComment = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let comment = await Comment.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (comment && comment.length){
      comment = comment.map((obj) => obj.id);
      const CommentFilter9764 = { 'parentItem': { [Op.in]: comment } };
      const Comment3399 = await softDeleteComment(CommentFilter9764,updateBody);
      return await Comment.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No Comment found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteChat_group = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let chat_group = await Chat_group.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (chat_group && chat_group.length){
      chat_group = chat_group.map((obj) => obj.id);
      const Chat_messageFilter1788 = { 'groupId': { [Op.in]: chat_group } };
      const Chat_message5497 = await softDeleteChat_message(Chat_messageFilter1788,updateBody);
      return await Chat_group.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No Chat_group found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteToDo = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await ToDo.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAppointment_schedule = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Appointment_schedule.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteAppointment_slot = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let appointment_slot = await Appointment_slot.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (appointment_slot && appointment_slot.length){
      appointment_slot = appointment_slot.map((obj) => obj.id);
      const Appointment_scheduleFilter2569 = { 'slot': { [Op.in]: appointment_slot } };
      const Appointment_schedule7725 = await softDeleteAppointment_schedule(Appointment_scheduleFilter2569,updateBody);
      return await Appointment_slot.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No Appointment_slot found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteEvent = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Event.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteMaster = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let master = await Master.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (master && master.length){
      master = master.map((obj) => obj.id);
      const MasterFilter3100 = { 'parentId': { [Op.in]: master } };
      const Master6646 = await softDeleteMaster(MasterFilter3100,updateBody);
      return await Master.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No Master found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteBlog = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await Blog.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let user = await User.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (user && user.length){
      user = user.map((obj) => obj.id);
      const encounterFilter8712 = { 'addedBy': { [Op.in]: user } };
      const encounter6126 = await softDeleteEncounter(encounterFilter8712,updateBody);
      const encounterFilter7553 = { 'updatedBy': { [Op.in]: user } };
      const encounter4017 = await softDeleteEncounter(encounterFilter7553,updateBody);
      const departmentsFilter3427 = { 'addedBy': { [Op.in]: user } };
      const departments1596 = await softDeleteDepartments(departmentsFilter3427,updateBody);
      const departmentsFilter8799 = { 'updatedBy': { [Op.in]: user } };
      const departments9871 = await softDeleteDepartments(departmentsFilter8799,updateBody);
      const enterpriseFilter3858 = { 'addedBy': { [Op.in]: user } };
      const enterprise6805 = await softDeleteEnterprise(enterpriseFilter3858,updateBody);
      const enterpriseFilter7965 = { 'updatedBy': { [Op.in]: user } };
      const enterprise5456 = await softDeleteEnterprise(enterpriseFilter7965,updateBody);
      const noteFilter5314 = { 'provider': { [Op.in]: user } };
      const note7323 = await softDeleteNote(noteFilter5314,updateBody);
      const noteFilter9613 = { 'addedBy': { [Op.in]: user } };
      const note6609 = await softDeleteNote(noteFilter9613,updateBody);
      const noteFilter1572 = { 'updatedBy': { [Op.in]: user } };
      const note3524 = await softDeleteNote(noteFilter1572,updateBody);
      const medicationFilter6785 = { 'addedBy': { [Op.in]: user } };
      const medication4716 = await softDeleteMedication(medicationFilter6785,updateBody);
      const medicationFilter4544 = { 'updatedBy': { [Op.in]: user } };
      const medication3429 = await softDeleteMedication(medicationFilter4544,updateBody);
      const orderItemFilter9866 = { 'addedBy': { [Op.in]: user } };
      const orderItem2455 = await softDeleteOrderItem(orderItemFilter9866,updateBody);
      const orderItemFilter3826 = { 'updatedBy': { [Op.in]: user } };
      const orderItem6519 = await softDeleteOrderItem(orderItemFilter3826,updateBody);
      const orderFilter8574 = { 'orderBy': { [Op.in]: user } };
      const order5056 = await softDeleteOrder(orderFilter8574,updateBody);
      const orderFilter4915 = { 'addedBy': { [Op.in]: user } };
      const order2240 = await softDeleteOrder(orderFilter4915,updateBody);
      const orderFilter5406 = { 'updatedBy': { [Op.in]: user } };
      const order0529 = await softDeleteOrder(orderFilter5406,updateBody);
      const patientFilter6360 = { 'addedBy': { [Op.in]: user } };
      const patient8898 = await softDeletePatient(patientFilter6360,updateBody);
      const patientFilter2353 = { 'updatedBy': { [Op.in]: user } };
      const patient9160 = await softDeletePatient(patientFilter2353,updateBody);
      const CustomerFilter4164 = { 'addedBy': { [Op.in]: user } };
      const Customer9239 = await softDeleteCustomer(CustomerFilter4164,updateBody);
      const CustomerFilter9256 = { 'updatedBy': { [Op.in]: user } };
      const Customer9712 = await softDeleteCustomer(CustomerFilter9256,updateBody);
      const PlanFilter9637 = { 'updatedBy': { [Op.in]: user } };
      const Plan8666 = await softDeletePlan(PlanFilter9637,updateBody);
      const PlanFilter4017 = { 'addedBy': { [Op.in]: user } };
      const Plan7875 = await softDeletePlan(PlanFilter4017,updateBody);
      const TaskFilter9785 = { 'completedBy': { [Op.in]: user } };
      const Task5280 = await softDeleteTask(TaskFilter9785,updateBody);
      const TaskFilter3871 = { 'updatedBy': { [Op.in]: user } };
      const Task7595 = await softDeleteTask(TaskFilter3871,updateBody);
      const TaskFilter0905 = { 'addedBy': { [Op.in]: user } };
      const Task4620 = await softDeleteTask(TaskFilter0905,updateBody);
      const Chat_messageFilter3494 = { 'updatedBy': { [Op.in]: user } };
      const Chat_message5403 = await softDeleteChat_message(Chat_messageFilter3494,updateBody);
      const Chat_messageFilter0249 = { 'addedBy': { [Op.in]: user } };
      const Chat_message9086 = await softDeleteChat_message(Chat_messageFilter0249,updateBody);
      const CommentFilter4167 = { 'updatedBy': { [Op.in]: user } };
      const Comment4992 = await softDeleteComment(CommentFilter4167,updateBody);
      const CommentFilter2319 = { 'addedBy': { [Op.in]: user } };
      const Comment9300 = await softDeleteComment(CommentFilter2319,updateBody);
      const Chat_groupFilter4933 = { 'updatedBy': { [Op.in]: user } };
      const Chat_group2778 = await softDeleteChat_group(Chat_groupFilter4933,updateBody);
      const Chat_groupFilter1247 = { 'addedBy': { [Op.in]: user } };
      const Chat_group4452 = await softDeleteChat_group(Chat_groupFilter1247,updateBody);
      const ToDoFilter5127 = { 'addedBy': { [Op.in]: user } };
      const ToDo0825 = await softDeleteToDo(ToDoFilter5127,updateBody);
      const ToDoFilter8944 = { 'updatedBy': { [Op.in]: user } };
      const ToDo5817 = await softDeleteToDo(ToDoFilter8944,updateBody);
      const Appointment_scheduleFilter8526 = { 'host': { [Op.in]: user } };
      const Appointment_schedule3421 = await softDeleteAppointment_schedule(Appointment_scheduleFilter8526,updateBody);
      const Appointment_scheduleFilter6868 = { 'updatedBy': { [Op.in]: user } };
      const Appointment_schedule8603 = await softDeleteAppointment_schedule(Appointment_scheduleFilter6868,updateBody);
      const Appointment_scheduleFilter5578 = { 'addedBy': { [Op.in]: user } };
      const Appointment_schedule6753 = await softDeleteAppointment_schedule(Appointment_scheduleFilter5578,updateBody);
      const Appointment_slotFilter5947 = { 'userId': { [Op.in]: user } };
      const Appointment_slot6192 = await softDeleteAppointment_slot(Appointment_slotFilter5947,updateBody);
      const Appointment_slotFilter9659 = { 'updatedBy': { [Op.in]: user } };
      const Appointment_slot1310 = await softDeleteAppointment_slot(Appointment_slotFilter9659,updateBody);
      const Appointment_slotFilter3222 = { 'addedBy': { [Op.in]: user } };
      const Appointment_slot5244 = await softDeleteAppointment_slot(Appointment_slotFilter3222,updateBody);
      const EventFilter3631 = { 'updatedBy': { [Op.in]: user } };
      const Event1149 = await softDeleteEvent(EventFilter3631,updateBody);
      const EventFilter6773 = { 'addedBy': { [Op.in]: user } };
      const Event9698 = await softDeleteEvent(EventFilter6773,updateBody);
      const MasterFilter4858 = { 'updatedBy': { [Op.in]: user } };
      const Master4138 = await softDeleteMaster(MasterFilter4858,updateBody);
      const MasterFilter9586 = { 'addedBy': { [Op.in]: user } };
      const Master5911 = await softDeleteMaster(MasterFilter9586,updateBody);
      const BlogFilter2779 = { 'updatedBy': { [Op.in]: user } };
      const Blog0733 = await softDeleteBlog(BlogFilter2779,updateBody);
      const BlogFilter0318 = { 'addedBy': { [Op.in]: user } };
      const Blog5876 = await softDeleteBlog(BlogFilter0318,updateBody);
      const userFilter0597 = { 'addedBy': { [Op.in]: user } };
      const user0548 = await softDeleteUser(userFilter0597,updateBody);
      const userFilter2457 = { 'updatedBy': { [Op.in]: user } };
      const user7694 = await softDeleteUser(userFilter2457,updateBody);
      const userAuthSettingsFilter3626 = { 'userId': { [Op.in]: user } };
      const userAuthSettings1089 = await softDeleteUserAuthSettings(userAuthSettingsFilter3626,updateBody);
      const userAuthSettingsFilter4218 = { 'addedBy': { [Op.in]: user } };
      const userAuthSettings3034 = await softDeleteUserAuthSettings(userAuthSettingsFilter4218,updateBody);
      const userAuthSettingsFilter7308 = { 'updatedBy': { [Op.in]: user } };
      const userAuthSettings1964 = await softDeleteUserAuthSettings(userAuthSettingsFilter7308,updateBody);
      const userTokenFilter2593 = { 'userId': { [Op.in]: user } };
      const userToken2343 = await softDeleteUserToken(userTokenFilter2593,updateBody);
      const userTokenFilter4906 = { 'addedBy': { [Op.in]: user } };
      const userToken4270 = await softDeleteUserToken(userTokenFilter4906,updateBody);
      const userTokenFilter9380 = { 'updatedBy': { [Op.in]: user } };
      const userToken6349 = await softDeleteUserToken(userTokenFilter9380,updateBody);
      const userRoleFilter4375 = { 'userId': { [Op.in]: user } };
      const userRole5520 = await softDeleteUserRole(userRoleFilter4375,updateBody);
      return await User.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No user found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserAuthSettings = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserAuthSettings.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserToken = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserToken.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let role = await Role.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (role && role.length){
      role = role.map((obj) => obj.id);
      const routeRoleFilter8646 = { 'roleId': { [Op.in]: role } };
      const routeRole9260 = await softDeleteRouteRole(routeRoleFilter8646,updateBody);
      const userRoleFilter8359 = { 'roleId': { [Op.in]: role } };
      const userRole9051 = await softDeleteUserRole(userRoleFilter8359,updateBody);
      return await Role.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No role found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter,updateBody, defaultValues = {}) =>{
  try {
    let projectroute = await ProjectRoute.findAll({
      where:filter,
      attributes:{ include:'id' }
    });
    if (projectroute && projectroute.length){
      projectroute = projectroute.map((obj) => obj.id);
      const routeRoleFilter8870 = { 'routeId': { [Op.in]: projectroute } };
      const routeRole0297 = await softDeleteRouteRole(routeRoleFilter8870,updateBody);
      return await ProjectRoute.update({
        ...updateBody,
        ...defaultValues
      },{ where: filter });
    } else {
      return 'No projectRoute found.';
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await RouteRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter,updateBody, defaultValues = {}) =>{
  try {
    return await UserRole.update({
      ...updateBody,
      ...defaultValues
    },{ where: filter });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteEncounter,
  deleteDepartments,
  deleteEnterprise,
  deleteNote,
  deleteMedication,
  deleteOrderItem,
  deleteOrder,
  deletePatient,
  deleteCustomer,
  deletePlan,
  deleteTask,
  deleteChat_message,
  deleteComment,
  deleteChat_group,
  deleteToDo,
  deleteAppointment_schedule,
  deleteAppointment_slot,
  deleteEvent,
  deleteMaster,
  deleteBlog,
  deleteUser,
  deleteUserAuthSettings,
  deleteUserToken,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countEncounter,
  countDepartments,
  countEnterprise,
  countNote,
  countMedication,
  countOrderItem,
  countOrder,
  countPatient,
  countCustomer,
  countPlan,
  countTask,
  countChat_message,
  countComment,
  countChat_group,
  countToDo,
  countAppointment_schedule,
  countAppointment_slot,
  countEvent,
  countMaster,
  countBlog,
  countUser,
  countUserAuthSettings,
  countUserToken,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteEncounter,
  softDeleteDepartments,
  softDeleteEnterprise,
  softDeleteNote,
  softDeleteMedication,
  softDeleteOrderItem,
  softDeleteOrder,
  softDeletePatient,
  softDeleteCustomer,
  softDeletePlan,
  softDeleteTask,
  softDeleteChat_message,
  softDeleteComment,
  softDeleteChat_group,
  softDeleteToDo,
  softDeleteAppointment_schedule,
  softDeleteAppointment_slot,
  softDeleteEvent,
  softDeleteMaster,
  softDeleteBlog,
  softDeleteUser,
  softDeleteUserAuthSettings,
  softDeleteUserToken,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
