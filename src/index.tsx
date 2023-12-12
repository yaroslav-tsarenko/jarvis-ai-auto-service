import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "./App";
import {GoogleOAuthProvider} from "@react-oauth/google";


ReactDOM.render(
    <GoogleOAuthProvider clientId="510644109835-2cmcgd431ia2uhbhdv4suitadmgih8vp.apps.googleusercontent.com">
        <App/>
    </GoogleOAuthProvider>
    , document.getElementById('root'));
