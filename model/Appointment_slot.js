/**
 * Appointment_slot.js
 * @description :: sequelize model of database table Appointment_slot
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Appointment_slot = sequelize.define('Appointment_slot',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  startTime:{ type:DataTypes.DATE },
  endTime:{ type:DataTypes.DATE },
  offset:{ type:DataTypes.INTEGER },
  appliedFrom:{ type:DataTypes.DATE },
  appliedTo:{ type:DataTypes.DATE },
  userId:{ type:DataTypes.INTEGER },
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
      async function (Appointment_slot,options){
        Appointment_slot.isActive = true;
        Appointment_slot.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Appointment_slot,options){
        if (Appointment_slot !== undefined && Appointment_slot.length) { 
          for (let index = 0; index < Appointment_slot.length; index++) { 
        
            const element = Appointment_slot[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
  ,indexes:  [{
    'using':'BTREE',
    'fields':[{
      'attribute':'startTime',
      'order':'DESC',
      'operator':'',
      'value':''
    }],
    'name':'index_startTime_index_256094'
  }]
}
);
Appointment_slot.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Appointment_slot);
sequelizePaginate.paginate(Appointment_slot);
module.exports = Appointment_slot;
