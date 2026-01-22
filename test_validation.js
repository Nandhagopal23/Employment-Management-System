
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testInvalidData() {
    try {
        console.log('1. Attempting Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });

        const token = loginRes.data.token;
        if (!token) return;

        console.log('\n2. Attempting to Create Employee with INVALID data...');
        const invalidPayload = {
            first_name: '', // Empty required field
            last_name: 'User',
            email: 'not-an-email', // Invalid email
            department_id: 'not-a-number' // Invalid number
        };

        await axios.post(`${API_URL}/employees`, invalidPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.error('❌ FAILED: Backend accepted invalid data!');

    } catch (error) {
        if (error.response && error.response.status === 400) {
            console.log('✅ SUCCESS: Backend rejected invalid data with 400');
            console.log('Error Messages:', error.response.data.messages);
        } else {
            console.error('❌ FAILED: Unexpected error status', error.response?.status);
            console.error(error.response?.data || error.message);
        }
    }
}

testInvalidData();
