/**
 * ToDo.js
 * @description :: sequelize model of database table ToDo
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let ToDo = sequelize.define('ToDo',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{ type:DataTypes.STRING },
  description:{ type:DataTypes.STRING },
  date:{ type:DataTypes.DATE },
  dueDate:{ type:DataTypes.DATE },
  isCompleted:{ type:DataTypes.BOOLEAN },
  isActive:{ type:DataTypes.BOOLEAN },
  createdAt:{ type:DataTypes.DATE },
  updatedAt:{ type:DataTypes.DATE },
  addedBy:{ type:DataTypes.INTEGER },
  updatedBy:{ type:DataTypes.INTEGER },
  isDeleted:{ type:DataTypes.BOOLEAN }
}
,{
  hooks:{
    beforeCreate: [
      async function (ToDo,options){
        ToDo.isActive = true;
        ToDo.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (ToDo,options){
        if (ToDo !== undefined && ToDo.length) { 
          for (let index = 0; index < ToDo.length; index++) { 
        
            const element = ToDo[index]; 
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
      'attribute':'date',
      'order':'DESC',
      'operator':'',
      'value':''
    }],
    'name':'index_date_index_86261'
  },{
    'using':'BTREE',
    'fields':[{
      'attribute':'dueDate',
      'order':'DESC',
      'operator':'',
      'value':''
    }],
    'name':'index_dueDate_index_692157'
  }]
}
);
ToDo.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(ToDo);
sequelizePaginate.paginate(ToDo);
module.exports = ToDo;
