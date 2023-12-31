import React, {useState} from 'react'
import "./SignUpForm.css";
import {Link} from "react-router-dom";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {GoogleLogin} from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';

function SignUpForm() {
    const [name, setName] = useState(null)
    const [secondName, setSecondName] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://jarvis-ai-logistic-db-server-2.onrender.com/sign-up', {name, secondName, phoneNumber, email, password})
            .then(result => {
                if (result.data.status === "Success") {
                    // Redirect to the login form
                    navigate('/sign-in');
                } else {
                    console.error('Registration failed:', result.data.message);
                }
            })
            .catch(err => {
                console.error('Error during registration:', err);
            });
    };


    const handleGoogleLoginSignUpSuccess = (credentialResponse) => {
        const credential = credentialResponse.credential;
        const decoded = jwtDecode(credential);

        axios.post('https://jarvis-ai-logistic-db-server-2.onrender.com/google-login', {token: credential})
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
        <div className="sign-in-wrapper">
            <div className="left-side">
                <form onSubmit={handleSubmit} className="sign-up-custom-form">
                    <h2 className="h2-title">Create your first account</h2>
                    <h3 className="h3-title">You won't regret it</h3>
                    <label htmlFor="name" className="label-text">Name</label>
                    <input
                        type="text"
                        autoComplete="off"
                        className="input-field-name"
                        id="name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />


                    <label htmlFor="second-name" className="label-text">Second Name</label>
                    <input
                        type="text"
                        autoComplete="off"
                        className="input-field-second-name"
                        id="name"
                        required
                        onChange={(e) => setSecondName(e.target.value)}
                    />

                    <label htmlFor="phone-number" className="label-text">Phone Number</label>
                    <input
                        type="text"
                        autoComplete="off"
                        className="input-field-phone-number"
                        id="name"
                        required
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <label htmlFor="email" className="label-text">Email address</label>
                    <input
                        type="email"
                        className="input-field-email"
                        id="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password" className="label-text">Password</label>
                    <input
                        type="password"
                        className="input-field-password"
                        id="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="sign-up-button">SIGN UP</button>

                    <div className="question-div">
                        <p className="question-p">Already have an account?</p>
                        <Link to="/sign-in" className="sign-in-link-sign-up">Sign in now</Link>
                    </div>
                    <div className="login-with-google-button">
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSignUpSuccess}
                            onError={() => {
                                console.log("Login Failed");
                            }}
                        />
                    </div>

                </form>
            </div>
            <div className="right-side">

            </div>
        </div>

    )
}

/**/

export default SignUpForm;