/**
 * medication.js
 * @description :: sequelize model of database table medication
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Medication = sequelize.define('medication',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  code:{ type:DataTypes.STRING },
  name:{ type:DataTypes.STRING },
  strength:{ type:DataTypes.STRING },
  unit:{ type:DataTypes.STRING },
  medForm:{ type:DataTypes.STRING },
  mfgName:{ type:DataTypes.STRING },
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
      async function (medication,options){
        medication.isActive = true;
        medication.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (medication,options){
        if (medication !== undefined && medication.length) { 
          for (let index = 0; index < medication.length; index++) { 
        
            const element = medication[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Medication.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Medication);
sequelizePaginate.paginate(Medication);
module.exports = Medication;
