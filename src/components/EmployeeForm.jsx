import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeForm = ({ employee, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        designation: '',
        salary: '',
        department_id: '',
        status: 'Active'
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartments();
        if (employee) {
            setFormData({
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                phone: employee.phone || '',
                designation: employee.designation,
                salary: employee.salary,
                department_id: employee.department_id,
                status: employee.status
            });
        }
    }, [employee]);

    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (err) {
            console.error('Failed to load departments');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (employee) {
                await api.put(`/employees/${employee.id}`, formData);
            } else {
                await api.post('/employees', formData);
            }
            onSave(); // Refresh parent
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'var(--pk-danger)', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>First Name</label>
                    <input className="input-field" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Last Name</label>
                    <input className="input-field" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Email</label>
                <input type="email" className="input-field" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Department</label>
                    <select className="input-field" name="department_id" value={formData.department_id} onChange={handleChange} required>
                        <option value="">Select Dept</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Designation</label>
                    <input className="input-field" name="designation" value={formData.designation} onChange={handleChange} required />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Salary</label>
                    <input type="number" className="input-field" name="salary" value={formData.salary} onChange={handleChange} required />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Status</label>
                    <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="OnLeave">On Leave</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={onCancel} className="btn" style={{ background: 'transparent', border: '1px solid var(--pk-border)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (employee ? 'Update Employee' : 'Create Employee')}
                </button>
            </div>
        </form>
    );
};

export default EmployeeForm;
