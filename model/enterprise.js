/**
 * enterprise.js
 * @description :: sequelize model of database table enterprise
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Enterprise = sequelize.define('enterprise',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique:true
  },
  name:{
    type:DataTypes.STRING,
    unique:true,
    lowercase:false,
    allowNull:false,
    primaryKey:false
  },
  email:{
    type:DataTypes.STRING,
    unique:true,
    lowercase:false,
    allowNull:false,
    primaryKey:false
  },
  phone:{ type:DataTypes.STRING },
  code:{
    type:DataTypes.STRING,
    unique:true,
    lowercase:false,
    validate:{ len:[3] },
    allowNull:false,
    primaryKey:false
  },
  address:{ type:DataTypes.STRING },
  description:{ type:DataTypes.STRING },
  website:{ type:DataTypes.STRING },
  isActive:{
    type:DataTypes.BOOLEAN,
    defaultValue:true
  },
  createdAt:{
    type:DataTypes.DATE,
    defaultValue:'on create currentTime'
  },
  updatedAt:{
    type:DataTypes.DATE,
    defaultValue:'on update currentTime'
  },
  addedBy:{ type:DataTypes.INTEGER },
  updatedBy:{ type:DataTypes.INTEGER },
  isDeleted:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }
}
,{
  hooks:{
    beforeCreate: [
      async function (enterprise,options){
        enterprise.isActive = true;
        enterprise.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (enterprise,options){
        if (enterprise !== undefined && enterprise.length) { 
          for (let index = 0; index < enterprise.length; index++) { 
        
            const element = enterprise[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Enterprise.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Enterprise);
sequelizePaginate.paginate(Enterprise);
module.exports = Enterprise;
