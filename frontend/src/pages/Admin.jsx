import React, { useEffect, useState } from 'react';
import { getUsers, updateUserRole } from '../api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  // Try to derive current user id from common localStorage patterns or JWT payload
  const getCurrentUserId = () => {
    try {
      // 1) check for stored user object
      const userJson = localStorage.getItem('user') || localStorage.getItem('currentUser') || localStorage.getItem('userInfo');
      if (userJson) {
        try {
          const u = JSON.parse(userJson);
          if (u && (u._id || u.id || u.userId)) return u._id || u.id || u.userId;
        } catch {}
      }

      // 2) check for token and decode JWT payload (if token present)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload && (payload._id || payload.id || payload.sub || payload.userId)) {
              return payload._id || payload.id || payload.sub || payload.userId;
            }
          } catch {}
        }
      }
    } catch (e) {
      // ignore and return null
    }
    return null;
  };

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    // Prevent changing own role
    if (id === currentUserId) {
      setError("You can't change your own role.");
      return;
    }

    try {
      await updateUserRole(id, newRole);
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
      setError('');
    } catch (err) {
      setError('Failed to update role.');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="title">Admin - User Management</h1>
      {error && <p className="error">{error}</p>}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isCurrent = user._id === currentUserId;
              return (
                <tr key={user._id} className={isCurrent ? 'current-user-row' : ''}>
                  <td>
                    {user.name}
                    {isCurrent && <span className="you-badge">You</span>}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-text">{user.role}</span>
                    {isCurrent && user.role === 'admin' && <span className="admin-badge">Admin</span>}
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={isCurrent}
                      title={isCurrent ? "You cannot change your own role" : "Change user role"}
                    >
                      <option value="user">User</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Inline CSS for styling */}
      <style>{`
        .admin-container {
          padding: 20px;
          background: linear-gradient(to bottom right, #dceeff, #fde2e4);
          min-height: 100vh;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #1f2937;
        }
        .error {
          color: #b91c1c;
          background: #fee2e2;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 15px;
        }
        .table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
        }
        .custom-table th, .custom-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .custom-table thead {
          background-color: #f3f4f6;
        }
        .custom-table tr:hover {
          background-color: #f9fafb;
        }

        /* Highlight for current user's row */
        .current-user-row {
          background: linear-gradient(90deg, rgba(59,130,246,0.06), rgba(16,185,129,0.03));
          font-weight: 600;
        }

        .you-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 2px 8px;
          font-size: 12px;
          background: #e0f2fe;
          color: #0369a1;
          border-radius: 999px;
        }

        .admin-badge {
          display: inline-block;
          margin-left: 8px;
          padding: 2px 8px;
          font-size: 12px;
          background: #ecfeff;
          color: #065f46;
          border-radius: 6px;
        }

        select {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: white;
          cursor: pointer;
        }
        select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
        }

        select[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .title { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
