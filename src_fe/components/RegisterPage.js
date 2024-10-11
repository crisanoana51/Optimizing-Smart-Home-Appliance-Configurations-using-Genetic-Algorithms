import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css'; // Import the CSS file

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: ['client']
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess('Registration successful!');
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.message || 'Registration failed');
                setSuccess('');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="register-container">
            <header className="header">
                <div className="header-left">
                    <nav className="nav">
                        <Link to="/">Home</Link>
                        <Link to="/login">Login</Link>
                    </nav>
                </div>
                <h1>AI Energy Consumption</h1>
            </header>
            <div className="register-box">
                <h1>Register</h1>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>First Name:</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
