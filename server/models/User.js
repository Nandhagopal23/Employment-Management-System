'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Role, { foreignKey: 'role_id' });
            User.hasMany(models.Employee, { foreignKey: 'created_by', as: 'CreatedEmployees' });
            User.hasOne(models.Employee, { foreignKey: 'user_id', as: 'Profile' });
        }
    }
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Roles',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
