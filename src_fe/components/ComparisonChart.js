import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import styles from "./ComparisonChart.module.css";

Chart.register(...registerables);

const customSelectStyles = {
    control: (provided) => ({
        ...provided,
        color: 'black',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'black',
    }),
    multiValue: (provided) => ({
        ...provided,
        color: 'black',
    }),
    menu: (provided) => ({
        ...provided,
        color: 'black',
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        backgroundColor: state.isSelected ? 'blue' : 'white',
    }),
};


const ComparisonChart = () => {
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [budget, setBudget] = useState('');
    const [dimensions, setDimensions] = useState({});
    const [error, setError] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [fitnessHistories, setFitnessHistories] = useState({});
    const [consumptionWeight, setConsumptionWeight] = useState('');
    const [populationSize, setPopulationSize] = useState('');
    const [numGenerations, setNumGenerations] = useState('');
    const [mutationRate, setMutationRate] = useState('');
    const chartSectionRef = useRef(null);
    const [chartSize, setChartSize] = useState({ width: 1000, height: 780 });
    const navigate = useNavigate();
    const chartRef = useRef(null);

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
            setUser(JSON.parse(storedUser));
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
        try {
            const response = await axios.post('http://localhost:5000/compare_algorithms', {
                types: selectedTypes.map(type => type.value),
                budget: parseFloat(budget),
                consumptionWeight: parseFloat(consumptionWeight),
                populationSize: parseInt(populationSize, 10),
                numGenerations: parseInt(numGenerations, 10),
                mutationRate: parseFloat(mutationRate),
                dimensions
            });
            setFitnessHistories(response.data);
        } catch (error) {
            console.error('Error sending search request:', error);
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

    useEffect(() => {
        const updateChartSize = () => {
            if (chartSectionRef.current) {
                setChartSize({
                    width: chartSectionRef.current.clientWidth,
                    height: chartSectionRef.current.clientHeight,
                });
            }
        };

        updateChartSize();
        window.addEventListener('resize', updateChartSize);

        return () => {
            window.removeEventListener('resize', updateChartSize);
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    if (error) {
        return <div className="container error">{error}</div>;
    }

    return (
        <div className={styles.respage}>
            <header className="header">
                <nav className={styles.navhome}>
                    <a style={{color: 'white'}} href="/researchHome">Home</a>
                </nav>
                <h1>Global Fitness Comparison based on Selection Methods</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles.searchSection}>
                    <h2>Device Search</h2>
                    <div>
                        <Select
                            value={selectedTypes}
                            onChange={setSelectedTypes}
                            options={deviceTypes}
                            isMulti
                            closeMenuOnSelect={false}
                            className={styles.multiSelect}
                            placeholder="Select device types"
                            styles={customSelectStyles}
                        />
                    </div>

                    <h3>Selected Types:</h3>
                    <ul>
                        {selectedTypes.map((type, index) => (
                            <li key={index}>
                                {type.label} <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteType(type.value)}
                                style={{ width: '20px', height: '20px', fontSize: '12px' }}>
                                x
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

                    <div>
                        <label style={{ color: 'black' }}>
                            Budget:
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black' }}>
                            Consumption Weight:
                            <input
                                type="number"
                                value={consumptionWeight}
                                onChange={(e) => setConsumptionWeight(e.target.value)}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black' }}>
                            Population Size:
                            <input
                                type="number"
                                value={populationSize}
                                onChange={(e) => setPopulationSize(e.target.value)}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black' }}>
                            Number of Generations:
                            <input
                                type="number"
                                value={numGenerations}
                                onChange={(e) => setNumGenerations(e.target.value)}
                            />
                        </label>
                    </div>

                    <div>
                        <label style={{ color: 'black' }}>
                            Mutation Rate:
                            <input
                                type="number"
                                value={mutationRate}
                                onChange={(e) => setMutationRate(e.target.value)}
                            />
                        </label>
                    </div>

                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className={styles.chartSection} ref={chartSectionRef}>
                    {fitnessHistories && Object.keys(fitnessHistories).length > 0 ? (
                        <Line
                            ref={chartRef}
                            data={{
                                labels: Array.from({ length: fitnessHistories.wheel_selection.length }, (_, i) => i + 1),
                                datasets: [
                                    {
                                        label: 'Wheel Selection',
                                        data: fitnessHistories.wheel_selection,
                                        borderColor: 'red',
                                        fill: false,
                                    },
                                    {
                                        label: 'Tournament Selection',
                                        data: fitnessHistories.tournament_selection,
                                        borderColor: 'blue',
                                        fill: false,
                                    },
                                    {
                                        label: 'Rank Selection',
                                        data: fitnessHistories.rank_selection,
                                        borderColor: 'green',
                                        fill: false,
                                    }
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Generations',
                                        },
                                        ticks: {
                                            autoSkip: false,
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Fitness',
                                        },
                                        beginAtZero: true,
                                    },
                                },
                                layout: {
                                    padding: {
                                        left: 10,
                                        right: 10,
                                        top: 10,
                                        bottom: 10,
                                    },
                                },
                            }}
                            width={chartSize.width}
                            height={chartSize.height}
                        />
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonChart;
