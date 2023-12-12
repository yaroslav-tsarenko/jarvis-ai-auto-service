import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserPage = () => {
    const [user, setUser] = useState(null);
    const { personalEndpoint } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/user/${personalEndpoint}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [personalEndpoint]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Information</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    );
};

export default UserPage;
