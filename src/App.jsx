import send from './assets/send.svg'
import {useState, useEffect} from 'react'
import "./App.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";

const App = () => {
    const [value, setValue] = useState(null)
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState([])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
        setCurrentTitle(uniqueTitle)
    }

    const getMessages = async () => {
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
            } else {
                console.error('No choices available or bad response:', data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
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

    return (
        <div className={`app ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
            <section className={`side-bar ${isSidebarOpen ? 'open' : ''}`}>
                <button onClick={createNewChat}>New chat</button>
                <ul className="history">
                    {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
                </ul>
                <nav>
                    <p>
                        Made by HaulDepot
                    </p>
                </nav>
            </section>
            <button  className={`open-close-sidebar ${isSidebarOpen ? 'move-right' : ''}`} onClick={toggleSidebar}>
                {isSidebarOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
            </button>
            <section className="main">
                {!currentTitle && <h1>Jarvis Assistant</h1>}
                <ul className="feed">
                    {currentChat?.map((chatMessage, index) => <li key={index}>
                        <p className={"role"}>{chatMessage.role}</p>
                        <p>{chatMessage.content}</p>
                    </li>)}
                </ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={value} onChange={(e) => setValue(e.target.value)}/>
                        <div
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
}

export default App;