import React, {useEffect, useRef, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";
import userAvatar from "../../assets/userAvatar.svg";
import {useParams} from "react-router-dom";
import assistantAvatar from "../../assets/jarvisAvatar.svg";
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
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const {personalEndpoint, chatEndpoint} = useParams();
    const [allChatSessions, setAllChatSessions] = useState([]);
    const [hasStartedConversation, setHasStartedConversation] = useState(false);
    const isAskingForUserInfo = (message) => {
        const keywords = ["tell me about myself", "who am i", "my information", "my details", "show my profile",
            "my personal info", "what do you know about me", "give me my details", "display my information", "about me",
            "my user info", "my identity"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
    };
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
        // Fetch chat history from the server using the personalEndpoint
        axios.get(`http://localhost:8080/chat-history/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setPreviousChats(response.data.chats); // Set the chat history in state

                    // If the chat history is not empty, set hasStartedConversation to true
                    if (response.data.chats.length > 0) {
                        setHasStartedConversation(true);
                    }
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

    const createNewChatSession = () => {
        axios.post('http://localhost:8080/create-chat-session', {userEndpoint: personalEndpoint})
            .then(response => {
                if (response.data.status === "Success") {
                    // Redirect to the new chat session endpoint
                    navigate(`/jarvis-chat/${personalEndpoint}/${response.data.chatEndpoint}`);

                    // Update the allChatSessions state with the new chat session
                    setAllChatSessions(prevChatSessions => [
                        ...prevChatSessions,
                        {
                            chatEndpoint: response.data.chatEndpoint,
                            // Add any other necessary properties of the chat session
                        }
                    ]);

                    // Reset the hasStartedConversation state to false
                    setHasStartedConversation(false);
                }
            })
            .catch(err => {
                console.error('Error creating chat session:', err);
            });
    };

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

    const isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

    const saveChatMessage = (content, role) => {
        axios.post('http://localhost:8080/chat-message', {
            userEndpoint: personalEndpoint,
            chatEndpoint: chatEndpoint,
            chat: {
                role: role,
                content: content
            }
        }).catch(err => {
            console.error('Error saving chat message:', err);
        });
    };
// This function will take a JSON string, parse it and then create a JSX table
    const jsonToTable = (jsonContent) => {
        try {
            const userInfo = JSON.parse(jsonContent);
            return (
                <table className="beautiful-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Second Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{userInfo.name}</td>
                        <td>{userInfo.secondName}</td>
                        <td>{userInfo.email}</td>
                        <td>{userInfo.phoneNumber}</td>
                    </tr>
                    </tbody>
                </table>
            );
        } catch (e) {
            // If JSON parsing fails, return the original content
            return <p>{jsonContent}</p>;
        }
    };

    const getMessages = async () => {
        setHasStartedConversation(true);
        setIsLoading(true);
        if (isAskingForUserInfo(value)) {
            const userInfo = {
                name: user.name,
                secondName: user.secondName,
                email: user.email,
                phoneNumber: user.phoneNumber
            };
            // Convert userInfo to a string or JSON object
            const userInfoString = JSON.stringify(userInfo);

            // Update the chat with the user's information
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: userInfoString
            }]);
            saveChatMessage(value, 'You'); // User's message
            saveChatMessage(userInfoString, 'Assistant'); // Assistant's message
            setValue('');
            setIsLoading(false);
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
                const assistantResponse = data.choices[0].message;
                setMessage(assistantResponse);
                // Save both user's message and assistant's response
                saveChatMessage(value, 'You'); // User's message
                saveChatMessage(assistantResponse.content, 'Assistant');
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

    useEffect(() => {
        // Fetch chat history for the current chat session
        axios.get(`http://localhost:8080/chat-session/${chatEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setPreviousChats(response.data.chats);
                } else {
                    console.error('Chat session not found');
                }
            })
            .catch(error => {
                console.error('Error fetching chat session:', error);
            });
    }, [chatEndpoint]);


    useEffect(() => {
        // Fetch all chat sessions for the user
        axios.get(`http://localhost:8080/user-chat-sessions/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setAllChatSessions(response.data.chatSessions);
                } else {
                    console.error('No chat sessions found');
                }
            })
            .catch(error => {
                console.error('Error fetching chat sessions:', error);
            });
    }, [personalEndpoint]); // Dependency on personalEndpoint
    const handleDeleteAllChatSessions = () => {
        const confirmation = window.confirm('Are you sure you want to delete all chat sessions?');
        if (confirmation) {
            axios.delete(`http://localhost:8080/delete-all-chat-sessions/${personalEndpoint}`)
                .then(response => {
                    if (response.status === 200) {
                        console.log('All chat sessions deleted');
                        setAllChatSessions([]); // Clear the chat sessions from the state
                        window.alert('All chat sessions have been deleted successfully'); // Display confirmation message
                    } else {
                        console.error('Failed to delete chat sessions');
                    }
                })
                .catch(error => {
                    console.error('Error deleting chat sessions:', error);
                });
        }
    };

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
                <div className="control-buttons">
                    <button className="new-chat-session-button" onClick={createNewChatSession}>New chat session</button>
                    <button className="clear-chat-history" onClick={handleDeleteAllChatSessions}>Clear chat history
                    </button>
                </div>
                <div className="chat-sessions">
                    {allChatSessions.map((session, index) => (
                        <div key={index} className="chat-session-item"
                             onClick={() => navigate(`/jarvis-chat/${personalEndpoint}/${session.chatEndpoint}`)}>
                            Chat Session {index + 1}
                        </div>
                    ))}
                </div>
                <div className="sidebar-bottom-section">
                    <nav>
                        <p>
                            Made by HaulDepot
                        </p>
                    </nav>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </section>
            <button className={`open-close-sidebar ${isSidebarOpen ? 'move-right' : ''}`} onClick={toggleSidebar}>
                {isSidebarOpen ? <FontAwesomeIcon icon={faTimes}/> : <FontAwesomeIcon icon={faBars}/>}
            </button>
            <section className="main">
                {!hasStartedConversation && user && <h1 className="greeting">Hello {user.name}, nice to meet you!👋</h1>}
                <ul className="feed">
                    {previousChats.map((chatMessage, index) => (
                        <li key={index} className={`message ${chatMessage.role}`}>
                            <div className="message-header">
    <span className="avatar-container">
      <img src={chatMessage.role === 'You' ? userAvatar : assistantAvatar} alt={chatMessage.role}
           className="chat-avatar"/>
    </span>
                                <div className="message-content">
                                    <span className="avatar-label">{chatMessage.role === 'You' ? 'You' : 'Jarvis'}</span>

                                    {chatMessage.role === 'Assistant' && isJson(chatMessage.content) ? (
                                        jsonToTable(chatMessage.content)
                                    ) : (
                                        <p className="p-text-message">{chatMessage.content}</p>
                                    )}
                                </div>
                            </div>

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