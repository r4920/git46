/**
 * Task.js
 * @description :: sequelize model of database table Task
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Task = sequelize.define('Task',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  title:{ type:DataTypes.STRING },
  description:{ type:DataTypes.STRING },
  attachments:{ type:DataTypes.STRING },
  status:{ type:DataTypes.INTEGER },
  date:{ type:DataTypes.DATE },
  dueDate:{ type:DataTypes.DATE },
  completedBy:{ type:DataTypes.INTEGER },
  completedAt:{ type:DataTypes.DATE },
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
      async function (Task,options){
        Task.isActive = true;
        Task.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Task,options){
        if (Task !== undefined && Task.length) { 
          for (let index = 0; index < Task.length; index++) { 
        
            const element = Task[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Task.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Task);
sequelizePaginate.paginate(Task);
module.exports = Task;
