const { Employee, Department, User, sequelize } = require('../models');
const { Parser } = require('json2csv');

class ReportService {
    async getSalaryStats() {
        // Aggregation: Average, Min, Max, Total Salary by Department
        const stats = await Employee.findAll({
            attributes: [
                'department_id',
                [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'employeeCount'],
                [sequelize.fn('SUM', sequelize.col('salary')), 'totalSalary'],
                [sequelize.fn('AVG', sequelize.col('salary')), 'avgSalary'],
                [sequelize.fn('MIN', sequelize.col('salary')), 'minSalary'],
                [sequelize.fn('MAX', sequelize.col('salary')), 'maxSalary']
            ],
            include: [{
                model: Department,
                attributes: ['name']
            }],
            group: ['department_id', 'Department.id', 'Department.name'] // Group by must match selected columns in some dialects
        });

        return stats;
    }

    async generateEmployeeCSV() {
        const employees = await Employee.findAll({
            include: [
                { model: Department, attributes: ['name'] },
                { model: User, as: 'Creator', attributes: ['username'] }
            ],
            raw: true // Get plain JSON
        });

        // Remap for CSV readability
        const data = employees.map(e => ({
            ID: e.id,
            FirstName: e.first_name,
            LastName: e.last_name,
            Email: e.email,
            Phone: e.phone,
            Designation: e.designation,
            Department: e['Department.name'], // Flattened by raw: true
            Salary: e.salary,
            Status: e.status,
            JoiningDate: e.joining_date,
            CreatedBy: e['Creator.username']
        }));

        const fields = ['ID', 'FirstName', 'LastName', 'Email', 'Phone', 'Designation', 'Department', 'Salary', 'Status', 'JoiningDate', 'CreatedBy'];
        const parser = new Parser({ fields });
        return parser.parse(data);
    }
}

module.exports = new ReportService();
