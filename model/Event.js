/**
 * Event.js
 * @description :: sequelize model of database table Event
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Event = sequelize.define('Event',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{ type:DataTypes.STRING },
  description:{ type:DataTypes.STRING },
  address_line1:{ type:DataTypes.STRING },
  address_line2:{ type:DataTypes.STRING },
  address_city:{ type:DataTypes.STRING },
  address_country:{ type:DataTypes.STRING },
  address_state:{ type:DataTypes.STRING },
  address_pincode:{ type:DataTypes.STRING },
  address_lat:{ type:DataTypes.INTEGER },
  address_lng:{ type:DataTypes.INTEGER },
  startDateTime:{ type:DataTypes.DATE },
  endDateTime:{ type:DataTypes.DATE },
  speakers_name:{ type:DataTypes.STRING },
  speakers_image:{ type:DataTypes.STRING },
  speakers_email:{ type:DataTypes.STRING },
  organizer_name:{ type:DataTypes.STRING },
  organizer_image:{ type:DataTypes.STRING },
  organizer_email:{ type:DataTypes.STRING },
  organizer_url:{ type:DataTypes.STRING },
  image:{ type:DataTypes.STRING },
  attachments:{ type:DataTypes.STRING },
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
      async function (Event,options){
        Event.isActive = true;
        Event.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Event,options){
        if (Event !== undefined && Event.length) { 
          for (let index = 0; index < Event.length; index++) { 
        
            const element = Event[index]; 
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
      'attribute':'name',
      'order':'ASC',
      'length':10,
      'operator':'',
      'value':''
    }],
    'name':'index_name_index_890772'
  }]
}
);
Event.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Event);
sequelizePaginate.paginate(Event);
module.exports = Event;
