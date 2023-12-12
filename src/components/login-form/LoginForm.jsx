import React, {useState} from 'react'
import "./LoginForm.css";
import axios from 'axios';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {GoogleLogin} from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';


function LoginForm() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/sign-in', { email, password })
            .then(result => {
                if (result.data.status === "Success") {
                    // Retrieve the user's personal endpoint from the response
                    const personalEndpoint = result.data.user.personalEndpoint;

                    // Redirect to '/jarvis-chat' + personalEndpoint
                    navigate(`/jarvis-chat/${personalEndpoint}`);
                } else {
                    console.error('Login failed:', result.data.message);
                }
            })
            .catch(err => {
                console.error('Error during login:', err);
                window.alert('Error during login');
            });
    };

   /* const handleGoogleLoginSuccess = (credentialResponse) => {
        const credential = credentialResponse.credential;
        const decoded = jwtDecode(credential); // Decode the JWT token
        // Send the token to the backend
        axios.post('http://localhost:8080/google-login', {token: credential})
            .then(response => {
                if (response.data.status === "Success") {
                    // Redirect to the 'jarvis-chat' page upon successful login
                    navigate('/jarvis-chat');
                } else {
                    // Handle any error situations here (e.g., user not saved)
                    console.error('Login failed:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
        console.log(decoded)
    };*/

    const handleGoogleLoginSuccess = (credentialResponse) => {
        const credential = credentialResponse.credential;
        const decoded = jwtDecode(credential);

        axios.post('http://localhost:8080/google-login', { token: credential })
            .then(response => {
                if (response.data.status === "Success") {
                    const personalEndpoint = response.data.user.personalEndpoint;
                    navigate(`/jarvis-chat/${personalEndpoint}`);
                } else {
                    console.error('Login failed:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
        console.log(decoded)
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
                                <button type="submit" className="btn btn-primary">Submit</button><h2>Login Page</h2>
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={() => {
                                        console.log("Login Failed");
                                    }}
                                />
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LoginForm;
