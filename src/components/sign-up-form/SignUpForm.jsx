import React, {useState} from 'react'
import "./SignUpForm.css";
import {Link} from "react-router-dom";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function SignUpForm() {
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/sign-up', {name, email, password})
            .then(result => {
                console.log(result)
                navigate('/sign-in')
            })
            .catch(err => console.log(err))

    }
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