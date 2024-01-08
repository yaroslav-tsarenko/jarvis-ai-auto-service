import React, {useEffect, useState, useRef} from "react";
import './AdminDashboard.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {faBars, faTimes, faSignOutAlt, faCog, faTruck, faRobot, faUser} from "@fortawesome/free-solid-svg-icons";
import {ReactComponent as UserAvatarComponent} from "../../assets/userAvatar2.svg";
import {ReactComponent as BellComponent} from "../../assets/bell.svg";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { faEdit, faTrashAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from 'axios';


const AdminDashboard = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [chatEndpoint, setChatEndpoint] = useState(null);
    const {personalEndpoint} = useParams();
    const [vehicleLoads, setVehicleLoads] = useState([]);
    const [motoEquipmentLoads, setMotoEquipmentLoads] = useState([]);
    const [commercialTruckLoads, setCommercialTruckLoads] = useState([]); // Add this line
    const [boatLoads, setBoatLoads] = useState([]); // Add this line
    const [constructionEquipmentLoads, setConstructionEquipmentLoads] = useState([]); // Add this line
    const [heavyEquipmentLoads, setHeavyEquipmentLoads] = useState([]); // Add this line
    const [data, setData] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const sidebarRef = useRef(null);
    const minSwipeDistance = 50;
    const [editingLoad, setEditingLoad] = useState(null); // Holds the load currently being edited
    const [isEditFormVisible, setIsEditFormVisible] = useState(false); // Controls the visibility of the edit form
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleEdit = (load) => {
        setSelectedLoad(load);
        setFormData(load); // Set the formData state to the current load
        setShowEditForm(true); // Open the edit form
    };
    const handleCancel = () => {
        setShowEditForm(false); // Close the edit form
    };
    const handleDetails = (load) => {
        setSelectedLoad(load);
        setFormData(load); // Set the formData state to the current load
        setShowDetails(!showDetails);
    };
    const handleDelete = (load) => {
        if (window.confirm('Are you sure you want to delete this load?')) {
            axios.delete(`https://jarvis-ai-logistic-db-server.onrender.com/delete-commercial-truck-load/${load._id}`)
                .then(response => {
                    if (response.status === 200) {
                        // Remove the deleted load from the state
                        setCommercialTruckLoads(commercialTruckLoads.filter(l => l._id !== load._id));
                    } else {
                        console.error('Error deleting load:', response);
                    }
                })
                .catch(error => {
                    console.error('Error deleting load:', error);
                });
        }
    };
    const toggleOpen = () => setIsOpen(!isOpen);
    useEffect(() => {
        const target = sidebarRef.current;

        const handleTouchStart = (e) => {
            setTouchEnd(null); // Reset touch end to calculate new distance
            setTouchStart(e.targetTouches[0].clientX);
        };

        const handleTouchMove = (e) => {
            setTouchEnd(e.targetTouches[0].clientX);
        };

        // Add event listeners
        target.addEventListener('touchstart', handleTouchStart);
        target.addEventListener('touchmove', handleTouchMove);

        // Cleanup
        return () => {
            target.removeEventListener('touchstart', handleTouchStart);
            target.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    useEffect(() => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            setIsSidebarOpen(false);
        } else if (isRightSwipe) {
            setIsSidebarOpen(true);
        }
    }, [touchStart, touchEnd]);
    useEffect(() => {
        axios.get('https://jarvis-ai-logistic-db-server.onrender.com/all-user-loads')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, []);
    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Send a PUT request to the server to update the load
        axios.put(`https://jarvis-ai-logistic-db-server.onrender.com/update-commercial-truck-load/${selectedLoad._id}`, formData)
            .then(response => {
                if (response.data && response.status === 200) {
                    // Update the load in the state
                    setCommercialTruckLoads(commercialTruckLoads.map(load => load._id === selectedLoad._id ? response.data : load));
                    setShowDetails(false); // Close the details div
                } else {
                    console.error('Error updating load:', response);
                }
            })
            .catch(error => {
                console.error('Error updating load:', error);
            });
    };
    useEffect(() => {
        axios.get('https://jarvis-ai-logistic-db-server.onrender.com/get-heavy-equipment-loads')
            .then(response => {
                if (response.data && response.status === 200) {
                    setHeavyEquipmentLoads(response.data.loads); // Set the loads in state
                } else {
                    console.error('Error fetching Heavy Equipment loads:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching Heavy Equipment loads:', error);
            });
    }, []); // Empty dependency array means this effect runs once on component mount
    useEffect(() => {
        axios.get('https://jarvis-ai-logistic-db-server.onrender.com/get-construction-equipment-loads')
            .then(response => {
                if (response.data && response.status === 200) {
                    setConstructionEquipmentLoads(response.data.loads); // Set the loads in state
                } else {
                    console.error('Error fetching Construction Equipment loads:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching Construction Equipment loads:', error);
            });
    }, []); // Empty dependency array means this effect runs once on component mount
    useEffect(() => {
        axios.get('https://jarvis-ai-logistic-db-server.onrender.com/get-boat-loads')
            .then(response => {
                if (response.data && response.status === 200) {
                    setBoatLoads(response.data.loads); // Set the loads in state
                } else {
                    console.error('Error fetching Boat Loads:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching Boat Loads:', error);
            });
    }, []); // Empty dependency array means this effect runs once on component mount
    useEffect(() => {
        axios.get('https://jarvis-ai-logistic-db-server.onrender.com/get-commercial-truck-loads')
            .then(response => {
                if (response.data && response.status === 200) {
                    setCommercialTruckLoads(response.data.loads); // Set the loads in state
                } else {
                    console.error('Error fetching Commercial Truck loads:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching Commercial Truck loads:', error);
            });
    }, []);
    useEffect(() => {
        axios.get(`https://jarvis-ai-logistic-db-server.onrender.com/submit-vehicle-load/${personalEndpoint}`)
            .then(response => {
                if (response.data && response.status === 200) {
                    setVehicleLoads(response.data);
                } else {
                    console.error('No vehicle loads found');
                }
            })
            .catch(error => {
                console.error('Error fetching vehicle loads:', error);
            });
    }, [personalEndpoint]); // Ensure this runs when personalEndpoint changes

    useEffect(() => {
        axios.get('https://jarvis-ai-logistic-db-server.onrender.com/get-moto-equipment-loads')
            .then(response => {
                if (response.data && response.status === 200) {
                    setMotoEquipmentLoads(response.data.loads); // Set the loads in state
                } else {
                    console.error('Error fetching Moto Equipment loads:', response);
                }
            })
            .catch(error => {
                console.error('Error fetching Moto Equipment loads:', error);
            });
    }, []);


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = () => {
        console.log(searchQuery);
    };
    const handleLogout = () => {
        setUser(null); // Clear the user data from the state
        navigate('/sign-in'); // Navigate to the login form
    };
    return (
        <div className="admin-dashboard-wrapper">
            <div className={`admin-side-bar ${isSidebarOpen ? "" : "closed"}`} ref={sidebarRef}>
                <p className="dashboard-title"><FontAwesomeIcon className="navigation-icon" icon={faUser}/>User's
                    dashboard</p>
                <div className="admin-side-bar-navigation">
                    <Link to="/admin-dashboard" className="navigation-button-2"><FontAwesomeIcon
                        className="navigation-icon" icon={faTruck}/>My Loads</Link>
                    <Link to={`/jarvis-chat/${personalEndpoint}/${chatEndpoint}`} className="navigation-button">
                        <FontAwesomeIcon className="navigation-icon" icon={faRobot}/>Jarvis Chat Page
                    </Link>
                </div>
                <div className="admin-side-bar-navigation">
                    <Link to="/admin-dashboard" className="navigation-button-settings"><FontAwesomeIcon
                        className="navigation-icon" icon={faCog}/>Settings</Link>
                    <Link to="/jarvis-chat" className="navigation-button-logout"><FontAwesomeIcon
                        className="navigation-icon" icon={faSignOutAlt}/>Logout</Link>
                </div>
            </div>
            <button className="toggle-button" onClick={toggleSidebar}>
                <FontAwesomeIcon className="fa-bars-icon-times-icon" icon={isSidebarOpen ? faTimes : faBars}/>
            </button>
            <div className="admin-content">
                <div className="admin-content-wrapper">
                    <div className="admin-inner-content-first">
                        <div className="search-bar">
                            <FontAwesomeIcon icon={faSearch} className="search-icon"/>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search all loads, drivers, etc."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="user-details-wrapper">
                            <UserAvatarComponent className="user-avatar"/>
                            <div className="user-details">
                                <p className="user-name">User</p>
                                <p className="user-status">Customer</p>
                            </div>
                            <BellComponent className="bell-icon"/>
                        </div>
                    </div>
                    <div className="admin-inner-content-second">
                        <div className="inner-content-second-text">
                            <p className="inner-content-second-text-first">Your loads</p>
                            <p className="inner-content-second-text-second">Monitor loads, status, payments etc.</p>
                        </div>
                        <div className="data-operations-wrapper">
                            <div className="little-search-bar">
                                <FontAwesomeIcon icon={faSearch} className="search-icon-little-search-bar"/>
                                <input
                                    type="text"
                                    className="little-search-input"
                                    placeholder="Search loads"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}/>
                            </div>
                            <button className="custom-button-filter"><FontAwesomeIcon className="filter-icon"
                                                                                      icon={faFilter}/> Filter
                            </button>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <div className="table-columns-titles">
                            <p>LOAD TYPE</p>
                            <p>PICKUP</p>
                            <p>DESTINATION</p>
                            <p>LOAD STATUS</p>
                            <p>GOODS</p>
                            <p>PRICE</p>
                            <p>INFO</p>
                        </div>
                        {commercialTruckLoads.map((load, index) => (
                        <div className="table-items-wrapper">
                                <div className={`table-item ${load === selectedLoad ? 'selected' : ''}`} key={index}>
                                    <p>{load.vehicleType}</p>
                                    <p>{load.pickupLocation}</p>
                                    <p>{load.deliveryLocation}</p>
                                    <p className="load-status-pending">Pending</p>
                                    <p>No</p>
                                    <p>555$</p>
                                    <div className="dropdown" onClick={toggleOpen}>
                                        <button className="dropdown-button">&#8942;</button>
                                        {isOpen && (
                                            <div className="dropdown-menu-buttons">
                                                <a href="#/action-1" onClick={() => handleEdit(load)}>Edit Load <FontAwesomeIcon className="icon-a" icon={faEdit}/></a>
                                                <a href="#/action-2" onClick={() => handleDetails(load)}>More Details <FontAwesomeIcon className="icon-a" icon={faEllipsisH}/></a>
                                                <a href="#/action-3" onClick={() => handleDelete(load)}>Delete Load <FontAwesomeIcon className="icon-a" icon={faTrashAlt}/></a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            {showDetails && selectedLoad === load && (
                                <div className="load-details-wrapper">
                                    <div className="load-details">
                                        <label>
                                            <h2>Vehicle Type</h2>
                                            <p>{selectedLoad.vehicleType}</p>
                                        </label>
                                        <label>
                                            <h2>Vehicle Model</h2>
                                            <p>{selectedLoad.vehicleModel}</p>
                                        </label>
                                        <label>
                                            <h2>Vehicle Year</h2>
                                            <p>{selectedLoad.vehicleYear}</p>
                                        </label>
                                        <label>
                                            <h2>Vehicle Color</h2>
                                            <p>{selectedLoad.vehicleColor}</p>
                                        </label>
                                        <label>
                                            <h2>Vehicle License Plate</h2>
                                            <p>{selectedLoad.vehicleLicensePlate}</p>
                                        </label>
                                        <label>
                                            <h2>Vehicle Vin</h2>
                                            <p>{selectedLoad.vehicleVin}</p>
                                        </label>
                                        <label>
                                            <h2>Pickup Location</h2>
                                            <p>{selectedLoad.pickupLocation}</p>
                                        </label>
                                        <label>
                                            <h2>Delivery Location</h2>
                                            <p>{selectedLoad.deliveryLocation}</p>
                                        </label>
                                        <label>
                                            <h2>Is Convertible</h2>
                                            <p>{selectedLoad.isConvertible ? 'Yes' : 'No'}</p>
                                        </label>
                                        <label>
                                            <h2>Is Modified</h2>
                                            <p>{selectedLoad.isModified ? 'Yes' : 'No'}</p>
                                        </label>
                                        <label>
                                            <h2>Is Inoperable</h2>
                                            <p>{selectedLoad.isInoperable ? 'Yes' : 'No'}</p>
                                        </label>
                                        <label>
                                            <h2>Service Level</h2>
                                            <p>{selectedLoad.serviceLevel}</p>
                                        </label>
                                        <label>
                                            <h2>Enclosed Transport</h2>
                                            <p>{selectedLoad.enclosedTransport ? 'Yes' : 'No'}</p>
                                        </label>
                                        <label>
                                            <h2>Terms Agreed</h2>
                                            <p>{selectedLoad.termsAgreed ? 'Yes' : 'No'}</p>
                                        </label>
                                    </div>
                                    <button className="hide-details-button" onClick={() => setShowDetails(false)}>Hide</button>
                                </div>
                            )}
                            {showEditForm && selectedLoad === load && (
                                <div className="load-edit-form-wrapper">
                                    <div className="load-edit-form">
                                        <form onSubmit={handleFormSubmit}>
                                            <label>
                                                Vehicle Type:
                                                <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleFormChange} placeholder={formData.vehicleType} />
                                            </label>
                                            <label>
                                                Vehicle Model:
                                                <input type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleFormChange} placeholder={formData.vehicleModel} />
                                            </label>
                                            <label>
                                                Vehicle Year:
                                                <input type="text" name="vehicleYear" value={formData.vehicleYear} onChange={handleFormChange} placeholder={formData.vehicleYear} />
                                            </label>
                                            <label>
                                                Vehicle Color:
                                                <input type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleFormChange} placeholder={formData.vehicleColor} />
                                            </label>
                                            <label>
                                                Vehicle License Plate:
                                                <input type="text" name="vehicleLicensePlate" value={formData.vehicleLicensePlate} onChange={handleFormChange} placeholder={formData.vehicleLicensePlate} />
                                            </label>
                                            <label>
                                                Vehicle Vin:
                                                <input type="text" name="vehicleVin" value={formData.vehicleVin} onChange={handleFormChange} placeholder={formData.vehicleVin} />
                                            </label>
                                            <label>
                                                Pickup Location:
                                                <input type="text" name="pickupLocation" value={formData.pickupLocation} onChange={handleFormChange} placeholder={formData.pickupLocation} />
                                            </label>
                                            <label>
                                                Delivery Location:
                                                <input type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleFormChange} placeholder={formData.deliveryLocation} />
                                            </label>
                                        </form>
                                    </div>
                                    <button className="edit-form-submit" type="submit">Submit</button>
                                    <button className="edit-form-cancel" type="button" onClick={handleCancel}>Cancel</button>
                                </div>
                            )}
                        </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;