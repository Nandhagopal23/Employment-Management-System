const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testDelete() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123' // Found in seed.js
        });
        const token = loginRes.data.token;
        console.log('Login successful');

        // 2. Create Dummy Employee
        console.log('Creating test employee...');
        const createRes = await axios.post(`${API_URL}/employees`, {
            first_name: 'Test',
            last_name: 'DeleteMe',
            email: `testdelete${Date.now()}@example.com`,
            phone: '1234567890',
            designation: 'Tester',
            department_id: 1, // Assuming department 1 exists
            salary: 50000,
            status: 'Active',
            joining_date: '2025-01-01'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const empId = createRes.data.id;
        console.log(`Created employee ID: ${empId}`);

        // 3. Delete Employee
        console.log(`Deleting employee ID: ${empId}...`);
        await axios.delete(`${API_URL}/employees/${empId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('DELETE SUCCESSFUL!');

    } catch (error) {
        console.error('DELETE FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

testDelete();
