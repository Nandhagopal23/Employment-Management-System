const db = require('./models');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        await db.sequelize.sync({ force: true }); // Reset DB

        // Create Departments
        const departments = await db.Department.bulkCreate([
            { name: 'Engineering', description: 'Software Development', status: 'Active' },
            { name: 'HR', description: 'Human Resources', status: 'Active' },
            { name: 'Sales', description: 'Sales and Marketing', status: 'Active' }
        ]);

        console.log('Departments seeded');

        // Create Admin User (Mock)
        const adminRole = await db.Role.create({ name: 'Admin', permissions: ['ALL'] });
        const passwordHash = await bcrypt.hash('admin123', 10);
        const adminUser = await db.User.create({
            username: 'admin',
            password_hash: passwordHash,
            role_id: adminRole.id
        });

        console.log('Admin user seeded');

        // Create Employees
        await db.Employee.bulkCreate([
            {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                salary: 50000,
                department_id: departments[0].id,
                created_by: adminUser.id,
                designation: 'Software Engineer',
                status: 'Active'
            },
            {
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane@example.com',
                salary: 60000,
                department_id: departments[1].id,
                created_by: adminUser.id,
                designation: 'HR Manager',
                status: 'Active'
            },
            {
                first_name: 'Bob',
                last_name: 'Wilson',
                email: 'bob@example.com',
                salary: 75000,
                department_id: departments[0].id,
                created_by: adminUser.id,
                designation: 'Senior Developer',
                status: 'Active'
            }
        ]);

        console.log('Employees seeded');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
