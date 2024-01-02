import React, {useEffect, useState, useRef} from "react";
import './AdminDashboard.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {faBars, faTimes, faSignOutAlt, faCog, faTruck, faRobot, faUser} from "@fortawesome/free-solid-svg-icons";
import {ReactComponent as UserAvatarComponent} from "../../assets/userAvatar2.svg";
import {ReactComponent as BellComponent} from "../../assets/bell.svg";
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
    }, []); // Empty dependency array means this effect runs once on component mount


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

                    <div className={`load-container ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
                        <div className="load-container-header">
                            <h2>Commercial Truck Load</h2>
                        </div>
                        {commercialTruckLoads.map(load => (
                            <div className="load-container-body-wrapper" key={load._id}>
                                <div className="load-container-body-closed">
                                    <div className="load-container-body-info-labels">
                                        <p className="label-title">Vehicle Type:</p>
                                        <p className="label-variable">{load.vehicleType}</p>
                                    </div>
                                    <div className="load-container-body-info-labels">
                                        <p className="label-title">Vehicle Model:</p>
                                        <p className="label-variable">{load.vehicleModel}</p>
                                    </div>
                                    <div className="load-container-body-info-labels">
                                        <p className="label-title">Vehicle Year:</p>
                                        <p className="label-variable">{load.vehicleYear}</p>
                                    </div>
                                    <div className="load-container-body-info-labels">
                                        <p className="label-title">Vehicle Color:</p>
                                        <p className="label-variable">{load.vehicleColor}</p>
                                    </div>
                                    <div className="load-container-body-info-labels">
                                        <p className="label-title">Vehicle License Plate:</p>
                                        <p className="label-variable">{load.vehicleLicensePlate}</p>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="load-container-body-opened">
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Vehicle VIN:</p>
                                            <p className="label-variable">{load.vehicleVin}</p>
                                        </div>
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Pickup Location:</p>
                                            <p className="label-variable">{load.pickupLocation}</p>
                                        </div>
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Delivery Location:</p>
                                            <p className="label-variable">{load.deliveryLocation}</p>
                                        </div>
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Is Convertible:</p>
                                            <p className="label-variable">{load.isConvertible ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Is Modified:</p>
                                            <p className="label-variable">{load.isModified ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Is Inoperable:</p>
                                            <p className="label-variable">{load.isInoperable ? 'Yes' : 'No'}</p>
                                        </div>
                                        <div className="load-container-body-info-labels">
                                            <p className="label-title">Service Level:</p>
                                            <p className="label-variable">{load.serviceLevel}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="user-manage-table">
                        <table className="rounded-table">
                            <thead>
                            <tr>
                                <th>Boat Type</th>
                                <th>Boat Model</th>
                                <th>Boat Year</th>
                                <th>Boat Color</th>
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
                            {boatLoads.map(load => (
                                <tr key={load._id}>
                                    <td>{load.boatType}</td>
                                    <td>{load.boatModel}</td>
                                    <td>{load.boatYear}</td>
                                    <td>{load.boatColor}</td>
                                    <td>{load.boatLicensePlate}</td>
                                    <td>{load.boatVin}</td>
                                    <td>{load.pickupLocation}</td>
                                    <td>{load.deliveryLocation}</td>
                                    <td>{load.isConvertible ? 'Yes' : 'No'}</td>
                                    <td>{load.isModified ? 'Yes' : 'No'}</td>
                                    <td>{load.isInoperable ? 'Yes' : 'No'}</td>
                                    <td>{load.serviceLevel}</td>
                                    <td>{load.enclosedTransport ? 'Yes' : 'No'}</td>
                                    <td>{load.termsAgreed ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="footer-table">
                            <tr>
                                <td colSpan="16">
                                    <div className="pagination-buttons-wrapper">
                                        <button className="pagination-button-previous-next">Previous Page</button>
                                        <button className="pagination-button"><p>1</p></button>
                                        <button className="pagination-button"><p>2</p></button>
                                        <button className="pagination-button"><p>3</p></button>
                                        <button className="pagination-button"><p>4</p></button>
                                        <button className="pagination-button"><p>5</p></button>
                                        <button className="pagination-button-previous-next">Next Page</button>
                                    </div>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="user-manage-table">
                        <table className="rounded-table">
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
                            {constructionEquipmentLoads.map(load => (
                                <tr key={load._id}>
                                    <td>{load.equipmentType}</td>
                                    <td>{load.equipmentModel}</td>
                                    <td>{load.equipmentYear}</td>
                                    <td>{load.equipmentColor}</td>
                                    <td>{load.equipmentLicensePlate}</td>
                                    <td>{load.equipmentVin}</td>
                                    <td>{load.pickupLocation}</td>
                                    <td>{load.deliveryLocation}</td>
                                    <td>{load.isConvertible ? 'Yes' : 'No'}</td>
                                    <td>{load.isModified ? 'Yes' : 'No'}</td>
                                    <td>{load.isInoperable ? 'Yes' : 'No'}</td>
                                    <td>{load.serviceLevel}</td>
                                    <td>{load.enclosedTransport ? 'Yes' : 'No'}</td>
                                    <td>{load.termsAgreed ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="footer-table">
                            <tr>
                                <td colSpan="16">
                                    <div className="pagination-buttons-wrapper">
                                        <button className="pagination-button-previous-next">Previous Page</button>
                                        <button className="pagination-button"><p>1</p></button>
                                        <button className="pagination-button"><p>2</p></button>
                                        <button className="pagination-button"><p>3</p></button>
                                        <button className="pagination-button"><p>4</p></button>
                                        <button className="pagination-button"><p>5</p></button>
                                        <button className="pagination-button-previous-next">Next Page</button>
                                    </div>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="user-manage-table">
                        <table className="rounded-table">
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
                                <th>Delivery Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {heavyEquipmentLoads.map(load => (
                                <tr key={load._id}>
                                    <td>{load.makeAndModel}</td>
                                    <td>{load.serialNumber}</td>
                                    <td>{load.weight}</td>
                                    <td>{load.operatorName}</td>
                                    <td>{load.pickupLocation}</td>
                                    <td>{load.deliveryLocation}</td>
                                    <td>{load.serviceLevel}</td>
                                    <td>{load.termsAgreed ? 'Yes' : 'No'}</td>
                                    <td>{new Date(load.deliveryDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="footer-table">
                            <tr>
                                <td colSpan="16">
                                    <div className="pagination-buttons-wrapper">
                                        <button className="pagination-button-previous-next">Previous Page</button>
                                        <button className="pagination-button"><p>1</p></button>
                                        <button className="pagination-button"><p>2</p></button>
                                        <button className="pagination-button"><p>3</p></button>
                                        <button className="pagination-button"><p>4</p></button>
                                        <button className="pagination-button"><p>5</p></button>
                                        <button className="pagination-button-previous-next">Next Page</button>
                                    </div>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;