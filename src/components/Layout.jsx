import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">Employment Management System - Personal</div>
                <nav>
                    <Link to="/" className={`nav-item ${isActive('/')}`}>Dashboard</Link>
                    <Link to="/departments" className={`nav-item ${isActive('/departments')}`}>Departments</Link>
                    {(user.role === 'Admin') && (
                        <Link to="/logs" className={`nav-item ${isActive('/logs')}`}>Audit Logs</Link>
                    )}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <h2 style={{ fontSize: '1.25rem' }}>
                        {location.pathname === '/' ? 'Dashboard' : 
                         location.pathname.startsWith('/departments') ? 'Departments' :
                         location.pathname.startsWith('/logs') ? 'Audit Logs' : 'Overview'}
                    </h2>
                    <div className="user-profile">
                        <div className="avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{user.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--pk-text-muted)' }}>{user.role}</div>
                        </div>
                        <button
                            onClick={logout}
                            className="btn"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--pk-border)', marginLeft: '1rem' }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
