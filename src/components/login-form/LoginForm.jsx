import React, {useState} from 'react'
import "./LoginForm.css";
import axios from 'axios';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";

function LoginForm() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/sign-in', { email, password })
            .then(result => {
                console.log(result);
                // Assuming the successful response is an object with a status key
                if (result.data.status === "Success") {
                    navigate('/jarvis-chat');
                } else {
                    // Handle the situation where login is not successful
                    console.error('Login failed:', result.data);
                }
            })
            .catch(err => {
                // Handle the error properly
                console.error('Error during login:', err);
            });
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Login</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="label-text">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="label-text">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Link to="/">I don't have account</Link>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LoginForm;
