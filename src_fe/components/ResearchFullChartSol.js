import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import styles from "./ResearcherFullCharSol.module.css";

const ResearchFullChartSol = () => {
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
    const [consumptionWeight, setConsumptionWeight] = useState('');
    const [populationSize, setPopulationSize] = useState('');
    const [numGenerations, setNumGenerations] = useState('');
    const [mutationRate, setMutationRate] = useState('');
    const [selectionType, setSelectionType] = useState('');
    const [crossoverType, setCrossoverType] = useState('');
    const [fitnessData, setFitnessData] = useState([]);
    const [chartLabel, setChartLabel] = useState('');
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

    const handleApiCall = async (apiUrl) => {
        setLoading(true);
        try {
            const response = await axios.post(apiUrl, {
                types: selectedTypes.map(type => type.value),
                budget: parseFloat(budget),
                consumptionWeight: parseFloat(consumptionWeight),
                populationSize: parseInt(populationSize, 10),
                numGenerations: parseInt(numGenerations, 10),
                mutationRate: parseFloat(mutationRate),
                dimensions,
                selection_type: selectionType,
                crossover_type: crossoverType
            });

            setProcessedSolutions(response.data.best_solutions);
            setFitnessData(apiUrl.includes('global') ? response.data.global_fitnesses : response.data.iteration_fitnesses);
            setChartLabel(apiUrl.includes('global') ? 'Global Fitness' : 'Iteration Fitness');
        } catch (error) {
            console.error('Error sending request:', error);
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

    const renderChart = () => {
        const data = {
            labels: Array.from({ length: fitnessData.length }, (_, i) => i + 1),
            datasets: [
                {
                    label: chartLabel,
                    data: fitnessData,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                },
            ],
        };
        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
        return <Line data={data} options={options} />;
    };

    if (error) {
        return <div className="container error">{error}</div>;
    }

    return (
        <div className={styles.clientPage}>
            <header className={styles.header}>
                <nav className={styles.navhome}>
                    <a style={{ color: 'white' }} href="/researchHome">Home</a>
                </nav>
                <h1>Device Recommendation System Algorithm Adjustments</h1>
                <div className="header-right">
                    {renderUserIcon()}
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles.columns}>
                    <div className={styles.column}>
                        <div className={styles.searchFilters}>
                            <h2 style={{ marginBottom: '5px' }}>Filters</h2>
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
                            <h3 style={{ marginTop: '5px' }}>Selected Types:</h3>
                            <ul style={{ marginTop: '0px', marginBottom: '0', marginLeft: '-38px' }}>
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
                                <label style={{ color: 'black', fontWeight: 'bold' }}>Budget:</label>
                                <input type="number" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={styles.budgetInput} />

                        </div>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.inputContainer}>
                            <label style={{ color: 'black', fontWeight: 'bold' }}>Consumption Weight (decimal number between 0 and 1):</label>
                            <input type="number" placeholder="Consumption Weight" value={consumptionWeight} onChange={(e) => setConsumptionWeight(e.target.value)} className={styles.budgetInput} />
                            <label style={{ color: 'black', fontWeight: 'bold' }}>Population Size (natural number):</label>
                            <input type="number" placeholder="Population Size" value={populationSize} onChange={(e) => setPopulationSize(e.target.value)} className={styles.budgetInput} />
                            <label style={{ color: 'black', fontWeight: 'bold' }}>Number of Generations (natural number > 50):</label>
                            <input type="number" placeholder="Number of Generations" value={numGenerations} onChange={(e) => setNumGenerations(e.target.value)} className={styles.budgetInput} />
                            <label style={{ color: 'black', fontWeight: 'bold' }}>Mutation Rate (decimal number between 0 and 1):</label>
                            <input type="number" placeholder="Mutation Rate" value={mutationRate} onChange={(e) => setMutationRate(e.target.value)} className={styles.budgetInput} />
                            <label style={{ color: 'black', fontWeight: 'bold' }}>Selection Type:</label>
                            <select value={selectionType} onChange={(e) => setSelectionType(e.target.value)} className={styles.budgetInput}>
                                <option value="">Select Selection Type</option>
                                <option value="wheel">Wheel Roulette</option>
                                <option value="tournament">Tournament</option>
                                <option value="rank">Rank</option>
                            </select>
                            <label style={{ color: 'black', fontWeight: 'bold' }}>Crossover Type:</label>
                            <select value={crossoverType} onChange={(e) => setCrossoverType(e.target.value)} className={styles.budgetInput}>
                                <option value="">Select Crossover Type</option>
                                <option value="single">Single-Point</option>
                                <option value="double">Two-Point</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.column}>
                        <div className={styles.chartContainer}>
                            <div className={styles.buttonContainer}>
                                <button className={styles.button} onClick={() => handleApiCall('http://localhost:5000/run-genetic-global')}>View Global Fitness Evolution over Generations</button>
                                <button className={styles.button} onClick={() => handleApiCall('http://localhost:5000/run-genetic-iteration')}>View Highest Fitness Value over Generations</button>
                            </div>
                            {loading ? <p></p> : renderChart()}
                            {loading ? (
                                <div className={styles.loader}></div>
                            ) : (
                                processedSolutions.length === 0 ? (
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ResearchFullChartSol;
