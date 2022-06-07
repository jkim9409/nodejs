//User model 을 email,nickname,password 라는 attributes(속성) 가지게끔 생성해주는 명령어를 통해 만들어지는 파일
//npx sequelize model:generate --name User --attributes email:string,nickname:string,password:string
'use strict'
// id 로 지정되어있는 attribute 값을 우리 코드에 맞게 userId 로 바꾸어준다

// createdAt, updatedAt 등은 sequealize 가 자동으로 다뤄주니 없다고 생각해도 된다.
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
                type: Sequelize.STRING,
            },
            nickname: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users')
    },
}
