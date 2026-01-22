
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
    try {
        console.log('1. Attempting Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        console.log('Login Successful. Token:', token ? 'Received' : 'Missing');

        if (!token) {
            console.error('No token received, aborting.');
            return;
        }

        console.log('\n2. Attempting to Create Employee...');
        const employeeData = {
            first_name: 'Test',
            last_name: 'User',
            email: `test${Date.now()}@example.com`,
            salary: 50000,
            status: 'Active',
            role_id: 1 // Assuming 1 is needed or maybe handled by backend? 
            // Note: Employee model doesn't have role_id, but User does. 
            // Employee has department_id. Let's send department_id if we know one.
            // Seed created departments. Let's try sending one if we can list them.
        };

        // 2b. Fetch Departments
        console.log('2a. Fetching Departments...');
        let deptId = null;
        try {
            const deptRes = await axios.get(`${API_URL}/departments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Departments found:', deptRes.data.length);
            deptId = deptRes.data[0]?.id;
        } catch (e) {
            console.error('Failed to fetch departments:', e.message);
        }

        console.log('\n2. Attempting to Create Employee with mimic frontend data...');
        // Mimic the exact state of the form if user fills it but maybe types are strings
        const frontendPayload = {
            first_name: 'Frontend',
            last_name: 'Mimic',
            email: `frontend${Date.now()}@example.com`,
            phone: '1234567890',
            designation: 'Tester',
            salary: '60000', // String from input
            department_id: deptId ? String(deptId) : '', // String or empty
            status: 'Active'
        };

        if (deptId) {
            console.log(`Sending department_id as string: "${frontendPayload.department_id}"`);
        } else {
            console.log('No department ID found, sending empty string');
        }

        const createRes = await axios.post(`${API_URL}/employees`, frontendPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Create Employee Response:', createRes.status, createRes.data);
        console.log('✅ BACKEND ACCEPTED FRONTEND-LIKE PAYLOAD');

    } catch (error) {
        console.error('❌ FRONTEND-LIKE PAYLOAD FAILED');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testBackend();
