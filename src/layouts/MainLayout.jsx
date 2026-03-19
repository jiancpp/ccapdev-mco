import { use, useState } from "react";
import { Outlet } from "react-router-dom";

/**** Pages and Styling ****/
import './MainLayout.css'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReviewModal from '../modals/ReviewModal';
import { dummyUsers } from "../data/dummyUsers";
import EditProfileModal from "../modals/EditProfileModal";

/***** Utilities ******/
const getUserById = (id) => dummyUsers.find((user) => user._id === id );

function MainLayout({ activeUser, setActiveUser}) {
    // const activeUser = getUserById(activeUserID);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [preSelected, setPreSelected] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);

    const openModal = (params = null) => {
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
                    <Outlet context={{ activeUser, openModal, openProfileEdit, preSelectReviewParams }}/>
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