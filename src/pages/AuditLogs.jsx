import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await api.get('/reports/audit-logs');
            setLogs(res.data);
        } catch (error) {
            console.error("Error fetching logs", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;

    return (
        <Layout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem' }}>Audit Logs</h1>
                <p style={{ color: 'var(--pk-text-muted)' }}>Track system activities and changes.</p>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead style={{ background: 'var(--pk-surface-light)' }}>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>ID</th>
                            <th>Performed By</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td style={{ color: 'var(--pk-text-muted)', fontSize: '0.85rem' }}>
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td>
                                    <span style={{ fontWeight: 600, color: log.action === 'DELETE' ? 'var(--pk-danger)' : 'var(--pk-primary)' }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td>{log.entity_type}</td>
                                <td style={{ fontFamily: 'monospace' }}>{log.entity_id}</td>
                                <td>
                                    ID: {log.performed_by}
                                </td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {JSON.stringify(log.details)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default AuditLogs;
