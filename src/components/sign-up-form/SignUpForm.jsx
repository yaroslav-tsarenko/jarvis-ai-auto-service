import React, {useState} from 'react'
import "./SignUpForm.css";
import {Link} from "react-router-dom";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {GoogleLogin} from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import ReCAPTCHA from "react-google-recaptcha";

function SignUpForm() {
    const [name, setName] = useState(null)
    const [secondName, setSecondName] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate()
    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!captchaValue) {
            alert('Please complete the CAPTCHA');
            return;
        }

        axios.post('https://jarvis-ai-logistic-db-server.onrender.com/sign-up', {name, secondName, phoneNumber, email, password})
            .then(result => {
                if (result.data.status === "Success") {
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

        axios.post('https://jarvis-ai-logistic-db-server.onrender.com/google-login', {token: credential})
            .then(response => {
                if (response.data.status === "Success") {
                    const personalEndpoint = response.data.user.personalEndpoint;

                    // Create a new chat session for the user
                    axios.post('https://jarvis-ai-logistic-db-server.onrender.com/create-chat-session', { userEndpoint: personalEndpoint })
                        .then(response => {
                            if (response.data.status === "Success") {
                                // Redirect to '/jarvis-chat' + personalEndpoint + chatEndpoint
                                navigate(`/jarvis-chat/${personalEndpoint}/${response.data.chatEndpoint}`);
                            } else {
                                console.error('Error creating chat session:', response.data.message);
                            }
                        })
                        .catch(err => {
                            console.error('Error during chat session creation:', err);
                        });
                } else {
                    console.error('Login failed:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
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
                    <ReCAPTCHA className="recaptcha-checkbox" sitekey="6LcsaEgpAAAAADTbchGJZHFaS6EhEYjoBSd6Nwmd" onChange={handleCaptchaChange} />
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

export default SignUpForm;