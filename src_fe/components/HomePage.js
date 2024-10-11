import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles['header-left']}>
                    <nav className={styles.nav}>
                        <button onClick={() => navigate('/about')}>About</button>
                        <button onClick={() => navigate('/contact')}>Contact</button>
                    </nav>
                    <h1>Electric Devices Recommendation System</h1>
                </div>
            </header>
            <main className={styles.home}>
                <div className={styles['center-box']}>
                    <h2>Do you have an account? Create one or login</h2>
                    <div className={styles.buttons}>
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/register')}>Sign Up</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
