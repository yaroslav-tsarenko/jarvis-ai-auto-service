import React, {useEffect, useRef, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";
import camera from "../../assets/camera.svg";
import {useParams} from "react-router-dom";
import microphone from "../../assets/microphone.svg";
import send from "../../assets/send.svg";
import "./JarvisChatPage.css";
import axios from 'axios';

const JarvisChatPage = () => {
    const [value, setValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState([])
    const [isTextTransparent, setIsTextTransparent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const submitButton = useRef(null);
    const {personalEndpoint} = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user information from the server using the personalEndpoint
        axios.get(`http://localhost:8080/user/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setUser(response.data); // Set the user data in state
                } else {
                    console.error('User not found');
                    // Handle user not found case
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                // Handle error case
            });

        // Fetch chat history from the server using the personalEndpoint
        axios.get(`http://localhost:8080/chat-history/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setPreviousChats(response.data.chats); // Set the chat history in state
                } else {
                    console.error('Chat history not found');
                    // Handle chat history not found case
                }
            })
            .catch(error => {
                console.error('Error fetching chat history:', error);
                // Handle error case
            });
    }, [personalEndpoint]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const {
        transcript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        console.error("Browser doesn't support speech recognition.");
    }
    const handleStartListening = () => {
        SpeechRecognition.startListening({continuous: true, language: 'en-IN'});
    };


    const handleStopListening = () => {
        SpeechRecognition.stopListening();
        setValue(transcript); // Update the state with the transcript
        resetTranscript();
    };

    useEffect(() => {
        const handleSwipe = (e) => {
            const touchStartX = e.changedTouches[0].clientX;
            const onSwipeEnd = (endEvent) => {
                const touchEndX = endEvent.changedTouches[0].clientX;
                const distance = touchEndX - touchStartX;
                if (distance > 100) { // Swiped right
                    setIsSidebarOpen(true);
                } else if (distance < -100) { // Swiped left
                    setIsSidebarOpen(false);
                }
                document.removeEventListener('touchend', onSwipeEnd);
            };
            document.addEventListener('touchend', onSwipeEnd);
        };
        window.addEventListener('touchstart', handleSwipe);
        return () => {
            window.removeEventListener('touchstart', handleSwipe);
        };
    }, []);
    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const handleClick = (uniqueTitle) => {
        if (uniqueTitle === 'All Chat History') {
            setCurrentTitle(null);
        } else {
            setCurrentTitle(uniqueTitle);
        }
    }

    const clickedSubmitButton = () => {
        setIsTextTransparent(true);
        setTimeout(() => {
            setValue('')
            setIsTextTransparent(false)
        }, 2000)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === submitButton) {
            event.preventDefault();
            getMessages();
            setIsTextTransparent(true);
            setTimeout(() => {
                setValue('')
                setIsTextTransparent(false)
            }, 2000)
        }
    };

    const getMessages = async () => {
        setIsLoading(true);
        if (value === "What is the freight") {
            setMessage({content: "Freight is the way of logistic"});
            return;
        }
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        };
        try {
            const response = await fetch("https://jarvis-ai-logistic-server.onrender.com/completions", options);
            const data = await response.json();
            if (response.ok && data.choices && data.choices.length > 0) {
                setMessage(data.choices[0].message);

                // Save the user's message in the database
                // Save the user's message in the database
                axios.post('http://localhost:8080/chat-history', {
                    userName: user.name,
                    userEndpoint: personalEndpoint,
                    chat: {
                        role: 'You',
                        content: value
                    }
                }).catch(err => {
                    console.error('Error saving chat history:', err);
                });

                // Save the assistant's response in the database
                axios.post('http://localhost:8080/chat-history', {
                    userName: user.name,
                    userEndpoint: personalEndpoint,
                    chat: {
                        role: 'Assistant',
                        content: data.choices[0].message.content
                    }
                }).catch(err => {
                    console.error('Error saving chat history:', err);
                });
            } else {
                console.error('No choices available or bad response:', data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
        setIsLoading(false);
        clickedSubmitButton();
    };


    useEffect(() => {
        console.log(currentTitle, value, message)
        if (!currentTitle && value && message) {
            setCurrentTitle(value)
        }
        if (currentTitle && value && message) {
            setPreviousChats(prevChats => (
                [...prevChats,
                    {
                        title: currentTitle,
                        role: "You",
                        content: value
                    },
                    {
                        title: currentTitle,
                        role: message.role,
                        content: message.content
                    }
                ]
            ))
        }
    }, [message, currentTitle])

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

    console.log(uniqueTitles)
    console.log(previousChats)

    const handleLogout = () => {
        setUser(null); // Clear the user data from the state
        navigate('/sign-in'); // Navigate to the login form
    };

    return (
        <div className={`app ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
            <section className={`side-bar ${isSidebarOpen ? 'open' : ''}`}>
                <button onClick={createNewChat}>New chat</button>
                <ul className="history">
                    {uniqueTitles?.map((uniqueTitle, index) => <li key={index}
                                                                   onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
                </ul>
                <nav>
                    <p>
                        Made by HaulDepot
                    </p>
                </nav>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </section>
            <button className={`open-close-sidebar ${isSidebarOpen ? 'move-right' : ''}`} onClick={toggleSidebar}>
                {isSidebarOpen ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faBars}/>}
            </button>
            <section className="main">
                {!currentTitle && user && <h1 className="greeting">Hello {user.name}, nice to meet you!👋</h1>}
                <ul className="feed">
                    {previousChats.map((chatMessage, index) => (
                        <li key={index}>
                            <p className={"role"}>{chatMessage.role}</p>
                            <p>{chatMessage.content}</p>
                        </li>
                    ))}
                </ul>
                <div className="loader">{isLoading ?
                    <span>Jarvis is typing.<span>.</span><span>.</span></span> : ''}</div>

                <div className="bottom-section">
                    <div className="input-container">
                        <input
                            value={transcript || value}
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setValue(e.target.value)}
                            style={{color: isTextTransparent ? 'transparent' : 'inherit'}}/>
                        <div
                            className="camera-button"
                            id="camera">
                            <img src={camera} alt="camera"/>
                        </div>
                        <div
                            className="use-mic-button"
                            onMouseDown={handleStartListening}
                            onMouseUp={handleStopListening}
                            id="use-mic">
                            <img src={microphone} alt="microphone"/>
                        </div>
                        <div
                            className="submit-button"
                            id="submit"
                            onClick={getMessages}>
                            <img src={send} alt=""/>
                        </div>
                    </div>
                    <p className="info">
                        Jarvis Assistant. Free Research Preview.
                        Our goal is to help customers resolve logistic issues
                    </p>
                </div>
            </section>
        </div>
    );
};

export default JarvisChatPage;