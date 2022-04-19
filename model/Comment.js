/**
 * Comment.js
 * @description :: sequelize model of database table Comment
 */

const {
  DataTypes, Op 
} = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');
const sequelizeTransforms = require('sequelize-transforms');
const { convertObjectToEnum } = require('../utils/common');
let Comment = sequelize.define('Comment',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  comment:{ type:DataTypes.STRING },
  upvoteCount:{ type:DataTypes.INTEGER },
  downVoteCount:{ type:DataTypes.INTEGER },
  commentTime:{ type:DataTypes.DATE },
  parentItem:{ type:DataTypes.INTEGER },
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
      async function (Comment,options){
        Comment.isActive = true;
        Comment.isDeleted = false;

      },
    ],
    beforeBulkCreate: [
      async function (Comment,options){
        if (Comment !== undefined && Comment.length) { 
          for (let index = 0; index < Comment.length; index++) { 
        
            const element = Comment[index]; 
            element.isActive = true; 
            element.isDeleted = false; 
  
          } 
        }
      },
    ],
  }
}
);
Comment.prototype.toJSON = function () {
  let values = Object.assign({}, this.get());
  return values;
};
sequelizeTransforms(Comment);
sequelizePaginate.paginate(Comment);
module.exports = Comment;
