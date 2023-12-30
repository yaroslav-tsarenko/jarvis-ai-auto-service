import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommercialTruckLoadComponent = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/get-commercial-truck-loads')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);

    return (
        <div>
            {data.map((item, index) => (
                <div key={index}>
                    <h3>Vehicle Type: {item.vehicleType}</h3>
                    <p>Vehicle Model: {item.vehicleModel}</p>
                    <p>Vehicle Year: {item.vehicleYear}</p>
                    <p>Vehicle Color: {item.vehicleColor}</p>
                    <p>Vehicle License Plate: {item.vehicleLicensePlate}</p>
                    <p>Vehicle VIN: {item.vehicleVin}</p>
                    <p>Pickup Location: {item.pickupLocation}</p>
                    <p>Delivery Location: {item.deliveryLocation}</p>
                    <p>Is Convertible: {item.isConvertible ? 'Yes' : 'No'}</p>
                    <p>Is Modified: {item.isModified ? 'Yes' : 'No'}</p>
                    <p>Is Inoperable: {item.isInoperable ? 'Yes' : 'No'}</p>
                    <p>Service Level: {item.serviceLevel}</p>
                    <p>Enclosed Transport: {item.enclosedTransport ? 'Yes' : 'No'}</p>
                    <p>Terms Agreed: {item.termsAgreed ? 'Yes' : 'No'}</p>
                    <p>Delivery Date: {new Date(item.deliveryDate).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default CommercialTruckLoadComponent;