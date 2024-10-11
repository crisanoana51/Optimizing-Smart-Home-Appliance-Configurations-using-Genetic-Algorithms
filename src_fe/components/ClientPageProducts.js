import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './ClientPageProducts.module.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const ClientPageProducts = () => {
    const [devices, setDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [user, setUser] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchDevices(categoryFilter, priceRange[0], priceRange[1]);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser);
        } else {
            navigate('/login');
        }
    }, [categoryFilter, priceRange, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/client/types');
            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.statusText}`);
            }
            const data = await response.json();
            const formattedCategories = data.map(category => ({ name: category }));
            setCategories(formattedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchDevices = async (categoryFilter = '', minPrice = 0, maxPrice = 10000) => {
        setIsLoading(true); // Start loading
        try {
            let url = `http://localhost:8080/client?minPrice=${minPrice}&maxPrice=${maxPrice}`;
            if (categoryFilter) {
                url += `&category=${categoryFilter}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch devices: ${response.statusText}`);
            }
            const data = await response.json();
            setDevices(data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setCategoryFilter(selectedCategory);
    };

    const handlePriceChange = (range) => {
        setPriceRange(range);
    };

    const handleSaveDevice = async (deviceId) => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                console.error('User is not authenticated');
                return;
            }

            const user = JSON.parse(storedUser);
            const token = user?.accessToken;
            const userId = user?.id;

            if (!token || !userId) {
                console.error('User is not authenticated');
                return;
            }

            await axios.post(`http://localhost:8080/device/${userId}?deviceId=${deviceId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Device saved successfully!');
        } catch (error) {
            console.error('Error saving device:', error);
            alert('Failed to save device.');
        }
    };




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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <nav className={styles.navhome}>
                    <a style={{color: 'white'}} href="/clientHome">Home</a>
                </nav>
                <h1>Device Recommendation System</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            <div className={styles.filters}>
                <h2>Filters</h2>
                <div className={styles.filterSection}>
                    <strong>Price Range: {priceRange[0]} Lei - {priceRange[1]} Lei</strong>
                    <div style={{marginTop: '30px'}}>
                        <Slider
                            range
                            min={minPrice}
                            max={maxPrice}
                            defaultValue={[minPrice, maxPrice]}
                            value={priceRange}
                            onChange={handlePriceChange}
                        />
                    </div>
                </div>
                <div className={styles.filterSection}>
                    <h3>Select a device category :</h3>
                    <select className={styles.customSelect} value={categoryFilter} onChange={handleCategoryChange}>
                        <option key="all" value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={`${category.name}-${index}`} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={styles.mainContent}>
                <h1 style={{color:"white"}}></h1>
                {isLoading ? (
                    <div className={styles.loader}></div>
                ) : (
                    <ul className={styles.deviceList}>
                        {devices.map(device => (
                            <li key={device.id} className={styles.deviceItem}>
                                <div className={styles.deviceCard}>
                                    <img src={device.imageUrl} alt={device.name} className={styles.deviceImage} />
                                    <p className={styles.deviceName}>{device.name}</p>
                                    <p className={styles.devicePrice}>Price: {device.price} Lei</p>
                                    <a href={device.url} className={styles.deviceLink}>More Info</a>
                                    <button
                                        className={styles.saveButton}
                                        onClick={() => handleSaveDevice(device.id)}
                                    >
                                        Save Device
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ClientPageProducts;
