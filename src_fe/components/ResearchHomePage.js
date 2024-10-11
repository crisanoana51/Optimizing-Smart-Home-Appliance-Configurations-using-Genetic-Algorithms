import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./ResearchHomePage.module.css";

const ResearchHomePage = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [user, setUser] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: ''
    });
    const [editableUser, setEditableUser] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored user:', storedUser);

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('Parsed user:', parsedUser);

            setUser(parsedUser);
            setEditableUser(parsedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableUser({
            ...editableUser,
            [name]: value
        });
    };

    const handleSaveChanges = async () => {
        try {
            // Simplify the payload to match the one tested in Postman
            const payload = {
                email: editableUser.email,
                firstName: editableUser.firstName,
                lastName: editableUser.lastName,
            };

            console.log('Request payload:', payload);

            const response = await fetch(`http://localhost:8080/client/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Updated user:', updatedUser);

                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsEditing(false);
            } else {
                const errorText = await response.text();
                console.error('Failed to update user information:', errorText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleEditMode = (e) => {
        e.stopPropagation();
        setIsEditing(!isEditing);
    };

    const handleUserIconClick = (e) => {
        e.stopPropagation();
        setDropdownVisible(!dropdownVisible);
        if (!dropdownVisible) {
            setIsEditing(false);
        }
    };

    const getInitials = (firstName, lastName) => {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    const handleDropdownClick = (e) => {
        e.stopPropagation();
    };
    return (
        <div className="home-container">
            <header className="header">
                <h1>Device Recommendation System</h1>
                {user && (
                    <div className="header-right">
                        <div className="user-icon" onClick={handleUserIconClick}>
                            <span>{getInitials(user.firstName, user.lastName)}</span>
                            <div className={`dropdown-menu ${dropdownVisible ? 'active' : ''}`} onClick={handleDropdownClick}>
                                {isEditing ? (
                                    <>
                                        <div className="dropdown-menu-item">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={editableUser.firstName}
                                                onChange={handleInputChange}
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div className="dropdown-menu-item">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={editableUser.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Last Name"
                                            />
                                        </div>
                                        <div className="dropdown-menu-item">
                                            <input
                                                type="email"
                                                name="email"
                                                value={editableUser.email}
                                                onChange={handleInputChange}
                                                placeholder="Email"
                                            />
                                        </div>
                                        <div className="dropdown-menu-item">
                                            <button onClick={handleSaveChanges}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="dropdown-menu-item">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="dropdown-menu-item">
                                            {user.email}
                                        </div>
                                        <div className="dropdown-menu-item">
                                            <button onClick={toggleEditMode}>Edit Info</button>
                                        </div>
                                    </>
                                )}
                                <div className="dropdown-menu-item" onClick={handleLogout}>
                                    Logout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
            <div className="home-content">
                <h1>Welcome to Device Recommendation System</h1>
                <Link to="/research-comparison">
                    <button className="navigate-button">Global Fitnesses Comparison based on Selection Methods</button>
                </Link>

                <Link to="/research-crossover">
                    <button className="navigate-button">Global Fitnesses Comparison based on Crossover Methods</button>
                </Link>
                <Link to="/research-iteration_sel">
                    <button className="navigate-button">Highest Fitness over Generation Comparison based on Selection Methods</button>
                </Link>
                <Link to="/research-full">
                    <button className="navigate-button">Algorithm's Parameters Adjustments and Recommendations Generation</button>
                </Link>
                <Link to="/research-saved">
                    <button className="navigate-button">Most Saved Devices Among Customers</button>
                </Link>

            </div>
        </div>
    );
};

export default ResearchHomePage;
