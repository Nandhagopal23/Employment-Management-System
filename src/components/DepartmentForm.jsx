import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DepartmentForm = ({ department, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name,
                description: department.description || '',
                status: department.status
            });
        }
    }, [department]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (department) {
                await api.put(`/departments/${department.id}`, formData);
            } else {
                await api.post('/departments', formData);
            }
            onSave();
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'var(--pk-danger)', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Department Name</label>
                <input className="input-field" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Description</label>
                <textarea
                    className="input-field"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Status</label>
                <select className="input-field" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={onCancel} className="btn" style={{ background: 'transparent', border: '1px solid var(--pk-border)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (department ? 'Update Dept' : 'Create Dept')}
                </button>
            </div>
        </form>
    );
};

export default DepartmentForm;
