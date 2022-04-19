/**
 * Chat_message.js
 * @description :: sequelize model of database table Chat_message
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Chat_message = sequelize.define('Chat_message',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  message:{
    type:DataTypes.STRING,
    allowNull:false
  },
  sender:{
    type:DataTypes.STRING,
    allowNull:false
  },
  recipient:{
    type:DataTypes.STRING,
    allowNull:false
  },
  groupId:{ type:DataTypes.INTEGER },
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
      async function (Chat_message,options){
        Chat_message.isActive = true;
        Chat_message.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Chat_message,options){
        if (Chat_message !== undefined && Chat_message.length) { 
          for (let index = 0; index < Chat_message.length; index++) { 
        
            const element = Chat_message[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Chat_message.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Chat_message);
sequelizePaginate.paginate(Chat_message);
module.exports = Chat_message;
