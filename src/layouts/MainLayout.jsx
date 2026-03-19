import { use, useState } from "react";
import { Outlet } from "react-router-dom";

/**** Pages and Styling ****/
import './MainLayout.css'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReviewModal from '../modals/ReviewModal';
import AlertBlock from "../components/AlertBlock";
import { dummyUsers } from "../data/dummyUsers";
import EditProfileModal from "../modals/EditProfileModal";
import { useNavigate } from "react-router-dom";

/***** Utilities ******/
const getUserById = (id) => dummyUsers.find((user) => user._id === id );

function MainLayout({ activeUser, setActiveUser}) {
    // const activeUser = getUserById(activeUserID);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAlertOn, setIsAlertOn] = useState(false);
    const [preSelected, setPreSelected] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [alertConfig, setAlertConfig] = useState({
        message: '',
        icon: 'bi-check-circle-fill'
    });

    const openModal = (params = null) => {
        if (!activeUser) {
        navigate('/login');
        return;
    }
        if (params) {
            setPreSelected(params); // Update state for record keeping - resolve state lag rendering bug
            setSelectedRating(params.selectedRating);
            setIsModalOpen(true);
        } 
        else {
            setPreSelected(null);
            setIsModalOpen(true);
        }
    } 
    const closeModal = () => setIsModalOpen(false);
    const openProfileEdit = () => setIsProfileOpen(true);
    const closeProfileEdit = () => setIsProfileOpen(false);

    const showAlert = (config) => {
        setAlertConfig(config);
        setIsAlertOn(true);
        setTimeout(() => setIsAlertOn(false), 2000); // Reset after 2 seconds
    };

    /**
     * Automatically fills up the 
     * @param {String} targetID 
     * @param {String} targetType 
     * @param {Number} rating 
     * @returns 
     */
    const preSelectReviewParams = (params) => {
        if (!params.targetID || !params.targetType) return;
        openModal(params);
    }

    return (
        <>
            <Navbar activeUser={activeUser} setActiveUser={setActiveUser}/>
            <div className="layout-container flex">
                <Sidebar openModal={openModal} />

                {/* Main Content Panel */}
                <div className="content">
                {isAlertOn && (
                    <AlertBlock
                        message={alertConfig.message}
                        icon={alertConfig.icon || 'bi-check-circle-fill'}
                        bgColor={'var(--success-light)'}
                        textColor={'var(--success-dark)'}
                    />
                )}
                    <Outlet context={{ activeUser, openModal, openProfileEdit, preSelectReviewParams, showAlert}}/>
                </div>
            </div>

            {/* Global Modal/s */}
            <ReviewModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                activeUserID={activeUser?._id} 
                preSelected={preSelected}
                currentRating={selectedRating}/>
            <EditProfileModal isOpen={isProfileOpen} onClose={closeProfileEdit} user={activeUser} />
        </>
    )
}

export default MainLayout