import React, {useState} from 'react'
import "./SignUpForm.css";
import {Link} from "react-router-dom";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function SignUpForm() {
    const [name, setName] = useState(null)
    const [secondName, setSecondName] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/sign-up', {name, secondName, phoneNumber, email, password})
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

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Sign Up</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="label-text">Name</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        id="name"
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="second-name" className="label-text">Second Name</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        id="name"
                                        required
                                        onChange={(e) => setSecondName(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone-number" className="label-text">Phone Number</label>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        id="name"
                                        required
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
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
                                <Link to="/sign-in">Already have account</Link>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SignUpForm;