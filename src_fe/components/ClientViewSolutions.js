import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ClientViewSolutions.module.css'
import {useNavigate} from "react-router-dom";

const ClientViewSolutions = () => {
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    console.error('User is not authenticated');
                    return;
                }

                const user = JSON.parse(storedUser);
                const userId = user?.id;
                const response = await axios.get(`http://localhost:8080/solutions/${userId}`);
                setSolutions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser);
        } else {
            navigate('/login');
        }


        fetchSolutions();
    },[navigate]);

    const renderUserIcon = () => {
        if (user && user.firstName && user.lastName) {
            return (
                <div className="user-icon" onClick={() => setDropdownVisible(!dropdownVisible)}>
                    <span>{user.firstName[0]}{user.lastName[0]}</span>
                    <div className={`dropdown-menu ${dropdownVisible ? 'active' : ''}`}>
                        <div className="dropdown-menu-item">
                            {user.firstName} {user.lastName}
                        </div>
                        <div className="dropdown-menu-item">
                            {user.email}
                        </div>
                        <div className="dropdown-menu-item" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className={styles.body}>
            <header className={styles.header}>
                <nav className={styles.navhome}>
                    <a style={{color: 'white'}} href="/clientHome">Home</a>
                </nav>
                <h1>Device Recommendation System</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            {solutions.length === 0 ? (
                <div>No solutions found</div>
            ) : (
                solutions.map((solution) => (
                    <div key={solution.id} className={styles.solution}>
                        <h2>Recommendation {solution.id}</h2>
                        <div className={styles.device}>
                            {solution.devices.map((device) => (
                                <div key={device.id} className={styles.device}>
                                    <h3>{device.name}</h3>
                                    <p>Price: {device.price}</p>
                                    <a href={device.url} target="_blank" rel="noopener noreferrer">
                                        {device.url}
                                    </a>
                                    <div>
                                        <img src={device.imageUrl} alt={device.name} width="100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ClientViewSolutions;
