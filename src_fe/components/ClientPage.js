import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./ClientPage.module.css";

const ClientPage = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [dimensions, setDimensions] = useState({});
    const [processedSolutions, setProcessedSolutions] = useState([]);
    const [budget, setBudget] = useState('');
    const [error, setError] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);

    useEffect(() => {
        const fetchDeviceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/client/types');
                setDeviceTypes(response.data.map(type => ({ value: type, label: type })));
            } catch (error) {
                setError("There was an error fetching the device types!");
                console.error(error);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setToken(parsedUser?.accessToken);
            setUser(parsedUser);
        } else {
            navigate('/login');
        }

        fetchDeviceTypes();
    }, [navigate]);

    const handleDeleteType = (typeToDelete) => {
        setSelectedTypes(selectedTypes.filter(type => type.value !== typeToDelete));
        const newDimensions = { ...dimensions };
        delete newDimensions[typeToDelete];
        setDimensions(newDimensions);
    };

    const handleDimensionChange = (type, dimension, value) => {
        setDimensions({
            ...dimensions,
            [type]: {
                ...dimensions[type],
                [dimension]: value
            }
        });
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/search', {
                types: selectedTypes.map(type => type.value),
                budget: parseFloat(budget),
                dimensions
            });
            setProcessedSolutions(response.data.processed_types);
        } catch (error) {
            console.error('Error sending search request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSolutionChange = (index) => {
        setCurrentSolutionIndex(index);
    };

    const handleSaveSolution = async (solution) => {
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

            const deviceIds = solution.map(device => device.id);
            console.log('ids:', deviceIds);


            await axios.post(`http://localhost:8080/solutions/${userId}`, deviceIds, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            alert('Solution saved successfully');
        } catch (error) {
            console.error('Error saving the solution:', error);
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

    if (error) {
        return <div className="container error">{error}</div>;
    }

    return (
        <div className={styles.clientPage}>
            <header className={styles.header}>
                <nav className={styles.navhome}>
                    <a style={{color: 'white'}} href="/clientHome">Home</a>
                </nav>
                <h1>Device Recommendation System</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles.budgetContainer}>
                    <label>
                        Budget (Lei):
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className={styles.budgetInput}
                        />
                        <span></span>
                    </label>
                </div>
                <div className={styles.searchFilters}>
                    <h2 style={{marginBottom: '5px'}}>Filters</h2>
                    <div>
                        <Select
                            value={selectedTypes}
                            onChange={setSelectedTypes}
                            options={deviceTypes}
                            isMulti
                            closeMenuOnSelect={false}
                            className={styles.multiSelect}
                            placeholder="Select device types"
                        />
                    </div>
                    <h3 style={{marginTop: '5px'}}>Selected Types:</h3>
                    <ul style={{marginTop: '0px', marginBottom: '0', marginLeft: '-38px'}}>
                        {selectedTypes.map((type, index) => (
                            <li key={index} className={styles.selectedDevice}>
                                <span>{type.label}</span>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteType(type.value)}
                                >
                                    &times;
                                </button>
                                <div className={styles.dimensions}>
                                    <input
                                        type="number"
                                        placeholder="Width"
                                        value={dimensions[type.value]?.width || ''}
                                        onChange={(e) => handleDimensionChange(type.value, 'width', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Height"
                                        value={dimensions[type.value]?.height || ''}
                                        onChange={(e) => handleDimensionChange(type.value, 'height', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Length"
                                        value={dimensions[type.value]?.length || ''}
                                        onChange={(e) => handleDimensionChange(type.value, 'length', e.target.value)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.button} onClick={handleSearch}>Recommend</button>
                </div>
                <div className={styles.solutionsContainer}>
                    <h3>Recommendations:</h3>
                    {loading ? (
                        <div className={styles.loader}></div>
                    ) : (
                        <>
                            {processedSolutions.length === 0 ? (
                                <p>No recommendations available.</p>
                            ) : (
                                <div>
                                    <div className={styles.solutionButtons}>
                                        {processedSolutions.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`${styles.button} ${currentSolutionIndex === index ? styles.activeButton : ''}`}
                                                onClick={() => handleSolutionChange(index)}
                                            >
                                                Recommendation {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.solutionCard}>
                                        {processedSolutions[currentSolutionIndex] && (
                                            <>
                                                <h4>Recommendation {currentSolutionIndex + 1}</h4>
                                                <p>Total Price: {processedSolutions[currentSolutionIndex].reduce((sum, device) => sum + Number(device.price || 0), 0).toFixed(2)} lei</p>
                                                <ul>
                                                    {processedSolutions[currentSolutionIndex].map((device, index) => (
                                                        <li key={index}>
                                                            <img src={device.imageUrl} alt={device.name} className={styles.deviceImage} />
                                                            {device.name} - <a href={device.url} target="_blank" rel="noopener noreferrer">{device.url}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button className={styles.button} onClick={() => handleSaveSolution(processedSolutions[currentSolutionIndex])}>Save Recommendation</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

};

export default ClientPage;
