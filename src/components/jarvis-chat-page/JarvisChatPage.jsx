import React, {useEffect, useRef, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from "react-speech-recognition";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, useNavigate} from "react-router-dom";
import {faBars, faTimes} from "@fortawesome/free-solid-svg-icons";
import {ReactComponent as FaTimesCustomIcon} from "../../assets/customFaTimes.svg";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
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
    const inputContainer = useRef(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const {personalEndpoint, chatEndpoint} = useParams();
    const [allChatSessions, setAllChatSessions] = useState([]);
    const [hasStartedConversation, setHasStartedConversation] = useState(false);
    const [showCategoryPopup, setShowCategoryPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showSubCategoryPopup, setShowSubCategoryPopup] = useState(false);
    const [subCategories, setSubCategories] = useState([]);
    const [mainCategory, setMainCategory] = useState('');
    const closePopup = () => {
        setShowCategoryPopup(false);
    };

    const categoryOptions = ["My Details", "I want to deliver a vehicle", "Freight", "Heavy Equipment", "Residential Commercial Moving", "I need free consultation", "Other"];
    // Updated function to handle the main category selection and show corresponding subcategory popup
    const handleCategorySelect = (category) => {
        const lowerCaseCategory = category.toLowerCase();
        setSelectedCategory(lowerCaseCategory);
        setShowCategoryPopup(false); // Close the main category popup
        setMainCategory(lowerCaseCategory); // Set the main category for conditional subcategory rendering

        // Define subcategories based on the main category selected
        const subCategoryMap = {
            "freight": ["Less than truckload (LTL)", "Full truckload (FTL)", "Expedite"],
            "i want to deliver a vehicle": ["Car or light truck", "Moto equipment", "Commercial Truck", "Boat load", "Construction equipment"],
            "residential commercial moving": [
                "Local Moving (less than 50 miles)", "Long Distance Moving", "International Moving",
                "Commercial/Business Moving", "Office Moving", "Heavy lifting and moving Only",
                "Moving Storage Service", "Auto Moto Boat Equipment", "Military moving",
                "Corporate Moving", "Student Move"
            ],
        };

        if (subCategoryMap[lowerCaseCategory]) {
            setSubCategories(subCategoryMap[lowerCaseCategory]); // Set subcategories
            setShowSubCategoryPopup(true); // Show the subcategory popup
        } else {
            // Handle categories with no subcategories, if any
            if (["my details", "heavy equipment", "i need free consultation", "other"].includes(lowerCaseCategory)) {
                setValue(lowerCaseCategory); // Set the input field's value to the selected category
            }
        }
    };
    useEffect(() => {
        const values = [
            "car or light truck",
            "my details",
            "moto equipment",
            "commercial truck",
            "boat load",
            "construction equipment",
            "heavy equipment",
            "less than truckload (ltl)",
            "full truckload (ftl)",
            "expedite",
            "other",
            "i need free consultation",
            "local moving (less than 50 miles)",
            "long distance moving",
            "international moving",
            "commercial/business moving",
            "office moving",
            "heavy lifting and moving only",
            "moving storage service",
            "auto moto boat equipment",
            "military moving",
            "corporate moving",
            "student move",
            "office moving"];
        if (values.includes(value) && submitButton && submitButton.current) {
            submitButton.current.click();
        }
    }, [value]);
    const handleSubCategorySelect = (subCategory) => {
        const lowerCaseSubCategory = subCategory.toLowerCase();
        console.log(`Subcategory selected: ${lowerCaseSubCategory}`);
        setShowSubCategoryPopup(false);
        setValue(lowerCaseSubCategory);
        if (lowerCaseSubCategory === "car or light truck") {
            submitButton.current.click();
        }
    };

    const isAskingForUserInfo = (message) => {
        if (!message) return false;
        const lowerCaseMessage = message.toLowerCase();
        const keywords = [
            "tell me about myself", "who am i", "my information", "my details", "show my profile",
            "my personal info", "what do you know about me", "give me my details", "display my information", "about me",
            "my user info", "my identity"
        ];
        return keywords.some(keyword => lowerCaseMessage.includes(keyword.toLowerCase()));
    };

    const isUserMakeCorporateMovingForm = (message) => {
        if (!message) return false;
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["corporate moving"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeStudentMovingForm = (message) => {
        if (!message) return false;
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["student move"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeAutoMotoBoatEquipmentForm = (message) => {
        if (!message) return false;
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["auto moto boat equipment"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeMilitaryMovingForm = (message) => {
        if (!message) return false;
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["military moving"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeHeavyLiftingAndMovingOnlyForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["heavy lifting and moving only"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeOfficeMovingForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["office moving"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };

    const isUserMakeMovingAndStorageServiceForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["moving storage service"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserNeedFreeConsulationForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["i need free consultation"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeOtherForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["other"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeExpediteLoadForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["expedite"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };

    const isUserMakeCommercialBusinessMovingForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["commercial/business moving"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeLongDistanceMoving = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["long distance moving"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeLocalMoving = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["local moving (less than 50 miles)"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeFTLLoadForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["full truckload (ftl)"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeCarOrLightTruckLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["car or light truck"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeLTLLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["less than truckload (ltl)"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeMotoLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["moto equipment"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };

    const isUserMakeInternationalMovingForm = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["international moving"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };
    const isUserMakeCommercialTruckLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["commercial truck"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };

    const isUserMakeBoatLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["boat load"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };

    const isUserMakeEquipmentConstructionLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["construction equipment"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };

    const isUserMakeHeavyEquipmentLoad = (message) => {
        if (!message) return false; // Return false if message is null or undefined
        const lowerCaseMessage = message.toLowerCase();
        const keywords = ["heavy equipment"];
        return keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())) ? "showForm" : false;
    };


    useEffect(() => {
        // Fetch user information from the server using the personalEndpoint
        axios.get(`http://localhost:8080/user/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setUser(response.data); // Set the user data in state
                } else {
                    console.error('User not found');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

        axios.get(`http://localhost:8080/chat-history/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setPreviousChats(response.data.chats);
                    if (response.data.chats.length > 0) {
                        setHasStartedConversation(true);
                    }
                } else {
                    console.error('Chat history not found');
                }
            })
            .catch(error => {
                console.error('Error fetching chat history:', error);
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
                    navigate(`/jarvis-chat/${personalEndpoint}/${response.data.chatEndpoint}`);
                    setAllChatSessions(prevChatSessions => [
                        ...prevChatSessions,
                        {
                            chatEndpoint: response.data.chatEndpoint,
                        }
                    ]);
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
        }).then(response => {
        }).catch(err => {
            console.error('Error saving chat message:', err);
        });
    };

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
            return <p>{jsonContent}</p>;
        }
    };
    const LocalMovingDeliveryInfoTable = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Customer's Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Current Address</th>
                    <th>New Address</th>
                    <th>Preferred Move Date</th>
                    <th>Alternative Move Date</th>
                    <th>Preferred Time Window</th>
                    <th>Property Type at Current Location</th>
                    <th>Property Type at New Location</th>
                    <th>Number of Bedrooms</th>
                    <th>Floor Number</th>
                    <th>Elevator Availability</th>
                    <th>List of Items to Move</th>
                    <th>Full Packing</th>
                    <th>Partial Packing</th>
                    <th>No Packing</th>
                    <th>Special Handling</th>
                    <th>Insurance Coverage Needed</th>
                    <th>Storage Required</th>
                    <th>Assembly/Disassembly Services</th>
                    <th>Parking Availability for Moving Truck</th>
                    <th>Any Known Obstructions or Narrow Passages</th>
                    <th>Payment Method Preference</th>
                    <th>Additional Notes</th>
                    <th>Customer’s Signature</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.customerName}</td>
                    <td>{deliveryInfo.phoneNumber}</td>
                    <td>{deliveryInfo.email}</td>
                    <td>{deliveryInfo.currentAddress}</td>
                    <td>{deliveryInfo.newAddress}</td>
                    <td>{deliveryInfo.preferredMoveDate}</td>
                    <td>{deliveryInfo.alternativeMoveDate}</td>
                    <td>{deliveryInfo.preferredTimeWindow}</td>
                    <td>{deliveryInfo.propertyTypeCurrent}</td>
                    <td>{deliveryInfo.propertyTypeNew}</td>
                    <td>{deliveryInfo.numberOfBedrooms}</td>
                    <td>{deliveryInfo.floorNumber}</td>
                    <td>{deliveryInfo.elevatorAvailability ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.itemsToMove}</td>
                    <td>{deliveryInfo.fullPacking ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.partialPacking ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.noPacking ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.specialHandling}</td>
                    <td>{deliveryInfo.insuranceNeeded ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.storageRequired ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.assemblyServices ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.parkingAvailability ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.obstructions}</td>
                    <td>{deliveryInfo.paymentMethod}</td>
                    <td>{deliveryInfo.additionalNotes}</td>
                    <td>{deliveryInfo.customerSignature}</td>
                    <td>{deliveryInfo.date}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const OfficeInfoTable = ({officeInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Primary Contact Name</th>
                    <th>Primary Contact Phone</th>
                    <th>Primary Contact Email</th>
                    <th>Current Office Address</th>
                    <th>New Office Address</th>
                    <th>Preferred Moving Date</th>
                    <th>Preferred Moving Time</th>
                    <th>Size of Office</th>
                    <th>Number of Employees</th>
                    <th>Detailed Inventory List</th>
                    <th>Special Handling Items</th>
                    <th>Packing Services Required</th>
                    <th>Insurance Required</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{officeInfo.companyName}</td>
                    <td>{officeInfo.primaryContactName}</td>
                    <td>{officeInfo.primaryContactPhone}</td>
                    <td>{officeInfo.primaryContactEmail}</td>
                    <td>{officeInfo.currentOfficeAddress}</td>
                    <td>{officeInfo.newOfficeAddress}</td>
                    <td>{officeInfo.preferredMovingDate}</td>
                    <td>{officeInfo.preferredMovingTime}</td>
                    <td>{officeInfo.sizeOfOffice}</td>
                    <td>{officeInfo.numberOfEmployees}</td>
                    <td>{officeInfo.detailedInventoryList}</td>
                    <td>{officeInfo.specialHandlingItems}</td>
                    <td>{officeInfo.packingServicesRequired ? 'Yes' : 'No'}</td>
                    <td>{officeInfo.insuranceRequired ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const OfficeMovingForm = () => {
        const [formData, setFormData] = useState({
            companyName: '',
            primaryContactName: '',
            primaryContactPhone: '',
            primaryContactEmail: '',
            currentOfficeAddress: '',
            newOfficeAddress: '',
            preferredMovingDate: '',
            preferredMovingTime: '',
            sizeOfOffice: '',
            numberOfEmployees: '',
            detailedInventoryList: '',
            specialHandlingItems: '',
            packingServicesRequired: false,
            insuranceRequired: false,
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-office-moving', formData);
                if (response.status === 200) {
                    alert('Form submitted successfully');
                    const newLoad = response.data.moving; // Get the new moving data from the response
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: "Your office moving request has been submitted successfully",
                    }]);
                } else {
                    alert('Error submitting form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="companyName">Company Name</label>
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />

                    <label htmlFor="primaryContactName">Primary Contact Name</label>
                    <input type="text" id="primaryContactName" name="primaryContactName" value={formData.primaryContactName} onChange={handleChange} required />

                    <label htmlFor="primaryContactPhone">Primary Contact Phone</label>
                    <input type="tel" id="primaryContactPhone" name="primaryContactPhone" value={formData.primaryContactPhone} onChange={handleChange} required />

                    <label htmlFor="primaryContactEmail">Primary Contact Email</label>
                    <input type="email" id="primaryContactEmail" name="primaryContactEmail" value={formData.primaryContactEmail} onChange={handleChange} required />

                    <label htmlFor="currentOfficeAddress">Current Office Address</label>
                    <input type="text" id="currentOfficeAddress" name="currentOfficeAddress" value={formData.currentOfficeAddress} onChange={handleChange} required />

                    <label htmlFor="newOfficeAddress">New Office Address</label>
                    <input type="text" id="newOfficeAddress" name="newOfficeAddress" value={formData.newOfficeAddress} onChange={handleChange} required />

                    <label htmlFor="preferredMovingDate">Preferred Moving Date</label>
                    <input type="date" id="preferredMovingDate" name="preferredMovingDate" value={formData.preferredMovingDate} onChange={handleChange} required />

                    <label htmlFor="preferredMovingTime">Preferred Moving Time</label>
                    <input type="time" id="preferredMovingTime" name="preferredMovingTime" value={formData.preferredMovingTime} onChange={handleChange} required />

                    <label htmlFor="sizeOfOffice">Size of Office</label>
                    <input type="text" id="sizeOfOffice" name="sizeOfOffice" value={formData.sizeOfOffice} onChange={handleChange} required />

                    <label htmlFor="numberOfEmployees">Number of Employees</label>
                    <input type="number" id="numberOfEmployees" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} required />

                    <label htmlFor="detailedInventoryList">Detailed Inventory List</label>
                    <textarea id="detailedInventoryList" name="detailedInventoryList" value={formData.detailedInventoryList} onChange={handleChange} required />

                    <label htmlFor="specialHandlingItems">Special Handling Items</label>
                    <textarea id="specialHandlingItems" name="specialHandlingItems" value={formData.specialHandlingItems} onChange={handleChange} />

                    <label htmlFor="packingServicesRequired">Packing Services Required</label>
                    <input type="checkbox" id="packingServicesRequired" name="packingServicesRequired" checked={formData.packingServicesRequired} onChange={handleChange} />

                    <label htmlFor="insuranceRequired">Insurance Required</label>
                    <input type="checkbox" id="insuranceRequired" name="insuranceRequired" checked={formData.insuranceRequired} onChange={handleChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };
    const AutoMotoBoatEquipmentForm = () => {
        const [formData, setFormData] = useState({
            customerName: '',
            contactPhone: '',
            emailAddress: '',
            vehicleEquipmentType: '',
            make: '',
            model: '',
            year: '',
            vinSerialNumber: '',
            color: '',
            condition: '',
            serviceTypeRequested: '',
            specificServiceRequests: '',
            preferredServiceDate: '',
            alternateServiceDate: '',
            pickUpRequired: false,
            deliveryRequired: false,
            pickUpDeliveryAddress: '',
            insuranceProvider: '',
            policyNumber: '',
            preferredPaymentMethod: '',
            additionalCommentsInstructions: '',
            signature: '',
            date: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-auto-moto-boat-equipment', formData);
                if (response.status === 200) {
                    setPreviousChats([...previousChats, {role: "You", content: value}, {
                        role: "Assistant",
                        content: <AutoMotoBoatEquipmentInfoTable equipmentInfo={response.data.data}/>
                    }]);
                    saveChatMessage(value, 'You');
                    setValue('');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
                    <label htmlFor="contactPhone">Contact Phone</label>
                    <input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />
                    <label htmlFor="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />
                    <label htmlFor="vehicleEquipmentType">Vehicle/Equipment Type</label>
                    <input type="text" id="vehicleEquipmentType" name="vehicleEquipmentType" value={formData.vehicleEquipmentType} onChange={handleChange} required />
                    <label htmlFor="make">Make</label>
                    <input type="text" id="make" name="make" value={formData.make} onChange={handleChange} required />
                    <label htmlFor="model">Model</label>
                    <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} required />
                    <label htmlFor="year">Year</label>
                    <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required />
                    <label htmlFor="vinSerialNumber">VIN/Serial Number</label>
                    <input type="text" id="vinSerialNumber" name="vinSerialNumber" value={formData.vinSerialNumber} onChange={handleChange} required />
                    <label htmlFor="color">Color</label>
                    <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} required />
                    <label htmlFor="condition">Condition</label>
                    <input type="text" id="condition" name="condition" value={formData.condition} onChange={handleChange} required />
                    <label htmlFor="serviceTypeRequested">Service Type Requested</label>
                    <input type="text" id="serviceTypeRequested" name="serviceTypeRequested" value={formData.serviceTypeRequested} onChange={handleChange} required />
                    <label htmlFor="specificServiceRequests">Specific Service Requests</label>
                    <input type="text" id="specificServiceRequests" name="specificServiceRequests" value={formData.specificServiceRequests} onChange={handleChange} required />
                    <label htmlFor="preferredServiceDate">Preferred Service Date</label>
                    <input type="date" id="preferredServiceDate" name="preferredServiceDate" value={formData.preferredServiceDate} onChange={handleChange} required />
                    <label htmlFor="alternateServiceDate">Alternate Service Date</label>
                    <input type="date" id="alternateServiceDate" name="alternateServiceDate" value={formData.alternateServiceDate} onChange={handleChange} required />
                    <label htmlFor="pickUpRequired">Pick-Up Required</label>
                    <input type="checkbox" id="pickUpRequired" name="pickUpRequired" checked={formData.pickUpRequired} onChange={handleChange} />
                    <label htmlFor="deliveryRequired">Delivery Required</label>
                    <input type="checkbox" id="deliveryRequired" name="deliveryRequired" checked={formData.deliveryRequired} onChange={handleChange} />
                    <label htmlFor="pickUpDeliveryAddress">Pick-Up/Delivery Address</label>
                    <input type="text" id="pickUpDeliveryAddress" name="pickUpDeliveryAddress" value={formData.pickUpDeliveryAddress} onChange={handleChange} required />
                    <label htmlFor="insuranceProvider">Insurance Provider</label>
                    <input type="text" id="insuranceProvider" name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} />
                    <label htmlFor="policyNumber">Policy Number</label>
                    <input type="text" id="policyNumber" name="policyNumber" value={formData.policyNumber} onChange={handleChange} />
                    <label htmlFor="preferredPaymentMethod">Preferred Payment Method</label>
                    <input type="text" id="preferredPaymentMethod" name="preferredPaymentMethod" value={formData.preferredPaymentMethod} onChange={handleChange} required />
                    <label htmlFor="additionalCommentsInstructions">Additional Comments/Instructions</label>
                    <textarea id="additionalCommentsInstructions" name="additionalCommentsInstructions" value={formData.additionalCommentsInstructions} onChange={handleChange} />
                    <label htmlFor="signature">Signature</label>
                    <input type="text" id="signature" name="signature" value={formData.signature} onChange={handleChange} required />
                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };
    const CorporateMovingForm = () => {
        const [formData, setFormData] = useState({
            companyName: '',
            primaryContactName: '',
            contactPhoneNumber: '',
            contactEmailAddress: '',
            currentAddress: '',
            newAddress: '',
            preferredMovingDate: '',
            alternateMovingDate: '',
            estimatedVolumeOrSizeOfMove: '',
            numberOfEmployeesDesksToMove: '',
            specialEquipmentToMove: '',
            accessRestrictions: '',
            insuranceRequirements: '',
            specialHandlingInstructions: '',
            packingServicesNeeded: false,
            storageRequirements: '',
            budgetRange: '',
            decisionMakerName: '',
            decisionMakerContactInformation: '',
            additionalServicesRequested: '',
            commentsAdditionalInstructions: '',
            confirmationOfTermsAndConditions: false,
            formSubmissionDate: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-corporate-moving', formData);
                if (response.status === 200) {
                    setPreviousChats([...previousChats, {role: "You", content: value}, {
                        role: "Assistant",
                        content: <CorporateMovingInfoTable movingInfo={response.data.data}/>
                    }]);
                    saveChatMessage(value, 'You');
                    setValue('');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

            return (
                <form className="car-delivery-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />

                        <label htmlFor="primaryContactName">Primary Contact Name</label>
                        <input type="text" id="primaryContactName" name="primaryContactName" value={formData.primaryContactName} onChange={handleChange} required />

                        <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
                        <input type="tel" id="contactPhoneNumber" name="contactPhoneNumber" value={formData.contactPhoneNumber} onChange={handleChange} required />

                        <label htmlFor="contactEmailAddress">Contact Email Address</label>
                        <input type="email" id="contactEmailAddress" name="contactEmailAddress" value={formData.contactEmailAddress} onChange={handleChange} required />

                        <label htmlFor="currentAddress">Current Address</label>
                        <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />

                        <label htmlFor="newAddress">New Address</label>
                        <input type="text" id="newAddress" name="newAddress" value={formData.newAddress} onChange={handleChange} required />

                        <label htmlFor="preferredMovingDate">Preferred Moving Date</label>
                        <input type="date" id="preferredMovingDate" name="preferredMovingDate" value={formData.preferredMovingDate} onChange={handleChange} required />

                        <label htmlFor="alternateMovingDate">Alternate Moving Date</label>
                        <input type="date" id="alternateMovingDate" name="alternateMovingDate" value={formData.alternateMovingDate} onChange={handleChange} required />

                        <label htmlFor="estimatedVolumeOrSizeOfMove">Estimated Volume Or Size Of Move</label>
                        <input type="text" id="estimatedVolumeOrSizeOfMove" name="estimatedVolumeOrSizeOfMove" value={formData.estimatedVolumeOrSizeOfMove} onChange={handleChange} required />

                        <label htmlFor="numberOfEmployeesDesksToMove">Number Of Employees/Desks To Move</label>
                        <input type="number" id="numberOfEmployeesDesksToMove" name="numberOfEmployeesDesksToMove" value={formData.numberOfEmployeesDesksToMove} onChange={handleChange} required />

                        <label htmlFor="specialEquipmentToMove">Special Equipment To Move</label>
                        <input type="text" id="specialEquipmentToMove" name="specialEquipmentToMove" value={formData.specialEquipmentToMove} onChange={handleChange} />

                        <label htmlFor="accessRestrictions">Access Restrictions</label>
                        <input type="text" id="accessRestrictions" name="accessRestrictions" value={formData.accessRestrictions} onChange={handleChange} required />

                        <label htmlFor="insuranceRequirements">Insurance Requirements</label>
                        <input type="text" id="insuranceRequirements" name="insuranceRequirements" value={formData.insuranceRequirements} onChange={handleChange} />

                        <label htmlFor="specialHandlingInstructions">Special Handling Instructions</label>
                        <input type="text" id="specialHandlingInstructions" name="specialHandlingInstructions" value={formData.specialHandlingInstructions} onChange={handleChange} />

                        <label htmlFor="packingServicesNeeded">Packing Services Needed</label>
                        <input type="checkbox" id="packingServicesNeeded" name="packingServicesNeeded" checked={formData.packingServicesNeeded} onChange={handleChange} />

                        <label htmlFor="storageRequirements">Storage Requirements</label>
                        <input type="text" id="storageRequirements" name="storageRequirements" value={formData.storageRequirements} onChange={handleChange} required />

                        <label htmlFor="budgetRange">Budget Range</label>
                        <input type="text" id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleChange} required />

                        <label htmlFor="decisionMakerName">Decision Maker Name</label>
                        <input type="text" id="decisionMakerName" name="decisionMakerName" value={formData.decisionMakerName} onChange={handleChange} required />

                        <label htmlFor="decisionMakerContactInformation">Decision Maker Contact Information</label>
                        <input type="text" id="decisionMakerContactInformation" name="decisionMakerContactInformation" value={formData.decisionMakerContactInformation} onChange={handleChange} required />

                        <label htmlFor="additionalServicesRequested">Additional Services Requested</label>
                        <input type="text" id="additionalServicesRequested" name="additionalServicesRequested" value={formData.additionalServicesRequested} onChange={handleChange} />

                        <label htmlFor="commentsAdditionalInstructions">Comments/Additional Instructions</label>
                        <input type="text" id="commentsAdditionalInstructions" name="commentsAdditionalInstructions" value={formData.commentsAdditionalInstructions} onChange={handleChange} />

                        <label htmlFor="confirmationOfTermsAndConditions">Confirmation Of Terms And Conditions</label>
                        <input type="checkbox" id="confirmationOfTermsAndConditions" name="confirmationOfTermsAndConditions" checked={formData.confirmationOfTermsAndConditions} onChange={handleChange} />

                        <label htmlFor="formSubmissionDate">Form Submission Date</label>
                        <input type="date" id="formSubmissionDate" name="formSubmissionDate" value={formData.formSubmissionDate} onChange={handleChange} required />
                    </div>

                    <button type="submit">Submit</button>
                </form>

            );
        };
    const CorporateMovingInfoTable = ({movingInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Primary Contact Name</th>
                    <th>Contact Phone Number</th>
                    <th>Contact Email Address</th>
                    <th>Current Address</th>
                    <th>New Address</th>
                    <th>Preferred Moving Date</th>
                    <th>Alternate Moving Date</th>
                    <th>Estimated Volume Or Size Of Move</th>
                    <th>Number Of Employees/Desks To Move</th>
                    <th>Special Equipment To Move</th>
                    <th>Access Restrictions</th>
                    <th>Insurance Requirements</th>
                    <th>Special Handling Instructions</th>
                    <th>Packing Services Needed</th>
                    <th>Storage Requirements</th>
                    <th>Budget Range</th>
                    <th>Decision Maker Name</th>
                    <th>Decision Maker Contact Information</th>
                    <th>Additional Services Requested</th>
                    <th>Comments/Additional Instructions</th>
                    <th>Confirmation Of Terms And Conditions</th>
                    <th>Form Submission Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.companyName}</td>
                    <td>{movingInfo.primaryContactName}</td>
                    <td>{movingInfo.contactPhoneNumber}</td>
                    <td>{movingInfo.contactEmailAddress}</td>
                    <td>{movingInfo.currentAddress}</td>
                    <td>{movingInfo.newAddress}</td>
                    <td>{movingInfo.preferredMovingDate}</td>
                    <td>{movingInfo.alternateMovingDate}</td>
                    <td>{movingInfo.estimatedVolumeOrSizeOfMove}</td>
                    <td>{movingInfo.numberOfEmployeesDesksToMove}</td>
                    <td>{movingInfo.specialEquipmentToMove}</td>
                    <td>{movingInfo.accessRestrictions}</td>
                    <td>{movingInfo.insuranceRequirements}</td>
                    <td>{movingInfo.specialHandlingInstructions}</td>
                    <td>{movingInfo.packingServicesNeeded ? 'Yes' : 'No'}</td>
                    <td>{movingInfo.storageRequirements}</td>
                    <td>{movingInfo.budgetRange}</td>
                    <td>{movingInfo.decisionMakerName}</td>
                    <td>{movingInfo.decisionMakerContactInformation}</td>
                    <td>{movingInfo.additionalServicesRequested}</td>
                    <td>{movingInfo.commentsAdditionalInstructions}</td>
                    <td>{movingInfo.confirmationOfTermsAndConditions ? 'Yes' : 'No'}</td>
                    <td>{movingInfo.formSubmissionDate}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const MilitaryMovingForm = () => {
        const [formData, setFormData] = useState({
            serviceMemberFullName: '',
            rank: '',
            serviceNumber: '',
            branchOfService: '',
            contactPhone: '',
            contactEmail: '',
            ordersNumber: '',
            pcsDate: '',
            currentAddress: '',
            newAssignmentLocation: '',
            preferredPackOutDate: '',
            preferredDeliveryDate: '',
            estimatedWeightOfHouseholdGoods: '',
            needForTemporaryStorage: false,
            emergencyContactName: '',
            emergencyContactPhone: '',
            signatureOfServiceMember: '',
            date: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-military-moving', formData);
                if (response.status === 200) {
                    setPreviousChats([...previousChats, {role: "You", content: value}, {
                        role: "Assistant",
                        content: <MilitaryMovingInfoTable movingInfo={response.data.data}/>
                    }]);
                    saveChatMessage(value, 'You');
                    setValue('');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
                <form className="car-delivery-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="serviceMemberFullName">Service Member's Full Name</label>
                        <input type="text" id="serviceMemberFullName" name="serviceMemberFullName" value={formData.serviceMemberFullName} onChange={handleChange} required />
                        <label htmlFor="rank">Rank</label>
                        <input type="text" id="rank" name="rank" value={formData.rank} onChange={handleChange} required />
                        <label htmlFor="serviceNumber">Service Number</label>
                        <input type="text" id="serviceNumber" name="serviceNumber" value={formData.serviceNumber} onChange={handleChange} required />
                        <label htmlFor="branchOfService">Branch of Service</label>
                        <input type="text" id="branchOfService" name="branchOfService" value={formData.branchOfService} onChange={handleChange} required />
                        <label htmlFor="contactPhone">Contact Phone</label>
                        <input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleChange} required />
                        <label htmlFor="contactEmail">Contact Email</label>
                        <input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleChange} required />
                        <label htmlFor="ordersNumber">Orders Number</label>
                        <input type="text" id="ordersNumber" name="ordersNumber" value={formData.ordersNumber} onChange={handleChange} required />
                        <label htmlFor="pcsDate">PCS Date</label>
                        <input type="date" id="pcsDate" name="pcsDate" value={formData.pcsDate} onChange={handleChange} required />
                        <label htmlFor="currentAddress">Current Address</label>
                        <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />
                        <label htmlFor="newAssignmentLocation">New Assignment Location</label>
                        <input type="text" id="newAssignmentLocation" name="newAssignmentLocation" value={formData.newAssignmentLocation} onChange={handleChange} required />
                        <label htmlFor="preferredPackOutDate">Preferred Pack-Out Date</label>
                        <input type="date" id="preferredPackOutDate" name="preferredPackOutDate" value={formData.preferredPackOutDate} onChange={handleChange} required />
                        <label htmlFor="preferredDeliveryDate">Preferred Delivery Date</label>
                        <input type="date" id="preferredDeliveryDate" name="preferredDeliveryDate" value={formData.preferredDeliveryDate} onChange={handleChange} required />
                        <label htmlFor="estimatedWeightOfHouseholdGoods">Estimated Weight of Household Goods</label>
                        <input type="number" id="estimatedWeightOfHouseholdGoods" name="estimatedWeightOfHouseholdGoods" value={formData.estimatedWeightOfHouseholdGoods} onChange={handleChange} required />
                        <label htmlFor="needForTemporaryStorage">Need for Temporary Storage</label>
                        <input type="checkbox" id="needForTemporaryStorage" name="needForTemporaryStorage" checked={formData.needForTemporaryStorage} onChange={handleChange} />
                        <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                        <input type="text" id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
                        <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
                        <input type="tel" id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} required />
                        <label htmlFor="signatureOfServiceMember">Signature of Service Member</label>
                        <input type="text" id="signatureOfServiceMember" name="signatureOfServiceMember" value={formData.signatureOfServiceMember} onChange={handleChange} required />
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
        );
    };
    const MilitaryMovingInfoTable = ({movingInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Service Member's Full Name</th>
                    <th>Rank</th>
                    <th>Service Number</th>
                    <th>Branch of Service</th>
                    <th>Contact Phone</th>
                    <th>Contact Email</th>
                    <th>Orders Number</th>
                    <th>PCS Date</th>
                    <th>Current Address</th>
                    <th>New Assignment Location</th>
                    <th>Preferred Pack-Out Date</th>
                    <th>Preferred Delivery Date</th>
                    <th>Estimated Weight of Household Goods</th>
                    <th>Need for Temporary Storage</th>
                    <th>Emergency Contact Name</th>
                    <th>Emergency Contact Phone</th>
                    <th>Signature of Service Member</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.serviceMemberFullName}</td>
                    <td>{movingInfo.rank}</td>
                    <td>{movingInfo.serviceNumber}</td>
                    <td>{movingInfo.branchOfService}</td>
                    <td>{movingInfo.contactPhone}</td>
                    <td>{movingInfo.contactEmail}</td>
                    <td>{movingInfo.ordersNumber}</td>
                    <td>{movingInfo.pcsDate}</td>
                    <td>{movingInfo.currentAddress}</td>
                    <td>{movingInfo.newAssignmentLocation}</td>
                    <td>{movingInfo.preferredPackOutDate}</td>
                    <td>{movingInfo.preferredDeliveryDate}</td>
                    <td>{movingInfo.estimatedWeightOfHouseholdGoods}</td>
                    <td>{movingInfo.needForTemporaryStorage ? 'Yes' : 'No'}</td>
                    <td>{movingInfo.emergencyContactName}</td>
                    <td>{movingInfo.emergencyContactPhone}</td>
                    <td>{movingInfo.signatureOfServiceMember}</td>
                    <td>{movingInfo.date}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const AutoMotoBoatEquipmentInfoTable = ({equipmentInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Contact Phone</th>
                    <th>Email Address</th>
                    <th>Vehicle/Equipment Type</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>VIN/Serial Number</th>
                    <th>Color</th>
                    <th>Condition</th>
                    <th>Service Type Requested</th>
                    <th>Specific Service Requests</th>
                    <th>Preferred Service Date</th>
                    <th>Alternate Service Date</th>
                    <th>Pick-Up Required</th>
                    <th>Delivery Required</th>
                    <th>Pick-Up/Delivery Address</th>
                    <th>Insurance Provider</th>
                    <th>Policy Number</th>
                    <th>Preferred Payment Method</th>
                    <th>Additional Comments/Instructions</th>
                    <th>Signature</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{equipmentInfo.customerName}</td>
                    <td>{equipmentInfo.contactPhone}</td>
                    <td>{equipmentInfo.emailAddress}</td>
                    <td>{equipmentInfo.vehicleEquipmentType}</td>
                    <td>{equipmentInfo.make}</td>
                    <td>{equipmentInfo.model}</td>
                    <td>{equipmentInfo.year}</td>
                    <td>{equipmentInfo.vinSerialNumber}</td>
                    <td>{equipmentInfo.color}</td>
                    <td>{equipmentInfo.condition}</td>
                    <td>{equipmentInfo.serviceTypeRequested}</td>
                    <td>{equipmentInfo.specificServiceRequests}</td>
                    <td>{equipmentInfo.preferredServiceDate}</td>
                    <td>{equipmentInfo.alternateServiceDate}</td>
                    <td>{equipmentInfo.pickUpRequired ? 'Yes' : 'No'}</td>
                    <td>{equipmentInfo.deliveryRequired ? 'Yes' : 'No'}</td>
                    <td>{equipmentInfo.pickUpDeliveryAddress}</td>
                    <td>{equipmentInfo.insuranceProvider}</td>
                    <td>{equipmentInfo.policyNumber}</td>
                    <td>{equipmentInfo.preferredPaymentMethod}</td>
                    <td>{equipmentInfo.additionalCommentsInstructions}</td>
                    <td>{equipmentInfo.signature}</td>
                    <td>{equipmentInfo.date}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const HeavyLiftingAndMovingOnlyForm = ({ setPreviousChats, saveChatMessage }) => {
        const [formData, setFormData] = useState({
            customerContactInformation: {
                name: '',
                email: '',
                phoneNumber: ''
            },
            pickupLocation: '',
            deliveryLocation: '',
            itemDetails: '',
            serviceRequirements: '',
            dateAndTime: '',
            specialInstructions: '',
            insuranceInformation: '',
            billingInformation: '',
        });

        const handleChange = (event) => {
            const { name, value } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-heavy-lifting-and-moving-only', formData);
                if (response.status === 200) {
                    setPreviousChats(prevChats => (
                        [...prevChats,
                            {role: "You", content: "Heavy Lifting and Moving Only form submitted"},
                            {role: "Assistant", content: <HeavyLiftingAndMovingOnlyInfoTable movingInfo={formData}/>}
                        ]
                    ));
                    saveChatMessage("Heavy Lifting and Moving Only form submitted", 'You');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.customerContactInformation.name} onChange={handleChange} required />

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.customerContactInformation.email} onChange={handleChange} required />

                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.customerContactInformation.phoneNumber} onChange={handleChange} required />

                    <label htmlFor="pickupLocation">Pick-Up Location</label>
                    <input type="text" id="pickupLocation" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} required />

                    <label htmlFor="deliveryLocation">Delivery Location</label>
                    <input type="text" id="deliveryLocation" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleChange} required />

                    <label htmlFor="itemDetails">Item Details</label>
                    <textarea id="itemDetails" name="itemDetails" value={formData.itemDetails} onChange={handleChange} required />

                    <label htmlFor="serviceRequirements">Service Requirements</label>
                    <textarea id="serviceRequirements" name="serviceRequirements" value={formData.serviceRequirements} onChange={handleChange} required />

                    <label htmlFor="dateAndTime">Date and Time</label>
                    <input type="datetime-local" id="dateAndTime" name="dateAndTime" value={formData.dateAndTime} onChange={handleChange} required />

                    <label htmlFor="specialInstructions">Special Instructions</label>
                    <textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} />

                    <label htmlFor="insuranceInformation">Insurance Information</label>
                    <textarea id="insuranceInformation" name="insuranceInformation" value={formData.insuranceInformation} onChange={handleChange} />

                    <label htmlFor="billingInformation">Billing Information</label>
                    <textarea id="billingInformation" name="billingInformation" value={formData.billingInformation} onChange={handleChange} required />
                </div>

                <button type="submit">Submit</button>
            </form>
        );
    };
    const MovingAndStorageServiceForm = ({ setPreviousChats, saveChatMessage }) => {
        const [formData, setFormData] = useState({
            customerName: '',
            contactPhoneNumber: '',
            emailAddress: '',
            currentAddress: '',
            destinationAddress: '',
            preferredMovingDate: '',
            preferredDeliveryDate: '',
            inventoryList: '',
            totalVolumeOrSizeOfMove: '',
            typeOfResidence: '',
            accessDetails: '',
            storageDurationRequired: '',
            specialHandlingInstructions: '',
            insuranceRequirement: false,
            valuationOfGoods: '',
            additionalServices: '',
            budget: '',
            howDidYouHearAboutUs: '',
            customerSignature: '',
            dateOfRequest: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-moving-and-storage-service', formData);
                if (response.status === 200) {
                    setPreviousChats(prevChats => (
                        [...prevChats,
                            {role: "You", content: "Moving and Storage Service form submitted"},
                            {role: "Assistant", content: <MovingAndStorageServiceInfoTable movingInfo={formData}/>}
                        ]
                    ));
                    saveChatMessage("Moving and Storage Service form submitted", 'You');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />

                    <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
                    <input type="tel" id="contactPhoneNumber" name="contactPhoneNumber" value={formData.contactPhoneNumber} onChange={handleChange} required />

                    <label htmlFor="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />

                    <label htmlFor="currentAddress">Current Address</label>
                    <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />

                    <label htmlFor="destinationAddress">Destination Address</label>
                    <input type="text" id="destinationAddress" name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} required />

                    <label htmlFor="preferredMovingDate">Preferred Moving Date</label>
                    <input type="date" id="preferredMovingDate" name="preferredMovingDate" value={formData.preferredMovingDate} onChange={handleChange} required />

                    <label htmlFor="preferredDeliveryDate">Preferred Delivery Date</label>
                    <input type="date" id="preferredDeliveryDate" name="preferredDeliveryDate" value={formData.preferredDeliveryDate} onChange={handleChange} required />

                    <label htmlFor="inventoryList">Inventory List</label>
                    <textarea id="inventoryList" name="inventoryList" value={formData.inventoryList} onChange={handleChange} required />

                    <label htmlFor="totalVolumeOrSizeOfMove">Total Volume or Size of Move</label>
                    <input type="text" id="totalVolumeOrSizeOfMove" name="totalVolumeOrSizeOfMove" value={formData.totalVolumeOrSizeOfMove} onChange={handleChange} required />

                    <label htmlFor="typeOfResidence">Type of Residence</label>
                    <input type="text" id="typeOfResidence" name="typeOfResidence" value={formData.typeOfResidence} onChange={handleChange} required />

                    <label htmlFor="accessDetails">Access Details</label>
                    <textarea id="accessDetails" name="accessDetails" value={formData.accessDetails} onChange={handleChange} required />

                    <label htmlFor="storageDurationRequired">Storage Duration Required</label>
                    <input type="text" id="storageDurationRequired" name="storageDurationRequired" value={formData.storageDurationRequired} onChange={handleChange} required />

                    <label htmlFor="specialHandlingInstructions">Special Handling Instructions</label>
                    <textarea id="specialHandlingInstructions" name="specialHandlingInstructions" value={formData.specialHandlingInstructions} onChange={handleChange} />

                    <label htmlFor="insuranceRequirement">Insurance Requirement</label>
                    <input type="checkbox" id="insuranceRequirement" name="insuranceRequirement" checked={formData.insuranceRequirement} onChange={handleChange} />

                    <label htmlFor="valuationOfGoods">Valuation of Goods</label>
                    <input type="number" id="valuationOfGoods" name="valuationOfGoods" value={formData.valuationOfGoods} onChange={handleChange} />

                    <label htmlFor="additionalServices">Additional Services</label>
                    <textarea id="additionalServices" name="additionalServices" value={formData.additionalServices} onChange={handleChange} />

                    <label htmlFor="budget">Budget</label>
                    <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} />

                    <label htmlFor="howDidYouHearAboutUs">How Did You Hear About Us?</label>
                    <input type="text" id="howDidYouHearAboutUs" name="howDidYouHearAboutUs" value={formData.howDidYouHearAboutUs} onChange={handleChange} />

                    <label htmlFor="customerSignature">Customer Signature</label>
                    <input type="text" id="customerSignature" name="customerSignature" value={formData.customerSignature} onChange={handleChange} required />

                    <label htmlFor="dateOfRequest">Date of Request</label>
                    <input type="date" id="dateOfRequest" name="dateOfRequest" value={formData.dateOfRequest} onChange={handleChange} required />
                </div>

                <button type="submit">Submit</button>
            </form>
        );
    };
    const MovingAndStorageServiceInfoTable = ({ movingInfo }) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Contact Phone Number</th>
                    <th>Contact Email Address</th>
                    <th>Current Address</th>
                    <th>Destination Address</th>
                    <th>Preferred Moving Date</th>
                    <th>Preferred Delivery Date</th>
                    <th>Inventory List</th>
                    <th>Total Volume or Size of Move</th>
                    <th>Type of Residence</th>
                    <th>Access Details</th>
                    <th>Storage Duration Required</th>
                    <th>Special Handling Instructions</th>
                    <th>Insurance Requirement</th>
                    <th>Valuation of Goods</th>
                    <th>Additional Services</th>
                    <th>Budget</th>
                    <th>How Did You Hear About Us</th>
                    <th>Customer’s Signature</th>
                    <th>Date of Request</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.customerName}</td>
                    <td>{movingInfo.contactPhoneNumber}</td>
                    <td>{movingInfo.emailAddress}</td>
                    <td>{movingInfo.currentAddress}</td>
                    <td>{movingInfo.destinationAddress}</td>
                    <td>{movingInfo.preferredMovingDate}</td>
                    <td>{movingInfo.preferredDeliveryDate}</td>
                    <td>{movingInfo.inventoryList}</td>
                    <td>{movingInfo.totalVolumeOrSizeOfMove}</td>
                    <td>{movingInfo.typeOfResidence}</td>
                    <td>{movingInfo.accessDetails}</td>
                    <td>{movingInfo.storageDurationRequired}</td>
                    <td>{movingInfo.specialHandlingInstructions}</td>
                    <td>{movingInfo.insuranceRequirement ? 'Yes' : 'No'}</td>
                    <td>{movingInfo.valuationOfGoods}</td>
                    <td>{movingInfo.additionalServices}</td>
                    <td>{movingInfo.budget}</td>
                    <td>{movingInfo.howDidYouHearAboutUs}</td>
                    <td>{movingInfo.customerSignature}</td>
                    <td>{movingInfo.dateOfRequest}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const HeavyLiftingAndMovingOnlyInfoTable = ({ movingInfo }) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Pick-Up Location</th>
                    <th>Delivery Location</th>
                    <th>Item Details</th>
                    <th>Service Requirements</th>
                    <th>Date and Time</th>
                    <th>Special Instructions</th>
                    <th>Insurance Information</th>
                    <th>Billing Information</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.customerContactInformation.name}</td>
                    <td>{movingInfo.customerContactInformation.email}</td>
                    <td>{movingInfo.customerContactInformation.phoneNumber}</td>
                    <td>{movingInfo.pickupLocation}</td>
                    <td>{movingInfo.deliveryLocation}</td>
                    <td>{movingInfo.itemDetails}</td>
                    <td>{movingInfo.serviceRequirements}</td>
                    <td>{movingInfo.dateAndTime}</td>
                    <td>{movingInfo.specialInstructions}</td>
                    <td>{movingInfo.insuranceInformation}</td>
                    <td>{movingInfo.billingInformation}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const LongDistanceMovingForm = () => {
        const [formData, setFormData] = useState({
            customerFullName: '',
            contactPhoneNumber: '',
            emailAddress: '',
            currentAddress: '',
            destinationAddress: '',
            preferredMovingDate: '',
            flexibleMovingDate: false,
            sizeOfMove: '',
            listOfLargeItems: '',
            additionalServicesRequired: '',
            specialHandlingInstructions: '',
            insuranceRequirements: '',
            estimateOfBoxesAndBags: '',
            accessInformationCurrent: '',
            accessInformationDestination: '',
            preferredContactMethod: '',
            commentsOrAdditionalInformation: '',
            acknowledgment: false,
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-long-distance-moving', formData);
                if (response.status === 200) {
                    alert('Form submitted successfully');
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <LongDistanceMovingDeliveryInfoTable deliveryInfo={formData}/>
                    }]);
                } else {
                    alert('Error submitting form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerFullName">Customer's Full Name</label>
                    <input type="text" id="customerFullName" name="customerFullName" value={formData.customerFullName} onChange={handleChange} required />

                    <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
                    <input type="tel" id="contactPhoneNumber" name="contactPhoneNumber" value={formData.contactPhoneNumber} onChange={handleChange} required />

                    <label htmlFor="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />

                    <label htmlFor="currentAddress">Current Address</label>
                    <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />

                    <label htmlFor="destinationAddress">Destination Address</label>
                    <input type="text" id="destinationAddress" name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} required />

                    <label htmlFor="preferredMovingDate">Preferred Moving Date</label>
                    <input type="date" id="preferredMovingDate" name="preferredMovingDate" value={formData.preferredMovingDate} onChange={handleChange} required />

                    <label htmlFor="flexibleMovingDate">Flexible Moving Date</label>
                    <input type="checkbox" id="flexibleMovingDate" name="flexibleMovingDate" checked={formData.flexibleMovingDate} onChange={handleChange} />

                    <label htmlFor="sizeOfMove">Size of Move</label>
                    <input type="text" id="sizeOfMove" name="sizeOfMove" value={formData.sizeOfMove} onChange={handleChange} required />

                    <label htmlFor="listOfLargeItems">List of Large Items</label>
                    <textarea id="listOfLargeItems" name="listOfLargeItems" value={formData.listOfLargeItems} onChange={handleChange} required />

                    <label htmlFor="additionalServicesRequired">Additional Services Required</label>
                    <textarea id="additionalServicesRequired" name="additionalServicesRequired" value={formData.additionalServicesRequired} onChange={handleChange} />

                    <label htmlFor="specialHandlingInstructions">Special Handling Instructions</label>
                    <textarea id="specialHandlingInstructions" name="specialHandlingInstructions" value={formData.specialHandlingInstructions} onChange={handleChange} />

                    <label htmlFor="insuranceRequirements">Insurance Requirements</label>
                    <textarea id="insuranceRequirements" name="insuranceRequirements" value={formData.insuranceRequirements} onChange={handleChange} />

                    <label htmlFor="estimateOfBoxesAndBags">Estimate of Boxes and Bags</label>
                    <input type="number" id="estimateOfBoxesAndBags" name="estimateOfBoxesAndBags" value={formData.estimateOfBoxesAndBags} onChange={handleChange} required />

                    <label htmlFor="accessInformationCurrent">Access Information at Current Location</label>
                    <textarea id="accessInformationCurrent" name="accessInformationCurrent" value={formData.accessInformationCurrent} onChange={handleChange} required />

                    <label htmlFor="accessInformationDestination">Access Information at Destination</label>
                    <textarea id="accessInformationDestination" name="accessInformationDestination" value={formData.accessInformationDestination} onChange={handleChange} required />

                    <label htmlFor="preferredContactMethod">Preferred Contact Method</label>
                    <input type="text" id="preferredContactMethod" name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange} required />

                    <label htmlFor="commentsOrAdditionalInformation">Comments or Additional Information</label>
                    <textarea id="commentsOrAdditionalInformation" name="commentsOrAdditionalInformation" value={formData.commentsOrAdditionalInformation} onChange={handleChange} />

                    <label htmlFor="acknowledgment">Acknowledgment</label>
                    <input type="checkbox" id="acknowledgment" name="acknowledgment" checked={formData.acknowledgment} onChange={handleChange} required />

                </div>

                <button type="submit">Submit</button>
            </form>
        );
    };
    const LongDistanceMovingDeliveryInfoTable = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Customer's Full Name</th>
                    <th>Contact Phone Number</th>
                    <th>Email Address</th>
                    <th>Current Address</th>
                    <th>Destination Address</th>
                    <th>Preferred Moving Date</th>
                    <th>Flexible Moving Date</th>
                    <th>Size of Move</th>
                    <th>List of Large Items</th>
                    <th>Additional Services Required</th>
                    <th>Special Handling Instructions</th>
                    <th>Insurance Requirements</th>
                    <th>Estimate of Boxes and Bags</th>
                    <th>Access Information at Current Location</th>
                    <th>Access Information at Destination</th>
                    <th>Preferred Contact Method</th>
                    <th>Comments or Additional Information</th>
                    <th>Acknowledgment</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.customerFullName}</td>
                    <td>{deliveryInfo.contactPhoneNumber}</td>
                    <td>{deliveryInfo.emailAddress}</td>
                    <td>{deliveryInfo.currentAddress}</td>
                    <td>{deliveryInfo.destinationAddress}</td>
                    <td>{deliveryInfo.preferredMovingDate}</td>
                    <td>{deliveryInfo.flexibleMovingDate ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.sizeOfMove}</td>
                    <td>{deliveryInfo.listOfLargeItems}</td>
                    <td>{deliveryInfo.additionalServicesRequired}</td>
                    <td>{deliveryInfo.specialHandlingInstructions}</td>
                    <td>{deliveryInfo.insuranceRequirements}</td>
                    <td>{deliveryInfo.estimateOfBoxesAndBags}</td>
                    <td>{deliveryInfo.accessInformationCurrent}</td>
                    <td>{deliveryInfo.accessInformationDestination}</td>
                    <td>{deliveryInfo.preferredContactMethod}</td>
                    <td>{deliveryInfo.commentsOrAdditionalInformation}</td>
                    <td>{deliveryInfo.acknowledgment ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const LocalMovingForm = () => {
        const [formData, setFormData] = useState({
            customerName: '',
            phoneNumber: '',
            email: '',
            currentAddress: '',
            newAddress: '',
            preferredMoveDate: '',
            alternativeMoveDate: '',
            preferredTimeWindow: '',
            propertyTypeCurrent: '',
            propertyTypeNew: '',
            numberOfBedrooms: '',
            floorNumber: '',
            elevatorAvailability: false,
            itemsToMove: '',
            fullPacking: false,
            partialPacking: false,
            noPacking: false,
            specialHandling: '',
            insuranceNeeded: false,
            storageRequired: false,
            assemblyServices: false,
            parkingAvailability: false,
            obstructions: '',
            paymentMethod: '',
            additionalNotes: '',
            customerSignature: '',
            date: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-local-moving', formData);
                if (response.status === 200) {
                    alert('Form submitted successfully');
                    const newLoad = response.data.moving; // Get the new moving data from the response
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <LocalMovingDeliveryInfoTable deliveryInfo={newLoad}/>
                    }]);
                } else {
                    alert('Error submitting form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerName">Customer's Name</label>
                    <input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} required />
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    <label htmlFor="currentAddress">Current Address</label>
                    <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />
                    <label htmlFor="newAddress">New Address</label>
                    <input type="text" id="newAddress" name="newAddress" value={formData.newAddress} onChange={handleChange} required />
                    <label htmlFor="preferredMoveDate">Preferred Move Date</label>
                    <input type="date" id="preferredMoveDate" name="preferredMoveDate" value={formData.preferredMoveDate} onChange={handleChange} required />
                    <label htmlFor="alternativeMoveDate">Alternative Move Date</label>
                    <input type="date" id="alternativeMoveDate" name="alternativeMoveDate" value={formData.alternativeMoveDate} onChange={handleChange} />
                    <label htmlFor="preferredTimeWindow">Preferred Time Window</label>
                    <input type="text" id="preferredTimeWindow" name="preferredTimeWindow" value={formData.preferredTimeWindow} onChange={handleChange} required />
                    <label htmlFor="propertyTypeCurrent">Property Type at Current Location</label>
                    <input type="text" id="propertyTypeCurrent" name="propertyTypeCurrent" value={formData.propertyTypeCurrent} onChange={handleChange} required />
                    <label htmlFor="propertyTypeNew">Property Type at New Location</label>
                    <input type="text" id="propertyTypeNew" name="propertyTypeNew" value={formData.propertyTypeNew} onChange={handleChange} required />
                    <label htmlFor="numberOfBedrooms">Number of Bedrooms</label>
                    <input type="number" id="numberOfBedrooms" name="numberOfBedrooms" value={formData.numberOfBedrooms} onChange={handleChange} required />
                    <label htmlFor="floorNumber">Floor Number</label>
                    <input type="number" id="floorNumber" name="floorNumber" value={formData.floorNumber} onChange={handleChange} />
                    <label htmlFor="elevatorAvailability">Elevator Availability</label>
                    <input type="checkbox" id="elevatorAvailability" name="elevatorAvailability" checked={formData.elevatorAvailability} onChange={handleChange} />

                    <label htmlFor="itemsToMove">List of Items to Move</label>
                    <textarea id="itemsToMove" name="itemsToMove" value={formData.itemsToMove} onChange={handleChange} required />

                    <label htmlFor="fullPacking">Full Packing</label>
                    <input type="checkbox" id="fullPacking" name="fullPacking" checked={formData.fullPacking} onChange={handleChange} />

                    <label htmlFor="partialPacking">Partial Packing</label>
                    <input type="checkbox" id="partialPacking" name="partialPacking" checked={formData.partialPacking} onChange={handleChange} />

                    <label htmlFor="noPacking">No Packing</label>
                    <input type="checkbox" id="noPacking" name="noPacking" checked={formData.noPacking} onChange={handleChange} />

                    <label htmlFor="specialHandling">Special Handling</label>
                    <textarea id="specialHandling" name="specialHandling" value={formData.specialHandling} onChange={handleChange} />

                    <label htmlFor="insuranceNeeded">Insurance Coverage Needed</label>
                    <input type="checkbox" id="insuranceNeeded" name="insuranceNeeded" checked={formData.insuranceNeeded} onChange={handleChange} />

                    <label htmlFor="storageRequired">Storage Required</label>
                    <input type="checkbox" id="storageRequired" name="storageRequired" checked={formData.storageRequired} onChange={handleChange} />

                    <label htmlFor="assemblyServices">Assembly/Disassembly Services</label>
                    <input type="checkbox" id="assemblyServices" name="assemblyServices" checked={formData.assemblyServices} onChange={handleChange} />

                    <label htmlFor="parkingAvailability">Parking Availability for Moving Truck</label>
                    <input type="checkbox" id="parkingAvailability" name="parkingAvailability" checked={formData.parkingAvailability} onChange={handleChange} />

                    <label htmlFor="obstructions">Any Known Obstructions or Narrow Passages</label>
                    <textarea id="obstructions" name="obstructions" value={formData.obstructions} onChange={handleChange} />

                    <label htmlFor="paymentMethod">Payment Method Preference</label>
                    <input type="text" id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required />

                    <label htmlFor="additionalNotes">Additional Notes</label>
                    <textarea id="additionalNotes" name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} />

                    <label htmlFor="customerSignature">Customer’s Signature</label>
                    <input type="text" id="customerSignature" name="customerSignature" value={formData.customerSignature} onChange={handleChange} required />

                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };
    const DeliveryInfoTableCarOrLightTruck = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Car or Truck Model</th>
                    <th>Year of Vehicle</th>
                    <th>Color</th>
                    <th>License Plate</th>
                    <th>VIN</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Convertible</th>
                    <th>Modified</th>
                    <th>Inoperable</th>
                    <th>Service Level</th>
                    <th>Enclosed Transport</th>
                    <th>Terms Agreed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.vehicleModel}</td>
                    <td>{deliveryInfo.vehicleYear}</td>
                    <td>{deliveryInfo.vehicleColor}</td>
                    <td>{deliveryInfo.vehicleLicensePlate}</td>
                    <td>{deliveryInfo.vehicleVin}</td>
                    <td>{deliveryInfo.pickupLocation}</td>
                    <td>{deliveryInfo.deliveryLocation}</td>
                    <td>{deliveryInfo.isConvertible ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isModified ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isInoperable ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.serviceLevel}</td>
                    <td>{deliveryInfo.enclosedTransport ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.termsAgreed ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const CommercialBusinessMovingForm = () => {
        const [formData, setFormData] = useState({
            businessName: '',
            contactPerson: '',
            contactPhoneNumber: '',
            contactEmailAddress: '',
            currentAddress: '',
            newAddress: '',
            preferredMovingDate: '',
            preferredMovingTime: '',
            typeOfBusiness: '',
            numberOfEmployees: '',
            inventoryList: '',
            specialEquipment: '',
            squareFootage: '',
            accessDetails: '',
            insuranceRequirements: '',
            additionalServicesNeeded: '',
            budgetRange: '',
            previousMovingExperience: '',
            specialInstructions: '',
            confirmationOfTerms: false,
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-commercial-business-moving', formData);
                if (response.status === 200) {
                    alert('Form submitted successfully');
                    const newLoad = response.data.moving; // Get the new moving data from the response
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <CommercialBusinessInfoTable movingInfo={newLoad}/>
                    }]);
                } else {
                    alert('Error submitting form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="businessName">Business Name</label>
                        <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} required />

                        <label htmlFor="contactPerson">Contact Person</label>
                        <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />

                        <label htmlFor="contactPhoneNumber">Contact Phone Number</label>
                        <input type="tel" id="contactPhoneNumber" name="contactPhoneNumber" value={formData.contactPhoneNumber} onChange={handleChange} required />

                        <label htmlFor="contactEmailAddress">Contact Email Address</label>
                        <input type="email" id="contactEmailAddress" name="contactEmailAddress" value={formData.contactEmailAddress} onChange={handleChange} required />

                        <label htmlFor="currentAddress">Current Address</label>
                        <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />

                        <label htmlFor="newAddress">New Address</label>
                        <input type="text" id="newAddress" name="newAddress" value={formData.newAddress} onChange={handleChange} required />

                        <label htmlFor="preferredMovingDate">Preferred Moving Date</label>
                        <input type="date" id="preferredMovingDate" name="preferredMovingDate" value={formData.preferredMovingDate} onChange={handleChange} required />

                        <label htmlFor="preferredMovingTime">Preferred Moving Time</label>
                        <input type="time" id="preferredMovingTime" name="preferredMovingTime" value={formData.preferredMovingTime} onChange={handleChange} required />

                        <label htmlFor="typeOfBusiness">Type of Business</label>
                        <input type="text" id="typeOfBusiness" name="typeOfBusiness" value={formData.typeOfBusiness} onChange={handleChange} required />

                        <label htmlFor="numberOfEmployees">Number of Employees</label>
                        <input type="number" id="numberOfEmployees" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} required />

                        <label htmlFor="inventoryList">Inventory List</label>
                        <textarea id="inventoryList" name="inventoryList" value={formData.inventoryList} onChange={handleChange} required />

                        <label htmlFor="specialEquipment">Special Equipment</label>
                        <textarea id="specialEquipment" name="specialEquipment" value={formData.specialEquipment} onChange={handleChange} />

                        <label htmlFor="squareFootage">Square Footage</label>
                        <input type="number" id="squareFootage" name="squareFootage" value={formData.squareFootage} onChange={handleChange} required />

                        <label htmlFor="accessDetails">Access Details</label>
                        <textarea id="accessDetails" name="accessDetails" value={formData.accessDetails} onChange={handleChange} required />

                        <label htmlFor="insuranceRequirements">Insurance Requirements</label>
                        <textarea id="insuranceRequirements" name="insuranceRequirements" value={formData.insuranceRequirements} onChange={handleChange} />

                        <label htmlFor="additionalServicesNeeded">Additional Services Needed</label>
                        <textarea id="additionalServicesNeeded" name="additionalServicesNeeded" value={formData.additionalServicesNeeded} onChange={handleChange} />

                        <label htmlFor="budgetRange">Budget Range</label>
                        <input type="text" id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleChange} required />

                        <label htmlFor="previousMovingExperience">Previous Moving Experience</label>
                        <textarea id="previousMovingExperience" name="previousMovingExperience" value={formData.previousMovingExperience} onChange={handleChange} />

                        <label htmlFor="specialInstructions">Special Instructions</label>
                        <textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} />

                        <label htmlFor="confirmationOfTerms">Confirmation of Terms and Conditions</label>
                        <input type="checkbox" id="confirmationOfTerms" name="confirmationOfTerms" checked={formData.confirmationOfTerms} onChange={handleChange} required />

                        <button type="submit">Submit</button>
                    </form>
                </div>

                <button type="submit">Submit</button>
            </form>
        );
    };
    const CommercialBusinessInfoTable = ({movingInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Business Name</th>
                    <th>Contact Person</th>
                    <th>Contact Phone Number</th>
                    <th>Contact Email Address</th>
                    <th>Current Address</th>
                    <th>New Address</th>
                    <th>Preferred Moving Date</th>
                    <th>Preferred Moving Time</th>
                    <th>Type of Business</th>
                    <th>Number of Employees</th>
                    <th>Inventory List</th>
                    <th>Special Equipment</th>
                    <th>Square Footage</th>
                    <th>Access Details</th>
                    <th>Insurance Requirements</th>
                    <th>Additional Services Needed</th>
                    <th>Budget Range</th>
                    <th>Previous Moving Experience</th>
                    <th>Special Instructions</th>
                    <th>Confirmation of Terms and Conditions</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.businessName}</td>
                    <td>{movingInfo.contactPerson}</td>
                    <td>{movingInfo.contactPhoneNumber}</td>
                    <td>{movingInfo.contactEmailAddress}</td>
                    <td>{movingInfo.currentAddress}</td>
                    <td>{movingInfo.newAddress}</td>
                    <td>{movingInfo.preferredMovingDate}</td>
                    <td>{movingInfo.preferredMovingTime}</td>
                    <td>{movingInfo.typeOfBusiness}</td>
                    <td>{movingInfo.numberOfEmployees}</td>
                    <td>{movingInfo.inventoryList}</td>
                    <td>{movingInfo.specialEquipment}</td>
                    <td>{movingInfo.squareFootage}</td>
                    <td>{movingInfo.accessDetails}</td>
                    <td>{movingInfo.insuranceRequirements}</td>
                    <td>{movingInfo.additionalServicesNeeded}</td>
                    <td>{movingInfo.budgetRange}</td>
                    <td>{movingInfo.previousMovingExperience}</td>
                    <td>{movingInfo.specialInstructions}</td>
                    <td>{movingInfo.confirmationOfTerms ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const MotoEquipmentLoadForm = () => {
        const [motoEquipmentData, setMotoEquipmentData] = useState({
            vehicleType: '',
            vehicleModel: '',
            vehicleYear: '',
            vehicleColor: '',
            vehicleLicensePlate: '',
            vehicleVin: '',
            pickupLocation: '',
            deliveryLocation: '',
            isConvertible: false,
            isModified: false,
            isInoperable: false,
            serviceLevel: '',
            enclosedTransport: false,
            termsAgreed: false,
            deliveryDate: '',
            userEndpoint: '', // Add this line to link the load to a user
        });

        const handleChange = (event) => {
            const {name, value, type, checked} = event.target;
            setMotoEquipmentData({
                ...motoEquipmentData,
                [name]: type === "checkbox" ? checked : value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-moto-equipment-load', motoEquipmentData);
                if (response.status === 200) {
                    console.log('Moto Equipment load submitted successfully:', response.data.load);
                    const newLoad = response.data.load;
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <DeliveryInfoTableMotoEquipment deliveryInfo={newLoad}/>
                    }]);
                    saveChatMessage('Moto Equipment delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting Moto Equipment load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2>Moto Equipment Delivery Request</h2>
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <input
                        type="text"
                        id="vehicleType"
                        name="vehicleType"
                        placeholder="Enter Vehicle Type"
                        value={motoEquipmentData.vehicleType}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleModel">Vehicle Model</label>
                    <input
                        type="text"
                        id="vehicleModel"
                        name="vehicleModel"
                        placeholder="Enter Vehicle Model"
                        value={motoEquipmentData.vehicleModel}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleYear">Vehicle Year</label>
                    <input
                        type="text"
                        id="vehicleYear"
                        name="vehicleYear"
                        placeholder="Enter Vehicle Year"
                        value={motoEquipmentData.vehicleYear}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleColor">Vehicle Color</label>
                    <input
                        type="text"
                        id="vehicleColor"
                        name="vehicleColor"
                        placeholder="Enter Vehicle Color"
                        value={motoEquipmentData.vehicleColor}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleVin">Vehicle VIN</label>
                    <input
                        type="text"
                        id="vehicleVin"
                        name="vehicleVin"
                        placeholder="Enter Vehicle VIN"
                        value={motoEquipmentData.vehicleVin}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleLicensePlate">Vehicle License Plate</label>
                    <input
                        type="text"
                        id="vehicleLicensePlate"
                        name="vehicleLicensePlate"
                        placeholder="Enter Vehicle License Plate"
                        value={motoEquipmentData.vehicleLicensePlate}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="Enter Pickup Location"
                        value={motoEquipmentData.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="deliveryLocation">Delivery Location</label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="Enter Delivery Location"
                        value={motoEquipmentData.deliveryLocation}
                        onChange={handleChange}
                        required
                    />
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isConvertible"
                            name="isConvertible"
                            checked={motoEquipmentData.isConvertible}
                            onChange={handleChange}
                        />
                        <label htmlFor="isConvertible">Convertible</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isModified"
                            name="isModified"
                            checked={motoEquipmentData.isModified}
                            onChange={handleChange}
                        />
                        <label htmlFor="isModified">Modified</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isInoperable"
                            name="isInoperable"
                            checked={motoEquipmentData.isInoperable}
                            onChange={handleChange}
                        />
                        <label htmlFor="isInoperable">Inoperable</label>
                    </div>
                    <label htmlFor="serviceLevel">Service Level</label>
                    <select
                        className="select-field"
                        id="serviceLevel"
                        name="serviceLevel"
                        value={motoEquipmentData.serviceLevel}
                        onChange={handleChange}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Same Day">Same Day</option>
                    </select>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="enclosedTransport"
                            name="enclosedTransport"
                            checked={motoEquipmentData.enclosedTransport}
                            onChange={handleChange}
                        />
                        <label htmlFor="enclosedTransport">Enclosed Transport</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termsAgreed"
                            name="termsAgreed"
                            checked={motoEquipmentData.termsAgreed}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="termsAgreed">Agree to Terms and Conditions</label>
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        );
    };

    const DeliveryInfoTableMotoEquipment = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Vehicle Type</th>
                    <th>Vehicle Model</th>
                    <th>Vehicle Year</th>
                    <th>Vehicle Color</th>
                    <th>License Plate</th>
                    <th>VIN</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Convertible</th>
                    <th>Modified</th>
                    <th>Inoperable</th>
                    <th>Service Level</th>
                    <th>Enclosed Transport</th>
                    <th>Terms Agreed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.vehicleType}</td>
                    <td>{deliveryInfo.vehicleModel}</td>
                    <td>{deliveryInfo.vehicleYear}</td>
                    <td>{deliveryInfo.vehicleColor}</td>
                    <td>{deliveryInfo.vehicleLicensePlate}</td>
                    <td>{deliveryInfo.vehicleVin}</td>
                    <td>{deliveryInfo.pickupLocation}</td>
                    <td>{deliveryInfo.deliveryLocation}</td>
                    <td>{deliveryInfo.isConvertible ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isModified ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isInoperable ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.serviceLevel}</td>
                    <td>{deliveryInfo.enclosedTransport ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.termsAgreed ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };

    const DeliveryInfoTableCommercialTruck = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Vehicle Type</th>
                    <th>Vehicle Model</th>
                    <th>Vehicle Year</th>
                    <th>Vehicle Color</th>
                    <th>License Plate</th>
                    <th>VIN</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Convertible</th>
                    <th>Modified</th>
                    <th>Inoperable</th>
                    <th>Service Level</th>
                    <th>Enclosed Transport</th>
                    <th>Terms Agreed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.vehicleType}</td>
                    <td>{deliveryInfo.vehicleModel}</td>
                    <td>{deliveryInfo.vehicleYear}</td>
                    <td>{deliveryInfo.vehicleColor}</td>
                    <td>{deliveryInfo.vehicleLicensePlate}</td>
                    <td>{deliveryInfo.vehicleVin}</td>
                    <td>{deliveryInfo.pickupLocation}</td>
                    <td>{deliveryInfo.deliveryLocation}</td>
                    <td>{deliveryInfo.isConvertible ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isModified ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isInoperable ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.serviceLevel}</td>
                    <td>{deliveryInfo.enclosedTransport ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.termsAgreed ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const InternationalMovingDeliveryInfoTable = ({movingInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Full Name</th>
                    <th>Phone Number</th>
                    <th>Email Address</th>
                    <th>Current Address</th>
                    <th>Destination Address</th>
                    <th>Preferred Moving Date</th>
                    <th>Estimated Volume or Size of Shipment</th>
                    <th>Type of Residence</th>
                    <th>Inventory List</th>
                    <th>Valuable and Fragile Items</th>
                    <th>Services Required</th>
                    <th>Insurance Coverage Amount</th>
                    <th>Customs Documentation Assistance</th>
                    <th>Additional Services</th>
                    <th>Special Instructions</th>
                    <th>Customer’s Signature</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.fullName}</td>
                    <td>{movingInfo.phoneNumber}</td>
                    <td>{movingInfo.emailAddress}</td>
                    <td>{movingInfo.currentAddress}</td>
                    <td>{movingInfo.destinationAddress}</td>
                    <td>{movingInfo.preferredMovingDate}</td>
                    <td>{movingInfo.estimatedVolume}</td>
                    <td>{movingInfo.typeOfResidence}</td>
                    <td>{movingInfo.inventoryList}</td>
                    <td>{movingInfo.valuableItems}</td>
                    <td>{movingInfo.servicesRequired}</td>
                    <td>{movingInfo.insuranceCoverage}</td>
                    <td>{movingInfo.customsDocumentation}</td>
                    <td>{movingInfo.additionalServices}</td>
                    <td>{movingInfo.specialInstructions}</td>
                    <td>{movingInfo.customerSignature}</td>
                    <td>{movingInfo.date}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const InternationalMovingForm = () => {
        const [formData, setFormData] = useState({
            fullName: '',
            phoneNumber: '',
            emailAddress: '',
            currentAddress: '',
            destinationAddress: '',
            preferredMovingDate: '',
            estimatedVolume: '',
            typeOfResidence: '',
            inventoryList: '',
            valuableItems: '',
            servicesRequired: '',
            insuranceCoverage: '',
            customsDocumentation: '',
            additionalServices: '',
            specialInstructions: '',
            customerSignature: '',
            date: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-international-moving', formData);
                if (response.status === 200) {
                    const newLoad = response.data.moving; // Get the new moving data from the response
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: "Your International Moving request has been submitted successfully. Our team will contact you shortly."
                    }]);
                } else {
                    alert('Error submitting form');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    {/* Form fields go here */}
                    <label htmlFor="fullName">Full Name</label>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />

                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

                    <label htmlFor="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />

                    <label htmlFor="currentAddress">Current Address</label>
                    <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />

                    <label htmlFor="destinationAddress">Destination Address</label>
                    <input type="text" id="destinationAddress" name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} required />

                    <label htmlFor="preferredMovingDate">Preferred Moving Date</label>
                    <input type="date" id="preferredMovingDate" name="preferredMovingDate" value={formData.preferredMovingDate} onChange={handleChange} required />

                    <label htmlFor="estimatedVolume">Estimated Volume or Size of Shipment</label>
                    <input type="text" id="estimatedVolume" name="estimatedVolume" value={formData.estimatedVolume} onChange={handleChange} required />

                    <label htmlFor="typeOfResidence">Type of Residence</label>
                    <input type="text" id="typeOfResidence" name="typeOfResidence" value={formData.typeOfResidence} onChange={handleChange} required />

                    <label htmlFor="inventoryList">Detailed list of items to be moved</label>
                    <textarea id="inventoryList" name="inventoryList" value={formData.inventoryList} onChange={handleChange} required />

                    <label htmlFor="valuableItems">List of valuable or fragile items requiring special care</label>
                    <textarea id="valuableItems" name="valuableItems" value={formData.valuableItems} onChange={handleChange} />

                    <label htmlFor="servicesRequired">Packing Services</label>
                    <input type="text" id="servicesRequired" name="servicesRequired" value={formData.servicesRequired} onChange={handleChange} />

                    <label htmlFor="insuranceCoverage">Insurance Coverage Amount</label>
                    <input type="text" id="insuranceCoverage" name="insuranceCoverage" value={formData.insuranceCoverage} onChange={handleChange} />

                    <label htmlFor="customsDocumentation">Customs Documentation Assistance</label>
                    <input type="text" id="customsDocumentation" name="customsDocumentation" value={formData.customsDocumentation} onChange={handleChange} />

                    <label htmlFor="additionalServices">Additional Services</label>
                    <input type="text" id="additionalServices" name="additionalServices" value={formData.additionalServices} onChange={handleChange} />

                    <label htmlFor="specialInstructions">Any specific instructions or requests</label>
                    <textarea id="specialInstructions" name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} />

                    <label htmlFor="customerSignature">Customer’s Signature</label>
                    <input type="text" id="customerSignature" name="customerSignature" value={formData.customerSignature} onChange={handleChange} required />

                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>

                <button type="submit">Submit</button>
            </form>
        );
    };

    const CommercialTruckLoadForm = () => {
        const [commercialTruckData, setCommercialTruckData] = useState({
            vehicleType: '',
            vehicleModel: '',
            vehicleYear: '',
            vehicleColor: '',
            vehicleLicensePlate: '',
            vehicleVin: '',
            pickupLocation: '',
            deliveryLocation: '',
            isConvertible: false,
            isModified: false,
            isInoperable: false,
            serviceLevel: '',
            enclosedTransport: false,
            termsAgreed: false,
            deliveryDate: '',
            userEndpoint: personalEndpoint, // Add this line to link the load to a user
        });

        const handleChange = (event) => {
            const {name, value, type, checked} = event.target;
            setCommercialTruckData({
                ...commercialTruckData,
                [name]: type === "checkbox" ? checked : value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-commercial-truck-load', commercialTruckData);
                if (response.status === 200) {
                    console.log('Commercial Truck load submitted successfully:', response.data.load);

                    // Assuming response.data.load is the new commercial truck load object
                    const newLoad = response.data.load;

                    // Update the state to include the new load
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <DeliveryInfoTableCommercialTruck deliveryInfo={newLoad}/>
                    }]);

                    saveChatMessage('Commercial Truck delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting Commercial Truck load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2>Commercial Truck Delivery Request</h2>
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <input
                        type="text"
                        id="vehicleType"
                        name="vehicleType"
                        placeholder="Enter Vehicle Type"
                        value={commercialTruckData.vehicleType}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleModel">Vehicle Model</label>
                    <input
                        type="text"
                        id="vehicleModel"
                        name="vehicleModel"
                        placeholder="Enter Vehicle Model"
                        value={commercialTruckData.vehicleModel}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleYear">Vehicle Year</label>
                    <input
                        type="text"
                        id="vehicleYear"
                        name="vehicleYear"
                        placeholder="Enter Vehicle Year"
                        value={commercialTruckData.vehicleYear}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleColor">Vehicle Color</label>
                    <input
                        type="text"
                        id="vehicleColor"
                        name="vehicleColor"
                        placeholder="Enter Vehicle Color"
                        value={commercialTruckData.vehicleColor}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleVin">Vehicle VIN</label>
                    <input
                        type="text"
                        id="vehicleVin"
                        name="vehicleVin"
                        placeholder="Enter Vehicle VIN"
                        value={commercialTruckData.vehicleVin}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleLicensePlate">Vehicle License Plate</label>
                    <input
                        type="text"
                        id="vehicleLicensePlate"
                        name="vehicleLicensePlate"
                        placeholder="Enter Vehicle License Plate"
                        value={commercialTruckData.vehicleLicensePlate}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="Enter Pickup Location"
                        value={commercialTruckData.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="deliveryLocation">Delivery Location</label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="Enter Delivery Location"
                        value={commercialTruckData.deliveryLocation}
                        onChange={handleChange}
                        required
                    />
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isConvertible"
                            name="isConvertible"
                            checked={commercialTruckData.isConvertible}
                            onChange={handleChange}
                        />
                        <label htmlFor="isConvertible">Convertible</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isModified"
                            name="isModified"
                            checked={commercialTruckData.isModified}
                            onChange={handleChange}
                        />
                        <label htmlFor="isModified">Modified</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isInoperable"
                            name="isInoperable"
                            checked={commercialTruckData.isInoperable}
                            onChange={handleChange}
                        />
                        <label htmlFor="isInoperable">Inoperable</label>
                    </div>
                    <label htmlFor="serviceLevel">Service Level</label>
                    <select
                        className="select-field"
                        id="serviceLevel"
                        name="serviceLevel"
                        value={commercialTruckData.serviceLevel}
                        onChange={handleChange}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Same Day">Same Day</option>
                    </select>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="enclosedTransport"
                            name="enclosedTransport"
                            checked={commercialTruckData.enclosedTransport}
                            onChange={handleChange}
                        />
                        <label htmlFor="enclosedTransport">Enclosed Transport</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termsAgreed"
                            name="termsAgreed"
                            checked={commercialTruckData.termsAgreed}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="termsAgreed">Agree to Terms and Conditions</label>
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        );
    };

    const CarOrLightTruckDeliveryForm = () => {
        const [formData, setFormData] = useState({
            vehicleType: '',
            vehicleModel: '',
            vehicleYear: '',
            vehicleColor: '',
            vehicleLicensePlate: '',
            vehicleVin: '',
            pickupLocation: '',
            deliveryLocation: '',
            isConvertible: false,
            isModified: false,
            isInoperable: false,
            serviceLevel: '',
            enclosedTransport: false,
            termsAgreed: false,
            deliveryDate: '',
            userEndpoint: personalEndpoint, // Add this line to link the load to a user
        });

        const handleChange = (event) => {
            const {name, value, type, checked} = event.target;
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-vehicle-load', formData);
                if (response.status === 200) {
                    // Assuming response.data.load is the new vehicle load object
                    const newLoad = response.data.load;

                    // Update the state to include the new load
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <DeliveryInfoTableCarOrLightTruck deliveryInfo={newLoad}/>
                    }]);

                    saveChatMessage('Vehicle delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting vehicle load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2>Car or Light Truck Delivery Request</h2>

                    {/* Car or Truck Model */}
                    <label htmlFor="carModel">Car or Truck Model</label>
                    <input
                        type="text"
                        id="carModel"
                        name="vehicleModel" // Make sure this is set to 'vehicleModel'
                        placeholder="Enter Car Model"
                        value={formData.vehicleModel}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <input
                        type="text"
                        id="vehicleType"
                        name="vehicleType"
                        placeholder="Enter Vehicle Type"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleYear">Vehicle Year</label>
                    <input
                        type="text"
                        id="vehicleYear"
                        name="vehicleYear"
                        placeholder="Enter Vehicle Year"
                        value={formData.vehicleYear}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleColor">Vehicle Color</label>
                    <input
                        type="text"
                        id="vehicleColor"
                        name="vehicleColor"
                        placeholder="Enter Vehicle Color"
                        value={formData.vehicleColor}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleVin">Vehicle VIN</label>
                    <input
                        type="text"
                        id="vehicleVin"
                        name="vehicleVin"
                        placeholder="Enter Vehicle VIN"
                        value={formData.vehicleVin}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="vehicleLicensePlate">Vehicle License Plate</label>
                    <input
                        type="text"
                        id="vehicleLicensePlate"
                        name="vehicleLicensePlate"
                        placeholder="Enter Vehicle License Plate"
                        value={formData.vehicleLicensePlate}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="Enter Pickup Location"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                    />

                    {/* Delivery Location */}
                    <label htmlFor="deliveryLocation">Delivery Location</label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="Enter Delivery Location"
                        value={formData.deliveryLocation}
                        onChange={handleChange}
                        required
                    />

                    {/* Convertible Checkbox */}
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isConvertible"
                            name="isConvertible"
                            checked={formData.isConvertible}
                            onChange={handleChange}
                        />
                        <label htmlFor="isConvertible">Convertible</label>
                    </div>

                    {/* Modified Checkbox */}
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isModified"
                            name="isModified"
                            checked={formData.isModified}
                            onChange={handleChange}
                        />
                        <label htmlFor="isModified">Modified</label>
                    </div>

                    {/* Inoperable Checkbox */}
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isInoperable"
                            name="isInoperable"
                            checked={formData.isInoperable}
                            onChange={handleChange}
                        />
                        <label htmlFor="isInoperable">Inoperable</label>
                    </div>

                    {/* Service Level Selection */}
                    <label htmlFor="serviceLevel">Service Level</label>
                    <select
                        className="select-field"
                        id="serviceLevel"
                        name="serviceLevel"
                        value={formData.serviceLevel}
                        onChange={handleChange}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Same Day">Same Day</option>
                    </select>

                    {/* Enclosed Transport Checkbox */}
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="enclosedTransport"
                            name="enclosedTransport"
                            checked={formData.enclosedTransport}
                            onChange={handleChange}
                        />
                        <label htmlFor="enclosedTransport">Enclosed Transport</label>
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termsAgreed"
                            name="termsAgreed"
                            checked={formData.termsAgreed}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="termsAgreed">Agree to Terms and Conditions</label>
                    </div>

                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        );
    };
    const BoatLoadForm = () => {
        const [boatLoadData, setBoatLoadData] = useState({
            boatType: '',
            boatModel: '',
            boatYear: '',
            boatColor: '',
            boatLicensePlate: '',
            boatVin: '',
            pickupLocation: '',
            deliveryLocation: '',
            isConvertible: false,
            isModified: false,
            isInoperable: false,
            serviceLevel: '',
            enclosedTransport: false,
            termsAgreed: false,
            deliveryDate: '',
            userEndpoint: personalEndpoint, // Add this line to link the load to a user
        });

        const handleChange = (event) => {
            const {name, value, type, checked} = event.target;
            setBoatLoadData({
                ...boatLoadData,
                [name]: type === "checkbox" ? checked : value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-boat-load', boatLoadData);
                if (response.status === 200) {
                    console.log('Boat Load submitted successfully:', response.data.load);

                    // Assuming response.data.load is the new boat load object
                    const newLoad = response.data.load;

                    // Update the state to include the new load
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <DeliveryInfoTableBoatLoad deliveryInfo={newLoad}/>
                    }]);

                    saveChatMessage('Boat Load delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting Boat Load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2>Boat Delivery Request</h2>
                    <label htmlFor="boatType">Boat Type</label>
                    <input
                        type="text"
                        id="boatType"
                        name="boatType"
                        placeholder="Enter Boat Type"
                        value={boatLoadData.boatType}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="boatModel">Boat Model</label>
                    <input
                        type="text"
                        id="boatModel"
                        name="boatModel"
                        placeholder="Enter Boat Model"
                        value={boatLoadData.boatModel}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="boatYear">Boat Year</label>
                    <input
                        type="text"
                        id="boatYear"
                        name="boatYear"
                        placeholder="Enter Boat Year"
                        value={boatLoadData.boatYear}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="boatColor">Boat Color</label>
                    <input
                        type="text"
                        id="boatColor"
                        name="boatColor"
                        placeholder="Enter Boat Color"
                        value={boatLoadData.boatColor}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="boatVin">Boat VIN</label>
                    <input
                        type="text"
                        id="boatVin"
                        name="boatVin"
                        placeholder="Enter Boat VIN"
                        value={boatLoadData.boatVin}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="boatLicensePlate">Boat License Plate</label>
                    <input
                        type="text"
                        id="boatLicensePlate"
                        name="boatLicensePlate"
                        placeholder="Enter Boat License Plate"
                        value={boatLoadData.boatLicensePlate}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="Enter Pickup Location"
                        value={boatLoadData.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="deliveryLocation">Delivery Location</label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="Enter Delivery Location"
                        value={boatLoadData.deliveryLocation}
                        onChange={handleChange}
                        required
                    />
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isConvertible"
                            name="isConvertible"
                            checked={boatLoadData.isConvertible}
                            onChange={handleChange}
                        />
                        <label htmlFor="isConvertible">Convertible</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isModified"
                            name="isModified"
                            checked={boatLoadData.isModified}
                            onChange={handleChange}
                        />
                        <label htmlFor="isModified">Modified</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isInoperable"
                            name="isInoperable"
                            checked={boatLoadData.isInoperable}
                            onChange={handleChange}
                        />
                        <label htmlFor="isInoperable">Inoperable</label>
                    </div>
                    <label htmlFor="serviceLevel">Service Level</label>
                    <select
                        className="select-field"
                        id="serviceLevel"
                        name="serviceLevel"
                        value={boatLoadData.serviceLevel}
                        onChange={handleChange}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Same Day">Same Day</option>
                    </select>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="enclosedTransport"
                            name="enclosedTransport"
                            checked={boatLoadData.enclosedTransport}
                            onChange={handleChange}
                        />
                        <label htmlFor="enclosedTransport">Enclosed Transport</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termsAgreed"
                            name="termsAgreed"
                            checked={boatLoadData.termsAgreed}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="termsAgreed">Agree to Terms and Conditions</label>
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>

        );
    };
    const DeliveryInfoTableBoatLoad = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Vehicle Type</th>
                    <th>Vehicle Model</th>
                    <th>Vehicle Year</th>
                    <th>Vehicle Color</th>
                    <th>License Plate</th>
                    <th>VIN</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Convertible</th>
                    <th>Modified</th>
                    <th>Inoperable</th>
                    <th>Service Level</th>
                    <th>Enclosed Transport</th>
                    <th>Terms Agreed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.boatType}</td>
                    <td>{deliveryInfo.boatModel}</td>
                    <td>{deliveryInfo.boatYear}</td>
                    <td>{deliveryInfo.boatYear}</td>
                    <td>{deliveryInfo.boatLicensePlate}</td>
                    <td>{deliveryInfo.boatVin}</td>
                    <td>{deliveryInfo.pickupLocation}</td>
                    <td>{deliveryInfo.deliveryLocation}</td>
                    <td>{deliveryInfo.isConvertible ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isModified ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isInoperable ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.serviceLevel}</td>
                    <td>{deliveryInfo.enclosedTransport ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.termsAgreed ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const ConstructionEquipmentLoadForm = () => {
        const [constructionEquipmentData, setConstructionEquipmentData] = useState({
            equipmentType: '',
            equipmentModel: '',
            equipmentYear: '',
            equipmentColor: '',
            equipmentLicensePlate: '',
            equipmentVin: '',
            pickupLocation: '',
            deliveryLocation: '',
            isConvertible: false,
            isModified: false,
            isInoperable: false,
            serviceLevel: '',
            enclosedTransport: false,
            termsAgreed: false,
            deliveryDate: '',
            userEndpoint: personalEndpoint, // Add this line to link the load to a user
        });

        const handleChange = (event) => {
            const {name, value, type, checked} = event.target;
            setConstructionEquipmentData({
                ...constructionEquipmentData,
                [name]: type === "checkbox" ? checked : value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-construction-equipment-load', constructionEquipmentData);
                if (response.status === 200) {
                    console.log('Construction Equipment load submitted successfully:', response.data.load);

                    // Assuming response.data.load is the new construction equipment load object
                    const newLoad = response.data.load;

                    // Update the state to include the new load
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <DeliveryInfoTableConstructionEquipment deliveryInfo={newLoad}/>
                    }]);

                    saveChatMessage('Construction Equipment delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting Construction Equipment load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2>Construction Equipment Delivery Request</h2>
                    <label htmlFor="equipmentType">Equipment Type</label>
                    <input
                        type="text"
                        id="equipmentType"
                        name="equipmentType"
                        placeholder="Enter Equipment Type"
                        value={constructionEquipmentData.equipmentType}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="equipmentModel">Equipment Model</label>
                    <input
                        type="text"
                        id="equipmentModel"
                        name="equipmentModel"
                        placeholder="Enter Equipment Model"
                        value={constructionEquipmentData.equipmentModel}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="equipmentYear">Equipment Year</label>
                    <input
                        type="text"
                        id="equipmentYear"
                        name="equipmentYear"
                        placeholder="Enter Equipment Year"
                        value={constructionEquipmentData.equipmentYear}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="equipmentColor">Equipment Color</label>
                    <input
                        type="text"
                        id="equipmentColor"
                        name="equipmentColor"
                        placeholder="Enter Equipment Color"
                        value={constructionEquipmentData.equipmentColor}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="equipmentVin">Equipment VIN</label>
                    <input
                        type="text"
                        id="equipmentVin"
                        name="equipmentVin"
                        placeholder="Enter Equipment VIN"
                        value={constructionEquipmentData.equipmentVin}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="equipmentLicensePlate">Equipment License Plate</label>
                    <input
                        type="text"
                        id="equipmentLicensePlate"
                        name="equipmentLicensePlate"
                        placeholder="Enter Equipment License Plate"
                        value={constructionEquipmentData.equipmentLicensePlate}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="pickupLocation">Pickup Location</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="Enter Pickup Location"
                        value={constructionEquipmentData.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="deliveryLocation">Delivery Location</label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="Enter Delivery Location"
                        value={constructionEquipmentData.deliveryLocation}
                        onChange={handleChange}
                        required
                    />
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isConvertible"
                            name="isConvertible"
                            checked={constructionEquipmentData.isConvertible}
                            onChange={handleChange}
                        />
                        <label htmlFor="isConvertible">Convertible</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isModified"
                            name="isModified"
                            checked={constructionEquipmentData.isModified}
                            onChange={handleChange}
                        />
                        <label htmlFor="isModified">Modified</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="isInoperable"
                            name="isInoperable"
                            checked={constructionEquipmentData.isInoperable}
                            onChange={handleChange}
                        />
                        <label htmlFor="isInoperable">Inoperable</label>
                    </div>
                    <label htmlFor="serviceLevel">Service Level</label>
                    <select
                        className="select-field"
                        id="serviceLevel"
                        name="serviceLevel"
                        value={constructionEquipmentData.serviceLevel}
                        onChange={handleChange}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Same Day">Same Day</option>
                    </select>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="enclosedTransport"
                            name="enclosedTransport"
                            checked={constructionEquipmentData.enclosedTransport}
                            onChange={handleChange}
                        />
                        <label htmlFor="enclosedTransport">Enclosed Transport</label>
                    </div>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termsAgreed"
                            name="termsAgreed"
                            checked={constructionEquipmentData.termsAgreed}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="termsAgreed">Agree to Terms and Conditions</label>
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        );
    };
    const DeliveryInfoTableConstructionEquipment = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Equipment Type</th>
                    <th>Equipment Model</th>
                    <th>Equipment Year</th>
                    <th>Equipment Color</th>
                    <th>License Plate</th>
                    <th>VIN</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Convertible</th>
                    <th>Modified</th>
                    <th>Inoperable</th>
                    <th>Service Level</th>
                    <th>Enclosed Transport</th>
                    <th>Terms Agreed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.equipmentType}</td>
                    <td>{deliveryInfo.equipmentModel}</td>
                    <td>{deliveryInfo.equipmentYear}</td>
                    <td>{deliveryInfo.equipmentColor}</td>
                    <td>{deliveryInfo.equipmentLicensePlate}</td>
                    <td>{deliveryInfo.equipmentVin}</td>
                    <td>{deliveryInfo.pickupLocation}</td>
                    <td>{deliveryInfo.deliveryLocation}</td>
                    <td>{deliveryInfo.isConvertible ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isModified ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.isInoperable ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.serviceLevel}</td>
                    <td>{deliveryInfo.enclosedTransport ? 'Yes' : 'No'}</td>
                    <td>{deliveryInfo.termsAgreed ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const HeavyEquipmentLoadForm = () => {
        const [heavyEquipmentData, setHeavyEquipmentData] = useState({
            makeAndModel: '',
            serialNumber: '',
            weight: '',
            operatorName: '',
            pickupLocation: '',
            deliveryLocation: '',
            serviceLevel: '',
            termsAgreed: false,
            deliveryDate: '',
            userEndpoint: personalEndpoint, // Add this line to link the load to a user
        });

        const handleChange = (event) => {
            const {name, value, type, checked} = event.target;
            setHeavyEquipmentData({
                ...heavyEquipmentData,
                [name]: type === "checkbox" ? checked : value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-heavy-equipment-load', heavyEquipmentData);
                if (response.status === 200) {
                    console.log('Heavy Equipment load submitted successfully:', response.data.load);

                    // Assuming response.data.load is the new heavy equipment load object
                    const newLoad = response.data.load;

                    // Update the state to include the new load
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <DeliveryInfoTableHeavyEquipment deliveryInfo={newLoad}/>
                    }]);

                    saveChatMessage('Heavy Equipment delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting Heavy Equipment load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <h2>Heavy Equipment Delivery Request</h2>
                    <label htmlFor="makeAndModel">Make and Model:</label>
                    <input
                        type="text"
                        id="makeAndModel"
                        name="makeAndModel"
                        placeholder="Enter Make and Model"
                        value={heavyEquipmentData.makeAndModel}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="serialNumber">Serial Number:</label>
                    <input
                        type="text"
                        id="serialNumber"
                        name="serialNumber"
                        placeholder="Enter Serial Number"
                        value={heavyEquipmentData.serialNumber}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="weight">Weight:</label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        placeholder="Enter Weight"
                        value={heavyEquipmentData.weight}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="operatorName">Operator's Name:</label>
                    <input
                        type="text"
                        id="operatorName"
                        name="operatorName"
                        placeholder="Enter Operator's Name"
                        value={heavyEquipmentData.operatorName}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="pickupLocation">Pickup Location:</label>
                    <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        placeholder="Enter Pickup Location"
                        value={heavyEquipmentData.pickupLocation}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="deliveryLocation">Delivery Location:</label>
                    <input
                        type="text"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        placeholder="Enter Delivery Location"
                        value={heavyEquipmentData.deliveryLocation}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="serviceLevel">Service Level:</label>
                    <select
                        className="select-field"
                        id="serviceLevel"
                        name="serviceLevel"
                        value={heavyEquipmentData.serviceLevel}
                        onChange={handleChange}
                    >
                        <option value="Standard">Standard</option>
                        <option value="Expedited">Expedited</option>
                        <option value="Same Day">Same Day</option>
                    </select>
                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            id="termsAgreed"
                            name="termsAgreed"
                            checked={heavyEquipmentData.termsAgreed}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="termsAgreed">Agree to Terms and Conditions</label>
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        );
    };
    const LTLDeliveryInfoTable = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Service Needed</th>
                    <th>Company Name</th>
                    <th>Your Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Shipment Date</th>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Commodity Description</th>
                    <th>Commodity Class</th>
                    <th>Commodity Dimensions</th>
                    <th>Total Weight</th>
                    <th>Additional Comments</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.serviceNeeded}</td>
                    <td>{deliveryInfo.companyName}</td>
                    <td>{deliveryInfo.yourName}</td>
                    <td>{deliveryInfo.email}</td>
                    <td>{deliveryInfo.phoneNumber}</td>
                    <td>{deliveryInfo.shipmentDate}</td>
                    <td>{deliveryInfo.origin}</td>
                    <td>{deliveryInfo.destination}</td>
                    <td>{deliveryInfo.commodityDescription}</td>
                    <td>{deliveryInfo.commodityClass}</td>
                    <td>{deliveryInfo.commodityDimensions}</td>
                    <td>{deliveryInfo.totalWeight}</td>
                    <td>{deliveryInfo.additionalComments}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const LTLDeliveryForm = () => {
        const [ltlData, setLtlData] = useState({
            serviceNeeded: '',
            companyName: '',
            yourName: '',
            email: '',
            phoneNumber: '',
            shipmentDate: '',
            origin: '',
            destination: '',
            commodityDescription: '',
            commodityClass: '',
            commodityDimensions: '',
            totalWeight: '',
            additionalComments: '',
        });

        const handleChange = (event) => {
            const {name, value} = event.target;
            setLtlData({
                ...ltlData,
                [name]: value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-ltl-delivery', ltlData);
                if (response.status === 200) {
                    console.log('LTL delivery submitted successfully:', response.data.delivery);
                    const newDelivery = response.data.delivery;
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <LTLDeliveryInfoTable deliveryInfo={newDelivery}/>
                    }]);
                    saveChatMessage('LTL delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting LTL delivery:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="serviceNeeded">Service Needed</label>
                    <select id="serviceNeeded" name="serviceNeeded" value={ltlData.serviceNeeded}
                            onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="option1">Liftgate Service</option>
                        <option value="option2">Inside Pickup and Delivery</option>
                        <option value="option3">Appointment Delivery</option>
                    </select>
                    <label htmlFor="companyName">Company Name</label>
                    <input type="text" id="companyName" name="companyName" value={ltlData.companyName}
                           onChange={handleChange}/>
                    <label htmlFor="yourName">Your Name</label>
                    <input type="text" id="yourName" name="yourName" value={ltlData.yourName} onChange={handleChange}/>
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={ltlData.email} onChange={handleChange}/>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" value={ltlData.phoneNumber}
                           onChange={handleChange}/>
                    <label htmlFor="shipmentDate">Shipment Date</label>
                    <input type="date" id="shipmentDate" name="shipmentDate" value={ltlData.shipmentDate}
                           onChange={handleChange}/>
                    <label htmlFor="origin">Origin</label>
                    <input type="text" id="origin" name="origin" value={ltlData.origin} onChange={handleChange}/>
                    <label htmlFor="destination">Destination</label>
                    <input type="text" id="destination" name="destination" value={ltlData.destination}
                           onChange={handleChange}/>
                    <label htmlFor="commodityDescription">Commodity Description</label>
                    <input type="text" id="commodityDescription" name="commodityDescription"
                           value={ltlData.commodityDescription} onChange={handleChange}/>
                    <label htmlFor="commodityClass">Commodity Class</label>
                    <input type="text" id="commodityClass" name="commodityClass" value={ltlData.commodityClass}
                           onChange={handleChange}/>
                    <label htmlFor="commodityDimensions">Commodity Dimensions</label>
                    <input type="text" id="commodityDimensions" name="commodityDimensions"
                           value={ltlData.commodityDimensions} onChange={handleChange}/>
                    <label htmlFor="totalWeight">Total Weight</label>
                    <input type="number" id="totalWeight" name="totalWeight" value={ltlData.totalWeight}
                           onChange={handleChange}/>
                    <label htmlFor="additionalComments">Additional Comments or Instructions</label>
                    <textarea id="additionalComments" name="additionalComments" value={ltlData.additionalComments}
                              onChange={handleChange}/>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };

    const DeliveryInfoTableHeavyEquipment = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Make and Model</th>
                    <th>Serial Number</th>
                    <th>Weight</th>
                    <th>Operator's Name</th>
                    <th>Pickup Location</th>
                    <th>Delivery Location</th>
                    <th>Service Level</th>
                    <th>Terms Agreed</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.makeAndModel}</td>
                    <td>{deliveryInfo.serialNumber}</td>
                    <td>{deliveryInfo.weight}</td>
                    <td>{deliveryInfo.operatorName}</td>
                    <td>{deliveryInfo.pickupLocation}</td>
                    <td>{deliveryInfo.deliveryLocation}</td>
                    <td>{deliveryInfo.serviceLevel}</td>
                    <td>{deliveryInfo.termsAgreed ? 'Yes' : 'No'}</td>
                </tr>
                </tbody>
            </table>
        );
    };

    const FTLDeliveryInfoTable = ({deliveryInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Shipper's Name</th>
                    <th>Shipper's Phone</th>
                    <th>Shipper's Email</th>
                    <th>Pick-up Address</th>
                    <th>Pick-up Date and Time</th>
                    <th>Your Name</th>
                    <th>Your Phone</th>
                    <th>Your Email</th>
                    <th>Delivery Address</th>
                    <th>Delivery Date and Time</th>
                    <th>Freight Description</th>
                    <th>Total Weight</th>
                    <th>Equipment Type Required</th>
                    <th>Billing Information Address</th>
                    <th>Billing Information Contact Name</th>
                    <th>Payment Terms</th>
                    <th>Special Handling Instructions</th>
                    <th>Shipper’s Signature</th>
                    <th>Date of Request</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{deliveryInfo.shipperName}</td>
                    <td>{deliveryInfo.shipperPhone}</td>
                    <td>{deliveryInfo.shipperEmail}</td>
                    <td>{deliveryInfo.pickupAddress}</td>
                    <td>{deliveryInfo.pickupDateTime}</td>
                    <td>{deliveryInfo.yourName}</td>
                    <td>{deliveryInfo.yourPhone}</td>
                    <td>{deliveryInfo.yourEmail}</td>
                    <td>{deliveryInfo.deliveryAddress}</td>
                    <td>{deliveryInfo.deliveryDateTime}</td>
                    <td>{deliveryInfo.freightDescription}</td>
                    <td>{deliveryInfo.totalWeight}</td>
                    <td>{deliveryInfo.equipmentType}</td>
                    <td>{deliveryInfo.billingAddress}</td>
                    <td>{deliveryInfo.billingContactName}</td>
                    <td>{deliveryInfo.paymentTerms}</td>
                    <td>{deliveryInfo.specialInstructions}</td>
                    <td>{deliveryInfo.shipperSignature}</td>
                    <td>{deliveryInfo.requestDate}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const ExpediteLoadForm = () => {
        const [expediteData, setExpediteData] = useState({
            shipperName: '',
            shipperPhone: '',
            shipperEmail: '',
            pickupAddress: '',
            deliveryAddress: '',
            deliveryDateTime: '',
            goodsDescription: '',
            totalWeight: '',
            dimensions: '',
            vehicleType: '',
            serviceLevel: '',
            specialInstructions: '',
            payment: '',
        });

        const handleChange = (event) => {
            const {name, value} = event.target;
            setExpediteData({
                ...expediteData,
                [name]: value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-expedite-load', expediteData);
                if (response.status === 200) {
                    console.log('Expedite load submitted successfully:', response.data.load);
                    const newLoad = response.data.load;
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <ExpediteLoadInfoTable loadInfo={newLoad}/>
                    }]);
                    saveChatMessage('Expedite load details submitted', 'assistant');
                } else {
                    console.error('Error submitting expedite load:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form onSubmit={handleSubmit} className="car-delivery-form">
                <div className="form-group">
                    <label htmlFor="shipperName">Shipper's Name</label>
                    <input type="text" id="shipperName" name="shipperName" value={expediteData.shipperName}
                           onChange={handleChange}/>

                    <label htmlFor="shipperPhone">Shipper's Phone</label>
                    <input type="tel" id="shipperPhone" name="shipperPhone" value={expediteData.shipperPhone}
                           onChange={handleChange}/>

                    <label htmlFor="shipperEmail">Shipper's Email</label>
                    <input type="email" id="shipperEmail" name="shipperEmail" value={expediteData.shipperEmail}
                           onChange={handleChange}/>

                    <label htmlFor="pickupAddress">Pick-Up Address</label>
                    <input type="text" id="pickupAddress" name="pickupAddress" value={expediteData.pickupAddress}
                           onChange={handleChange}/>

                    <label htmlFor="deliveryAddress">Delivery Address</label>
                    <input type="text" id="deliveryAddress" name="deliveryAddress" value={expediteData.deliveryAddress}
                           onChange={handleChange}/>

                    <label htmlFor="deliveryDateTime">Requested Delivery Date and Time</label>
                    <input type="datetime-local" id="deliveryDateTime" name="deliveryDateTime"
                           value={expediteData.deliveryDateTime} onChange={handleChange}/>

                    <label htmlFor="goodsDescription">Description of Goods</label>
                    <input type="text" id="goodsDescription" name="goodsDescription"
                           value={expediteData.goodsDescription} onChange={handleChange}/>

                    <label htmlFor="totalWeight">Total Weight</label>
                    <input type="number" id="totalWeight" name="totalWeight" value={expediteData.totalWeight}
                           onChange={handleChange}/>

                    <label htmlFor="dimensions">Dimensions</label>
                    <input type="text" id="dimensions" name="dimensions" value={expediteData.dimensions}
                           onChange={handleChange}/>

                    <label htmlFor="vehicleType">Vehicle Type Required</label>
                    <input type="text" id="vehicleType" name="vehicleType" value={expediteData.vehicleType}
                           onChange={handleChange}/>

                    <label htmlFor="serviceLevel">Service Level</label>
                    <input type="text" id="serviceLevel" name="serviceLevel" value={expediteData.serviceLevel}
                           onChange={handleChange}/>

                    <label htmlFor="specialInstructions">Special Instructions</label>
                    <textarea id="specialInstructions" name="specialInstructions"
                              value={expediteData.specialInstructions} onChange={handleChange}/>

                    <label htmlFor="payment">Payment</label>
                    <select id="payment" name="payment" value={expediteData.payment} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="In Cash">In Cash</option>
                        <option value="Card">Card</option>
                        <option value="Pre-payment">Pre-payment</option>
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };

    const ExpediteLoadInfoTable = ({loadInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Shipper's Name</th>
                    <th>Shipper's Phone</th>
                    <th>Shipper's Email</th>
                    <th>Pick-Up Address</th>
                    <th>Delivery Address</th>
                    <th>Requested Delivery Date and Time</th>
                    <th>Description of Goods</th>
                    <th>Total Weight</th>
                    <th>Dimensions</th>
                    <th>Vehicle Type Required</th>
                    <th>Service Level</th>
                    <th>Special Instructions</th>
                    <th>Payment</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{loadInfo.shipperName}</td>
                    <td>{loadInfo.shipperPhone}</td>
                    <td>{loadInfo.shipperEmail}</td>
                    <td>{loadInfo.pickupAddress}</td>
                    <td>{loadInfo.deliveryAddress}</td>
                    <td>{loadInfo.deliveryDateTime}</td>
                    <td>{loadInfo.goodsDescription}</td>
                    <td>{loadInfo.totalWeight}</td>
                    <td>{loadInfo.dimensions}</td>
                    <td>{loadInfo.vehicleType}</td>
                    <td>{loadInfo.serviceLevel}</td>
                    <td>{loadInfo.specialInstructions}</td>
                    <td>{loadInfo.payment}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const OtherForm = () => {
        const [otherData, setOtherData] = useState({
            issueDescription: '',
        });

        const handleChange = (event) => {
            const {name, value} = event.target;
            setOtherData({
                ...otherData,
                [name]: value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-other', otherData);
                if (response.status === 200) {
                    console.log('Other form submitted successfully:', response.data.other);
                    const newOther = response.data.other;
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <OtherInfoTable otherInfo={newOther}/>
                    }]);
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: <OtherInfoTable loadInfo={newOther}/>
                    }]);
                } else {
                    console.error('Error submitting other form:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="issueDescription">Describe your issue</label>
                    <textarea id="issueDescription" name="issueDescription" value={otherData.issueDescription}
                              onChange={handleChange}/>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
    };
    const IneedFreeConsulationForm = () => {
        const [consultationData, setConsultationData] = useState({
            problemDescription: '',
        });

        const handleChange = (event) => {
            const {name, value} = event.target;
            setConsultationData({
                ...consultationData,
                [name]: value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-free-consultation', consultationData);
                if (response.status === 200) {
                    console.log('Free consultation form submitted successfully:', response.data.consultation);
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: "Your details were submitted successfully. We contact you soon",
                    }]);
                } else {
                    console.error('Error submitting free consultation form:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="problemDescription">Describe your problem</label>
                    <textarea id="problemDescription" name="problemDescription"
                              value={consultationData.problemDescription} onChange={handleChange}/>
                </div>
                <button type="submit">Request my Qoute</button>
            </form>
        );
    };
    const OtherInfoTable = ({otherInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Issue Description</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{otherInfo.issueDescription}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const StudentMovingForm = () => {
        const [formData, setFormData] = useState({
            studentName: '',
            studentPhoneNumber: '',
            studentEmailAddress: '',
            currentAddress: '',
            newAddress: '',
            preferredMoveDate: '',
            alternateMoveDate: '',
            preferredTimeWindow: '',
            descriptionOfItems: '',
            specialHandlingRequirements: '',
            packingServicesRequired: false,
            insuranceRequirement: '',
            vehicleTypePreferred: '',
            paymentMethodPreference: '',
            additionalServices: '',
            commentsSpecialInstructions: '',
            studentSignature: '',
            date: '',
        });

        const handleChange = (event) => {
            const { name, value, type, checked } = event.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: type === 'checkbox' ? checked : value
            }));
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-student-moving', formData);
                if (response.status === 200) {
                    setPreviousChats([...previousChats, {role: "You", content: value}, {
                        role: "Assistant",
                        content: <StudentMovingInfoTable movingInfo={response.data.data}/>
                    }]);
                    saveChatMessage(value, 'You');
                    setValue('');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };

        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
               <div className="form-group">

                   <label htmlFor="studentName">Student Name</label>
                   <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} required />

                   <label htmlFor="studentPhoneNumber">Student Phone Number</label>
                   <input type="tel" id="studentPhoneNumber" name="studentPhoneNumber" value={formData.studentPhoneNumber} onChange={handleChange} required />

                   <label htmlFor="studentEmailAddress">Student Email Address</label>
                   <input type="email" id="studentEmailAddress" name="studentEmailAddress" value={formData.studentEmailAddress} onChange={handleChange} required />

                   <label htmlFor="currentAddress">Current Address</label>
                   <input type="text" id="currentAddress" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required />

                   <label htmlFor="newAddress">New Address</label>
                   <input type="text" id="newAddress" name="newAddress" value={formData.newAddress} onChange={handleChange} required />

                   <label htmlFor="preferredMoveDate">Preferred Move Date</label>
                   <input type="date" id="preferredMoveDate" name="preferredMoveDate" value={formData.preferredMoveDate} onChange={handleChange} required />

                   <label htmlFor="alternateMoveDate">Alternate Move Date</label>
                   <input type="date" id="alternateMoveDate" name="alternateMoveDate" value={formData.alternateMoveDate} onChange={handleChange} required />

                   <label htmlFor="preferredTimeWindow">Preferred Time Window</label>
                   <input type="text" id="preferredTimeWindow" name="preferredTimeWindow" value={formData.preferredTimeWindow} onChange={handleChange} required />

                   <label htmlFor="descriptionOfItems">Description Of Items</label>
                   <input type="text" id="descriptionOfItems" name="descriptionOfItems" value={formData.descriptionOfItems} onChange={handleChange} required />

                   <label htmlFor="specialHandlingRequirements">Special Handling Requirements</label>
                   <input type="text" id="specialHandlingRequirements" name="specialHandlingRequirements" value={formData.specialHandlingRequirements} onChange={handleChange} required />

                   <label htmlFor="packingServicesRequired">Packing Services Required</label>
                   <input type="checkbox" id="packingServicesRequired" name="packingServicesRequired" checked={formData.packingServicesRequired} onChange={handleChange} />

                   <label htmlFor="insuranceRequirement">Insurance Requirement</label>
                   <input type="text" id="insuranceRequirement" name="insuranceRequirement" value={formData.insuranceRequirement} onChange={handleChange} required />

                   <label htmlFor="vehicleTypePreferred">Vehicle Type Preferred</label>
                   <input type="text" id="vehicleTypePreferred" name="vehicleTypePreferred" value={formData.vehicleTypePreferred} onChange={handleChange} required />

                   <label htmlFor="paymentMethodPreference">Payment Method Preference</label>
                   <input type="text" id="paymentMethodPreference" name="paymentMethodPreference" value={formData.paymentMethodPreference} onChange={handleChange} required />

                   <label htmlFor="additionalServices">Additional Services</label>
                   <input type="text" id="additionalServices" name="additionalServices" value={formData.additionalServices} onChange={handleChange} required />

                   <label htmlFor="commentsSpecialInstructions">Comments/Special Instructions</label>
                   <input type="text" id="commentsSpecialInstructions" name="commentsSpecialInstructions" value={formData.commentsSpecialInstructions} onChange={handleChange} required />

                   <label htmlFor="studentSignature">Student Signature</label>
                   <input type="text" id="studentSignature" name="studentSignature" value={formData.studentSignature} onChange={handleChange} required />

                   <label htmlFor="date">Date</label>
                   <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
               </div>
                <button type="submit">Submit</button>
            </form>
        );
    };
    const StudentMovingInfoTable = ({movingInfo}) => {
        return (
            <table className="beautiful-table">
                <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Student Phone Number</th>
                    <th>Student Email Address</th>
                    <th>Current Address</th>
                    <th>New Address</th>
                    <th>Preferred Move Date</th>
                    <th>Alternate Move Date</th>
                    <th>Preferred Time Window</th>
                    <th>Description Of Items</th>
                    <th>Special Handling Requirements</th>
                    <th>Packing Services Required</th>
                    <th>Insurance Requirement</th>
                    <th>Vehicle Type Preferred</th>
                    <th>Payment Method Preference</th>
                    <th>Additional Services</th>
                    <th>Comments/Special Instructions</th>
                    <th>Student Signature</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{movingInfo.studentName}</td>
                    <td>{movingInfo.studentPhoneNumber}</td>
                    <td>{movingInfo.studentEmailAddress}</td>
                    <td>{movingInfo.currentAddress}</td>
                    <td>{movingInfo.newAddress}</td>
                    <td>{movingInfo.preferredMoveDate}</td>
                    <td>{movingInfo.alternateMoveDate}</td>
                    <td>{movingInfo.preferredTimeWindow}</td>
                    <td>{movingInfo.descriptionOfItems}</td>
                    <td>{movingInfo.specialHandlingRequirements}</td>
                    <td>{movingInfo.packingServicesRequired ? 'Yes' : 'No'}</td>
                    <td>{movingInfo.insuranceRequirement}</td>
                    <td>{movingInfo.vehicleTypePreferred}</td>
                    <td>{movingInfo.paymentMethodPreference}</td>
                    <td>{movingInfo.additionalServices}</td>
                    <td>{movingInfo.commentsSpecialInstructions}</td>
                    <td>{movingInfo.studentSignature}</td>
                    <td>{movingInfo.date}</td>
                </tr>
                </tbody>
            </table>
        );
    };
    const FTLLoadForm = () => {
        const [ftlData, setFtlData] = useState({
            shipperName: '',
            shipperPhone: '',
            shipperEmail: '',
            pickupAddress: '',
            pickupDateTime: '',
            yourName: '',
            yourPhone: '',
            yourEmail: '',
            deliveryAddress: '',
            deliveryDateTime: '',
            freightDescription: '',
            totalWeight: '',
            equipmentType: '',
            billingAddress: '',
            billingContactName: '',
            paymentTerms: '',
            specialInstructions: '',
            shipperSignature: '',
            requestDate: new Date().toISOString().slice(0, 10),
        });

        const handleChange = (event) => {
            const {name, value} = event.target;
            setFtlData({
                ...ftlData,
                [name]: value
            });
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.post('http://localhost:8080/submit-ftl-load', ftlData);
                if (response.status === 200) {
                    console.log('FTL delivery submitted successfully:', response.data.delivery);
                    setPreviousChats(prevChats => [...prevChats, {
                        role: "Assistant",
                        content: 'Your details were submitted successfully.',
                    }]);
                    saveChatMessage('FTL delivery details submitted', 'assistant');
                } else {
                    console.error('Error submitting FTL delivery:', response);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        };
        return (
            <form className="car-delivery-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Shipper's Name</label>
                    <input type="text" name="shipperName" value={ftlData.shipperName} onChange={handleChange}/>

                    <label>Shipper's Phone</label>
                    <input type="tel" name="shipperPhone" value={ftlData.shipperPhone} onChange={handleChange}/>

                    <label>Shipper's Email</label>
                    <input type="email" name="shipperEmail" value={ftlData.shipperEmail} onChange={handleChange}/>

                    <label>Pick-up Address</label>
                    <input type="text" name="pickupAddress" value={ftlData.pickupAddress} onChange={handleChange}/>

                    <label>Pick-up Date and Time</label>
                    <input type="datetime-local" name="pickupDateTime" value={ftlData.pickupDateTime}
                           onChange={handleChange}/>

                    <label>Your Name</label>
                    <input type="text" name="yourName" value={ftlData.yourName} onChange={handleChange}/>

                    <label>Your Phone</label>
                    <input type="tel" name="yourPhone" value={ftlData.yourPhone} onChange={handleChange}/>

                    <label>Your Email</label>
                    <input type="email" name="yourEmail" value={ftlData.yourEmail} onChange={handleChange}/>

                    <label>Delivery Address</label>
                    <input type="text" name="deliveryAddress" value={ftlData.deliveryAddress} onChange={handleChange}/>

                    <label>Delivery Date and Time</label>
                    <input type="datetime-local" name="deliveryDateTime" value={ftlData.deliveryDateTime}
                           onChange={handleChange}/>

                    <label>Freight Description</label>
                    <input type="text" name="freightDescription" value={ftlData.freightDescription}
                           onChange={handleChange}/>

                    <label>Total Weight</label>
                    <input type="number" name="totalWeight" value={ftlData.totalWeight} onChange={handleChange}/>

                    <label>Equipment Type Required</label>
                    <input type="text" name="equipmentType" value={ftlData.equipmentType} onChange={handleChange}/>

                    <label>Billing Information Address</label>
                    <input type="text" name="billingAddress" value={ftlData.billingAddress} onChange={handleChange}/>

                    <label>Billing Information Contact Name</label>
                    <input type="text" name="billingContactName" value={ftlData.billingContactName}
                           onChange={handleChange}/>

                    <label>Payment Terms</label>
                    <input type="text" name="paymentTerms" value={ftlData.paymentTerms} onChange={handleChange}/>

                    <label>Special Handling Instructions</label>
                    <textarea name="specialInstructions" value={ftlData.specialInstructions} onChange={handleChange}/>

                    <label>Shipper’s Signature</label>
                    <input type="text" name="shipperSignature" value={ftlData.shipperSignature}
                           onChange={handleChange}/>

                    <label>Date of Request</label>
                    <input type="date" name="requestDate" value={ftlData.requestDate} onChange={handleChange}/>
                </div>
                <button type="submit">Submit</button>
            </form>
        );
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
            const userInfoString = JSON.stringify(userInfo);
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: userInfoString
            }]);
            saveChatMessage(value, 'You');
            saveChatMessage(userInfoString, 'Assistant');
            setValue('');
            setIsLoading(false);
            return;
        }
        if (isUserMakeCommercialBusinessMovingForm(value)) {
            const customResponse = <CommercialBusinessMovingForm setPreviousChats={setPreviousChats}
                                                           saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeHeavyLiftingAndMovingOnlyForm(value)) {
            const customResponse = <HeavyLiftingAndMovingOnlyForm setPreviousChats={setPreviousChats}
                                                           saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeLongDistanceMoving(value)) {
            const customResponse = <LongDistanceMovingForm setPreviousChats={setPreviousChats}
                                                                saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeOfficeMovingForm(value)) {
            const customResponse = <OfficeMovingForm setPreviousChats={setPreviousChats}
                                                                saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeCarOrLightTruckLoad(value)) {
            const customResponse = <CarOrLightTruckDeliveryForm setPreviousChats={setPreviousChats}
                                                                saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }

        if (isUserMakeInternationalMovingForm(value)) {
            const customResponse = <InternationalMovingForm setPreviousChats={setPreviousChats}
                                                    saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeLocalMoving(value)) {
            const customResponse = <LocalMovingForm setPreviousChats={setPreviousChats}
                                                                saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeHeavyEquipmentLoad(value)) {
            const customResponse = <HeavyEquipmentLoadForm setPreviousChats={setPreviousChats}
                                                           saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeOtherForm(value)) {
            const customResponse = <OtherForm setPreviousChats={setPreviousChats}
                                              saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserNeedFreeConsulationForm(value)) {
            const customResponse = <IneedFreeConsulationForm setPreviousChats={setPreviousChats}
                                                             saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeExpediteLoadForm(value)) {
            const customResponse = <ExpediteLoadForm setPreviousChats={setPreviousChats}
                                                     saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeEquipmentConstructionLoad(value)) {
            const customResponse = <ConstructionEquipmentLoadForm setPreviousChats={setPreviousChats}
                                                                  saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeFTLLoadForm(value)) {
            const customResponse = <FTLLoadForm setPreviousChats={setPreviousChats}
                                                saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeLTLLoad(value)) {
            const customResponse = <LTLDeliveryForm setPreviousChats={setPreviousChats}
                                                    saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeBoatLoad(value)) {
            const customResponse = <BoatLoadForm setPreviousChats={setPreviousChats}
                                                 saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeMotoLoad(value)) {
            const customResponse = <MotoEquipmentLoadForm setPreviousChats={setPreviousChats}
                                                          saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeAutoMotoBoatEquipmentForm(value)) {
            const customResponse = <AutoMotoBoatEquipmentForm setPreviousChats={setPreviousChats}
                                                                saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeMovingAndStorageServiceForm(value)) {
            const customResponse = <MovingAndStorageServiceForm setPreviousChats={setPreviousChats}
                                                            saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeCommercialTruckLoad(value)) {
            const customResponse = <CommercialTruckLoadForm setPreviousChats={setPreviousChats}
                                                            saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeMilitaryMovingForm(value)) {
            const customResponse = <MilitaryMovingForm setPreviousChats={setPreviousChats}
                                                            saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeCorporateMovingForm(value)) {
            const customResponse = <CorporateMovingForm setPreviousChats={setPreviousChats}
                                                       saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        if (isUserMakeStudentMovingForm(value)) {
            const customResponse = <StudentMovingForm setPreviousChats={setPreviousChats}
                                                        saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "Assistant",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            submitButton.current.click();
            return;
        }
        /*if (isUserMakeVehicleLoad(value)) {
            const customResponse = <CarDeliveryForm setPreviousChats={setPreviousChats}
                                                    saveChatMessage={saveChatMessage}/>;
            setPreviousChats([...previousChats, {role: "You", content: value}, {
                role: "You",
                content: customResponse
            }]);
            saveChatMessage(value, 'You');
            setValue('');
            setIsLoading(false);
            return;
        }*/
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

    const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

    console.log(uniqueTitles)
    console.log(previousChats)

    const handleLogout = () => {
        setUser(null);
        navigate('/sign-in');
    };

    return (
        <div className={`app ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
            <section className={`side-bar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="control-buttons">
                    <button className="new-chat-session-button" onClick={createNewChatSession}>New chat session</button>
                    <Link to={`/admin-dashboard/${personalEndpoint}`} className="my-loads-dashboard-button">My
                        loads</Link>
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
                {!hasStartedConversation && user && <h1 className="greeting">Hello {user.name},👋</h1>}
                <ul className="feed">
                    {previousChats.map((chatMessage, index) => (
                        <li key={index} className={`message ${chatMessage.role}`}>
                            <div className="message-header">
    <span className="avatar-container">
      <img src={chatMessage.role === 'You' ? userAvatar : assistantAvatar} alt={chatMessage.role}
           className="chat-avatar"/>
    </span>
                                <div className="message-content">
                                    <span
                                        className="avatar-label">{chatMessage.role === 'You' ? 'You' : 'Jarvis'}</span>

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
                    <button className="choose-category-button" onClick={() => setShowCategoryPopup(true)}>Choose Your
                        Category
                    </button>

                    {showCategoryPopup && (
                        <div className="popup-overlay">
                            <div className="category-popup">
                                <div className="icon-container">
                                    <FaTimesCustomIcon onClick={() => setShowCategoryPopup(false)}/>
                                </div>
                                <div className="title-popup">
                                    <h2>Category Selection</h2>
                                </div>
                                <div className="popup-content-category">
                                    {categoryOptions.map(category => (
                                        <button className="category-button" key={category}
                                                onClick={() => handleCategorySelect(category)}>
                                            {category}
                                        </button>
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                    {showSubCategoryPopup && (
                        <div className="popup-overlay">
                            <div className="category-popup">
                                <div className="icon-container">
                                    <FontAwesomeIcon className="fa-left-icon" icon={faArrowLeft} onClick={() => {
                                        setShowSubCategoryPopup(false);
                                        setShowCategoryPopup(true);
                                    }}/>
                                    <FaTimesCustomIcon onClick={() => setShowSubCategoryPopup(false)}/>
                                </div>
                                <div className="title-popup">
                                    {/* Render different titles based on main category */}
                                    <h2>{mainCategory === 'i want to deliver a vehicle' ? 'Vehicle Load Options' : 'Moving Options'}</h2>
                                </div>
                                <div className="popup-content-category">
                                    {subCategories.map(subCategory => (
                                        <button
                                            key={subCategory}
                                            className="category-button"
                                            onClick={() => handleSubCategorySelect(subCategory)}
                                        >
                                            {subCategory}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="input-container">
                        <input
                            id="input"
                            ref={inputContainer}
                            value={transcript || value}
                            onKeyPress={handleKeyPress}
                            onChange={(e) => setValue(e.target.value)}
                            style={{color: isTextTransparent ? 'transparent' : 'inherit'}}/>
                        <div
                            className="submit-button"
                            id="submit-button-input"
                            ref={submitButton}
                            onClick={getMessages}>
                            <img src={send} alt="Send"/>
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