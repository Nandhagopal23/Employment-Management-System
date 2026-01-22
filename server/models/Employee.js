'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        static associate(models) {
            Employee.belongsTo(models.Department, { foreignKey: 'department_id' });
            Employee.belongsTo(models.User, { foreignKey: 'created_by', as: 'Creator' });
            Employee.belongsTo(models.User, { foreignKey: 'user_id', as: 'Account' });
        }
    }
    Employee.init({
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING
        },
        designation: {
            type: DataTypes.STRING
        },
        salary: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive', 'OnLeave'),
            defaultValue: 'Active'
        },
        joining_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Departments',
                key: 'id'
            }
        },
        created_by: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Employee',
    });
    return Employee;
};
