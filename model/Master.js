/**
 * Master.js
 * @description :: sequelize model of database table Master
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Master = sequelize.define('Master',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{ type:DataTypes.STRING },
  slug:{ type:DataTypes.STRING },
  code:{ type:DataTypes.STRING },
  group:{ type:DataTypes.STRING },
  description:{ type:DataTypes.STRING },
  sequence:{ type:DataTypes.INTEGER },
  image:{ type:DataTypes.STRING },
  parentId:{ type:DataTypes.INTEGER },
  parentCode:{ type:DataTypes.BOOLEAN },
  isDefault:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DataTypes.DATE },
  updatedAt:{ type:DataTypes.DATE },
  updatedBy:{ type:DataTypes.INTEGER },
  addedBy:{ type:DataTypes.INTEGER }
}
,{
  hooks:{
    beforeCreate: [
      async function (Master,options){
        Master.isActive = true;
        Master.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Master,options){
        if (Master !== undefined && Master.length) { 
          for (let index = 0; index < Master.length; index++) { 
        
            const element = Master[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Master.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Master);
sequelizePaginate.paginate(Master);
module.exports = Master;
