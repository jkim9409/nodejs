//User model 을 email,nickname,password 라는 attributes(속성) 가지게끔 생성해주는 명령어를 통해 만들어지는 파일
//npx sequelize model:generate --name User --attributes email:string,nickname:string,password:string
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  // userId: {
  //   primaryKey: true,
  //   type: DataTypes.INTEGER,
  // },
  // 객체를 새로 추가해 주어야 한다. 
  User.init({
    userId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    email: DataTypes.STRING,
    nickname: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};