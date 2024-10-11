import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./ClientPageProducts.module.css";

const ClientSavedDevices = ({ userId }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

     const fetchPreferredDevices = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                console.Error('User is not authenticated');
            }

            const user = JSON.parse(storedUser);
            const userId = user?.id;

            const response = await axios.get(`http://localhost:8080/device/${userId}`);
            setDevices(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreferredDevices();
    }, [userId]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Preferred Devices for User {userId}</h2>
            <ul>
                {devices.map(device => (
                    <li key={device.id} className={styles.deviceItem}>
                        <div className={styles.deviceCard}>
                            <img src={device.imageUrl} alt={device.name} className={styles.deviceImage} />
                            <p className={styles.deviceName}>{device.name}</p>
                            <p className={styles.devicePrice}>Price: {device.price} Lei</p>
                            <a href={device.url} className={styles.deviceLink}>More Info</a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientSavedDevices;
