/**
 * Chat_group.js
 * @description :: sequelize model of database table Chat_group
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Chat_group = sequelize.define('Chat_group',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  code:{
    type:DataTypes.STRING,
    allowNull:false
  },
  member:{ type:DataTypes.STRING },
  admin:{
    type:DataTypes.STRING,
    allowNull:false
  },
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
      async function (Chat_group,options){
        Chat_group.isActive = true;
        Chat_group.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Chat_group,options){
        if (Chat_group !== undefined && Chat_group.length) { 
          for (let index = 0; index < Chat_group.length; index++) { 
        
            const element = Chat_group[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Chat_group.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Chat_group);
sequelizePaginate.paginate(Chat_group);
module.exports = Chat_group;
