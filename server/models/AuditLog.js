'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class AuditLog extends Model {
        static associate(models) {
            AuditLog.belongsTo(models.User, { foreignKey: 'performed_by', as: 'Actor' });
        }
    }
    AuditLog.init({
        action: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entity_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entity_id: {
            type: DataTypes.INTEGER
        },
        performed_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        details: {
            type: DataTypes.JSON
        }
    }, {
        sequelize,
        modelName: 'AuditLog',
    });
    return AuditLog;
};
