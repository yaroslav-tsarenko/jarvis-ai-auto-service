import React from 'react';

const UserInfoTable = ({ user }) => {
    // Parse the JSON string to an object
    const userData = JSON.parse(user);

    return (
        <table>
            <thead>
            <tr>
                <th>Attribute</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Name</td>
                <td>{userData.name}</td>
            </tr>
            <tr>
                <td>Second Name</td>
                <td>{userData.secondName}</td>
            </tr>
            <tr>
                <td>Email</td>
                <td>{userData.email}</td>
            </tr>
            <tr>
                <td>Phone Number</td>
                <td>{userData.phoneNumber}</td>
            </tr>
            </tbody>
        </table>
    );
};

export default UserInfoTable;