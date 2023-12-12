import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LoginForm from "./components/login-form/LoginForm";
import JarvisChatPage from "./components/jarvis-chat-page/JarvisChatPage";
import SignUpForm from "./components/sign-up-form/SignUpForm";
import UserPage from "./components/user-page/UserPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/user/:personalEndpoint" element={<UserPage/>} />
                <Route path="/jarvis-chat/:personalEndpoint" element={<JarvisChatPage />} />
                <Route path="/sign-in" element={<LoginForm/>}/>
                <Route path="/" element={<SignUpForm/>}/>
            </Routes>
        </Router>
    )
}

export default App