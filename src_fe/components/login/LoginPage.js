import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ onChangeLoggedInStatus }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                onChangeLoggedInStatus(true, data.roles);

                if (data.roles.includes('ROLE_CLIENT')) {
                    navigate('/clientHome');
                } else if (data.roles.includes('ROLE_RESEARCH')) {
                    navigate('/researchHome');
                } else {
                    navigate('/login');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <header className="header">
                <div className="header-left">
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/register">Register</Link>
                    </nav>
                </div>
                <h1>Electric Devices Recommendation System</h1>
            </header>
            <div className="login-box">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
