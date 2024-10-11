import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import styles from './ResearchMostSaved.module.css';
import Chart from 'chart.js/auto';

const ResearchMostSaved = () => {
    const [deviceCounts, setDeviceCounts] = useState([]);
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [hoveredDevice, setHoveredDevice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/solutions/devices-sorted')
            .then(response => response.json())
            .then(data => setDeviceCounts(data))
            .catch(error => console.error('Error fetching devices:', error));

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

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

    const handleHover = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            setHoveredDevice(deviceCounts[index]);
        } else {
            setHoveredDevice(null);
        }
    };

    const top10Devices = deviceCounts.slice(0, 10);
    const chartData = {
        labels: top10Devices.map(({ device }) => device.name),
        datasets: [{
            data: top10Devices.map(({ count }) => count),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#FF5733',
                '#33FF57',
                '#3357FF',
                '#57FF33',
                '#FF33A2',
                '#A233FF',
                '#FF9633',
            ],
        }]
    };

    const chartOptions = {
        plugins: {
            tooltip: {
                enabled: false,
            }
        },
        onHover: handleHover,
        legend: {
            display: true,
            position: 'left',
            labels: {
                boxWidth: 20,
                padding: 20,
            }
        },
    };

    return (
        <div className={styles.wallpaper}>
            <header className={styles.header}>
                <nav className={styles.navhome}>
                    <a style={{ color: 'white' }} href="/researchHome">Home</a>
                </nav>
                <h1>Device Recommendation System</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            <div className={styles.chartContainer}>
                <Pie data={chartData} options={chartOptions} />
                {hoveredDevice && (
                    <div className={styles.deviceCard}>
                        <h3>{hoveredDevice.device.name}</h3>
                        <p style={{color: 'black'}}>Price: {hoveredDevice.device.price} Lei</p>
                        <p style={{color: 'black'}}>Saved: {hoveredDevice.count} times</p>
                        <a href={hoveredDevice.device.url} target="_blank" rel="noopener noreferrer">
                            {hoveredDevice.device.url}
                        </a>
                        <div>
                            <img src={hoveredDevice.device.imageUrl} alt={hoveredDevice.device.name} width="100" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchMostSaved;
