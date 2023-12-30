import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoadComponent = () => {
    const [loads, setLoads] = useState([]);
    const [selectedLoad, setSelectedLoad] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/get-commercial-truck-loads') // Replace with your actual API endpoint
            .then(response => {
                setLoads(response.data);
            })
            .catch(error => {
                console.error('Error fetching loads:', error);
            });
    }, []);

    const handleLoadClick = (load) => {
        setSelectedLoad(load);
    };

    return (
        <div>
            {loads.map(load => (
                <div key={load._id} onClick={() => handleLoadClick(load)}>
                    <h3>{load.title}</h3> {/* Display the short info */}
                    <p>{JSON.stringify(load)}</p> {/* Display the full info */}
                </div>
            ))}
            {selectedLoad && (
                <div>
                    <h2>Selected Load:</h2>
                    <p>{JSON.stringify(selectedLoad)}</p> {/* Display the full info of the selected load */}
                </div>
            )}
        </div>
    );
};

export default LoadComponent;