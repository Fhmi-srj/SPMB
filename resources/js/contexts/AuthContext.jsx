import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = '/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('spmb_token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('spmb_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const fetchMe = useCallback(async (tkn) => {
        try {
            const res = await fetch(`${API_BASE}/auth/me`, {
                headers: { Authorization: `Bearer ${tkn}`, Accept: 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        if (token) {
            fetchMe(token);
        } else {
            setLoading(false);
        }
    }, [token, fetchMe]);

    const login = async (username, password) => {
        // Fetch CSRF cookie first (required by Sanctum statefulApi)
        await fetch('/sanctum/csrf-cookie', { credentials: 'same-origin' });

        const xsrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
            },
            body: JSON.stringify({ username, password }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('spmb_token', data.data.token);
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            setToken(data.data.token);
            setUser(data.data.user);
        }
        return data;
    };

    // logout is now defined above fetchMe

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
export { API_BASE };
