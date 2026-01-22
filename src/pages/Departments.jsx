import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import DepartmentForm from '../components/DepartmentForm';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (error) {
            console.error("Error fetching departments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingDept(null);
        setIsModalOpen(true);
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await api.delete(`/departments/${id}`);
                fetchData();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const handleSave = () => {
        setIsModalOpen(false);
        fetchData();
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;

    const canEdit = user.role === 'Admin'; // Only Admin can manage departments

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Departments</h1>
                {canEdit && (
                    <button onClick={handleAdd} className="btn btn-primary">
                        + Add Department
                    </button>
                )}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead style={{ background: 'var(--pk-surface-light)' }}>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            {canEdit && <th style={{ textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dept => (
                            <tr key={dept.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{dept.name}</div>
                                </td>
                                <td style={{ color: 'var(--pk-text-muted)' }}>{dept.description}</td>
                                <td>
                                    <span className={`badge ${dept.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                                        {dept.status}
                                    </span>
                                </td>
                                {canEdit && (
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleEdit(dept)} className="btn btn-edit" style={{ padding: '0.3rem 0.6rem', marginRight: '0.5rem', fontSize: '0.8rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(dept.id)} className="btn btn-delete" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDept ? 'Edit Department' : 'Add New Department'}
            >
                <DepartmentForm
                    department={editingDept}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </Layout>
    );
};

export default Departments;
