'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.hasMany(models.User, { foreignKey: 'role_id' });
        }
    }
    Role.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        permissions: {
            type: DataTypes.JSON, // Array of permission strings
            defaultValue: []
        }
    }, {
        sequelize,
        modelName: 'Role',
    });
    return Role;
};
