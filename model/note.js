/**
 * note.js
 * @description :: sequelize model of database table note
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Note = sequelize.define('note',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  _id:{ type:DataTypes.STRING },
  encounterId:{ type:DataTypes.INTEGER },
  provider:{ type:DataTypes.INTEGER },
  text:{
    type:DataTypes.STRING,
    unique:false,
    lowercase:false,
    allowNull:false,
    primaryKey:false
  },
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
    defaultValue:true
  }
}
,{
  hooks:{
    beforeCreate: [
      async function (note,options){
        note.isActive = true;
        note.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (note,options){
        if (note !== undefined && note.length) { 
          for (let index = 0; index < note.length; index++) { 
        
            const element = note[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Note.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Note);
sequelizePaginate.paginate(Note);
module.exports = Note;
