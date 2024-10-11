import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/elements/Header';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import GeneticAlgorithm from './components/GeneticAlgorithm';
import ComparisonChart from "./components/ComparisonChart";
import ClientPage from "./components/ClientPage";
import ClientHomePage from "./components/ClientHomePage";
import ClientPageProducts from "./components/ClientPageProducts";
import './App.css';
import { PrivateRoute } from "./PrivateRoute";
import ResearchHomePage from "./components/ResearchHomePage";
import LoginPage from "./components/login/LoginPage";
import CrossoverResearch from "./components/CrossoverResearch";
import IterrationFitnessSel from "./components/IterrationFitnessSel";
import ResearchFullChartSol from "./components/ResearchFullChartSol";
import ClientViewSolutions from "./components/ClientViewSolutions";
import ResearchMostSaved from "./components/ResearchMostSaved";
import ClientSavedDevices from "./components/ClientSavedDevices";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
    const [userRole, setUserRole] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).roles : []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setIsLoggedIn(true);
            setUserRole(user.roles);
        }
    }, []);


    const handleChangeLoggedInStatus = (isLoggedInValue, userRoleValue) => {
        setIsLoggedIn(isLoggedInValue);
        setUserRole(userRoleValue);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage onChangeLoggedInStatus={handleChangeLoggedInStatus} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/logout" element={<Navigate to="/" replace />} />

                <Route element={<PrivateRoute isAuthenticated={isLoggedIn} userRole={userRole} requiredRole="ROLE_CLIENT" />}>
                    <Route path="/clientHome" element={<ClientHomePage />} />
                    <Route path="/client-products" element={<ClientPageProducts />} />
                    <Route path="/client-page" element={<ClientPage />} />
                    <Route path="/client-solutions" element={<ClientViewSolutions />} />
                    <Route path="/client-devices" element={<ClientSavedDevices />} />
                </Route>

                <Route element={<PrivateRoute isAuthenticated={isLoggedIn} userRole={userRole} requiredRole="ROLE_RESEARCH" />}>
                    <Route path="/researchHome" element={<ResearchHomePage />} />
                    <Route path="/research-comparison" element={<ComparisonChart />} />
                    <Route path="/research-genetic-algorithm" element={<GeneticAlgorithm />} />
                    <Route path="/research-crossover" element={<CrossoverResearch />} />
                    <Route path="/research-iteration_sel" element={<IterrationFitnessSel />} />
                    <Route path="/research-full" element={<ResearchFullChartSol />} />
                    <Route path="/research-saved" element={<ResearchMostSaved />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
