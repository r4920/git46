/**
 * Appointment_schedule.js
 * @description :: sequelize model of database table Appointment_schedule
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Appointment_schedule = sequelize.define('Appointment_schedule',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  slot:{ type:DataTypes.INTEGER },
  startTime:{ type:DataTypes.DATE },
  endTime:{ type:DataTypes.DATE },
  date:{ type:DataTypes.DATE },
  offset:{ type:DataTypes.INTEGER },
  participant:{ type:DataTypes.STRING },
  host:{ type:DataTypes.INTEGER },
  isCancelled:{ type:DataTypes.BOOLEAN },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DataTypes.DATE },
  updatedAt:{ type:DataTypes.DATE },
  updatedBy:{ type:DataTypes.INTEGER },
  addedBy:{ type:DataTypes.INTEGER },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (Appointment_schedule,options){
        Appointment_schedule.isActive = true;
        Appointment_schedule.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Appointment_schedule,options){
        if (Appointment_schedule !== undefined && Appointment_schedule.length) { 
          for (let index = 0; index < Appointment_schedule.length; index++) { 
        
            const element = Appointment_schedule[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Appointment_schedule.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Appointment_schedule);
sequelizePaginate.paginate(Appointment_schedule);
module.exports = Appointment_schedule;
