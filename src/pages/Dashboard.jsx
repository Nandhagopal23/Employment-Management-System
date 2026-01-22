import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';
import { debounce } from 'lodash';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [stats, setStats] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // Pagination & Sorting State
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('DESC');
    const limit = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);

    // Fetch Data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                q: searchQuery,
                page,
                limit,
                sortBy,
                order: sortOrder
            };

            const empRes = await api.get('/employees/search', { params });
            setEmployees(empRes.data.rows);
            setTotalPages(Math.ceil(empRes.data.count / limit));

            if (user.role === 'Admin' || user.role === 'HR') {
                const statsRes = await api.get('/reports/salary-stats');
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, sortOrder, searchQuery, user.role]);

    // Initial Load & Updates
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [fetchData]);

    // Debounced Search Handler
    const handleSearchDebounced = useCallback(debounce((query) => {
        setSearchQuery(query);
        setPage(1); // Reset to page 1 on new search
    }, 500), []);

    const onSearchChange = (e) => {
        handleSearchDebounced(e.target.value);
    };

    // Sorting Handler
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
        } else {
            setSortBy(field);
            setSortOrder('ASC');
        }
    };

    const handleAdd = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (emp) => {
        setEditingEmployee(emp);
        setIsModalOpen(true);
    };

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDelete = (emp) => {
        setItemToDelete(emp);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            await api.delete(`/employees/${itemToDelete.id}`);
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            const msg = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Delete failed: ${msg}`);
        }
    };

    const handleSave = () => {
        setIsModalOpen(false);
        fetchData();
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/reports/export-csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'employees.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            alert('Export failed');
        }
    }

    if (loading && !employees.length) return <div className="flex-center" style={{ height: '100vh', color: 'var(--pk-text-muted)' }}>Loading...</div>;

    const canEdit = user.role === 'Admin' || user.role === 'HR';

    return (
        <Layout>
            {/* Stats Cards: Minimalist */}
            {stats.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--pk-primary)' }}>
                            <div style={{ color: 'var(--pk-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                                {stat.Department?.name || 'Unknown'}
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.25rem 0', color: 'var(--pk-text-main)' }}>
                                ${parseInt(stat.totalSalary).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--pk-text-muted)' }}>
                                Avg: ${parseFloat(stat.avgSalary).toFixed(0)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="input-field"
                    style={{ width: '320px', backgroundColor: 'var(--pk-surface)' }}
                    onChange={onSearchChange}
                />

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {canEdit && (
                        <button onClick={handleAdd} className="btn btn-primary">
                            + New Employee
                        </button>
                    )}
                    {canEdit && (
                        <button onClick={handleExport} className="btn btn-ghost" style={{ border: '1px solid var(--pk-border)' }}>
                            Export CSV
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('first_name')} style={{ cursor: 'pointer' }}>
                                Employee {sortBy === 'first_name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                                Email {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>
                                Department {sortBy === 'department' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('designation')} style={{ cursor: 'pointer' }}>
                                Designation {sortBy === 'designation' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </th>
                            <th>Status</th>
                            <th onClick={() => handleSort('salary')} style={{ cursor: 'pointer' }}>
                                Salary {sortBy === 'salary' && (sortOrder === 'ASC' ? '↑' : '↓')}
                            </th>
                            {canEdit && <th style={{ textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{emp.first_name} {emp.last_name}</div>
                                </td>
                                <td style={{ color: 'var(--pk-text-muted)' }}>{emp.email}</td>
                                <td>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--pk-text-main)' }}>
                                        {emp.Department?.name}
                                    </span>
                                </td>
                                <td style={{ fontSize: '0.9rem' }}>{emp.designation}</td>
                                <td>
                                    <span className={`badge ${emp.status === 'Active' ? 'badge-active' :
                                        emp.status === 'OnLeave' ? 'badge-onleave' : 'badge-inactive'
                                        }`}>
                                        {emp.status}
                                    </span>
                                </td>
                                <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>${parseInt(emp.salary).toLocaleString()}</td>
                                {canEdit && (
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleEdit(emp)} className="btn btn-edit" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Edit</button>
                                        <button onClick={() => handleDelete(emp)} className="btn btn-delete" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {employees.length > 0 && (
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--pk-border)' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--pk-text-muted)', marginRight: '1rem' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', border: '1px solid var(--pk-border)', opacity: page === 1 ? 0.5 : 1 }}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', border: '1px solid var(--pk-border)', opacity: page === totalPages ? 0.5 : 1 }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
            >
                <EmployeeForm
                    employee={editingEmployee}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <div>
                    <p style={{ marginBottom: '1.5rem', color: 'var(--pk-text-main)' }}>
                        Are you sure you want to delete <strong>{itemToDelete?.first_name} {itemToDelete?.last_name}</strong>?
                        <br />
                        <span style={{ fontSize: '0.9rem', color: 'var(--pk-text-muted)' }}>This action cannot be undone.</span>
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="btn"
                            style={{ border: '1px solid var(--pk-border)', padding: '0.5rem 1rem' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="btn btn-delete"
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default Dashboard;
