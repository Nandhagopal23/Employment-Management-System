import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', phone: '' });

    useEffect(() => {
        if (user?.employeeId) {
            fetchEmployeeData();
        }
    }, [user]);

    const fetchEmployeeData = async () => {
        try {
            const res = await api.get(`/employees/${user.employeeId}`);
            setEmployee(res.data);
            setEditForm({
                first_name: res.data.first_name,
                last_name: res.data.last_name,
                phone: res.data.phone || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/employees/profile', editForm);
            setIsEditing(false);
            fetchEmployeeData();
            alert('Profile updated successfully');
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    if (loading) return <div className="p-4">Loading profile...</div>;
    if (!employee) return <div className="p-4">Employee record not found.</div>;

    return (
        <div className="card animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--pk-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'var(--pk-primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', fontWeight: 'bold'
                    }}>
                        {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{employee.first_name} {employee.last_name}</h1>
                        <span className="badge badge-active">{employee.designation}</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                >
                    Edit Profile
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Email</label>
                    <div style={{ fontSize: '1rem' }}>{employee.email}</div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Phone</label>
                    <div style={{ fontSize: '1rem' }}>{employee.phone || 'N/A'}</div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Department</label>
                    <div style={{ fontSize: '1rem' }}>{employee.Department?.name || 'N/A'}</div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Joining Date</label>
                    <div style={{ fontSize: '1rem' }}>{employee.joining_date}</div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Salary</label>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>${employee.salary}</div>
                </div>
                <div>
                    <label style={{ display: 'block', color: 'var(--pk-text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Status</label>
                    <span className={`badge badge-${employee.status.toLowerCase()}`}>{employee.status}</span>
                </div>
            </div>

            {/* Edit Modal Overlay */}
            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile</h3>
                        <form onSubmit={handleUpdate}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>First Name</label>
                                <input
                                    className="input-field"
                                    value={editForm.first_name}
                                    onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Last Name</label>
                                <input
                                    className="input-field"
                                    value={editForm.last_name}
                                    onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone</label>
                                <input
                                    className="input-field"
                                    value={editForm.phone}
                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ border: '1px solid var(--pk-border)' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDashboard;
