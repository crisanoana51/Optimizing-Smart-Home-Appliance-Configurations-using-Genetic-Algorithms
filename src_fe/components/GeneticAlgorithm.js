import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from "./ClientPage.module.css";

const GeneticAlgorithm = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [dimensions, setDimensions] = useState({});
    const [processedSolutions, setProcessedSolutions] = useState([]);
    const [budget, setBudget] = useState('');
    const [error, setError] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [consumptionWeight, setConsumptionWeight] = useState('');
    const [populationSize, setPopulationSize] = useState('');
    const [numGenerations, setNumGenerations] = useState('');
    const [mutationRate, setMutationRate] = useState('');



    useEffect(() => {
        const fetchDeviceTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/client/types');
                setDeviceTypes(response.data);
            } catch (error) {
                setError("There was an error fetching the device types!");
                console.error(error);
            }
        };

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }

        fetchDeviceTypes();
    }, [navigate]);

    const handleAddType = () => {
        if (selectedType && !selectedTypes.includes(selectedType)) {
            setSelectedTypes([...selectedTypes, selectedType]);
            setSelectedType('');
        }
    };

    const handleDeleteType = (typeToDelete) => {
        setSelectedTypes(selectedTypes.filter(type => type !== typeToDelete));
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
            const response = await axios.post('http://localhost:5000/search-res', {
                types: selectedTypes,
                budget: parseFloat(budget),
                consumptionWeight: parseFloat(consumptionWeight),
                populationSize: parseInt(populationSize, 10),
                numGenerations: parseInt(numGenerations, 10),
                mutationRate: parseFloat(mutationRate),
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
                    <a style={{color: 'white'}} href="/researchHome">Home</a>
                </nav>
                <h1>Device Recommendation System Algorithm Adjustments</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles.searchFilters}>
                    <h2 style={{marginBottom: '5px'}}>Filters</h2>
                    <div>
                        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
                                style={{
                                    borderRadius: '50px',
                                    border: '2px solid #144587',
                                    padding: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    minWidth: '200px'
                                }}
                        >
                            <option value="">Select a device type</option>
                            {deviceTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        <button className={styles.button} onClick={handleAddType}>Add</button>
                    </div>

                    <h3 style={{marginTop: '5px'}}>Selected Types:</h3>
                    <ul style={{marginTop: '0px', marginBottom: '0', marginLeft: '-38px'}}>
                        {selectedTypes.map((type, index) => (
                            <li key={index} className={styles.selectedDevice}>
                                <span>{type}</span>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteType(type)}
                                >
                                    &times;
                                </button>
                                <div className={styles.dimensions}>
                                    <input
                                        type="number"
                                        placeholder="Width"
                                        value={dimensions[type]?.width || ''}
                                        onChange={(e) => handleDimensionChange(type, 'width', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Height"
                                        value={dimensions[type]?.height || ''}
                                        onChange={(e) => handleDimensionChange(type, 'height', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Length"
                                        value={dimensions[type]?.length || ''}
                                        onChange={(e) => handleDimensionChange(type, 'length', e.target.value)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div>
                        <label style={{fontWeight: 'bold'}}>
                            Budget:
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className={styles.budgetInput}
                            /> Lei
                        </label>
                    </div>
                    <div>
                        <label style={{ color: 'black', fontWeight: 'bold' }}>
                            Consumption Weight:
                            <input
                                type="number"
                                value={consumptionWeight}
                                onChange={(e) => setConsumptionWeight(e.target.value)}
                                className={styles.budgetInput}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black', fontWeight: 'bold' }}>
                            Population Size:
                            <input
                                type="number"
                                value={populationSize}
                                onChange={(e) => setPopulationSize(e.target.value)}
                                className={styles.budgetInput}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black',fontWeight: 'bold'   }}>
                            Nr of Generations:
                            <input
                                type="number"
                                value={numGenerations}
                                onChange={(e) => setNumGenerations(e.target.value)}
                                className={styles.budgetInput}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black', fontWeight: 'bold'  }}>
                            Mutation Rate:
                            <input
                                type="number"
                                value={mutationRate}
                                onChange={(e) => setMutationRate(e.target.value)}
                                className={styles.budgetInput}
                            />
                        </label>
                    </div>

                    <button className={styles.button} onClick={handleSearch}>Recommend</button>
                </div>

                <div className={styles.solutionsContainer}>
                    <h3>Recommendations:</h3>
                    {loading ? (
                        <div className={styles.loader}></div>
                    ) : (
                        processedSolutions.length === 0 ? (
                            <p>No recommendations available.</p>
                        ) : (
                            processedSolutions.map((solution, solutionIndex) => {
                                const totalPrice = solution.reduce((sum, device) => sum + Number(device.price || 0), 0);
                                return (
                                    <div key={solutionIndex} className={styles.solutionCard}>
                                        <h4>Solution {solutionIndex + 1}</h4>
                                        <p>Total Price: {totalPrice.toFixed(2)} lei</p>
                                        <ul>
                                            {solution.map((device, index) => (
                                                <li key={index}>
                                                    <img src={device.imageUrl} alt={device.name} className={styles.deviceImage} />
                                                    {device.name} - <a href={device.url} target="_blank" rel="noopener noreferrer">{device.url}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneticAlgorithm;
