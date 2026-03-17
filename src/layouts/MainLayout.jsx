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

function MainLayout({ activeUserID, setActiveUser}) {
    const activeUser = getUserById(activeUserID);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openProfileEdit = () => setIsProfileOpen(true);
    const closeProfileEdit = () => setIsProfileOpen(false);

    return (
        <>
            <Navbar activeUser={activeUser} setActiveUser={setActiveUser}/>
            <div className="layout-container flex">
                <Sidebar openModal={openModal} />

                {/* Main Content Panel */}
                <div className="content">
                    <Outlet context={{ activeUser, openModal, openProfileEdit }}/>
                </div>
            </div>

            {/* Global Modal/s */}
            <ReviewModal isOpen={isModalOpen} onClose={closeModal} activeUserID={activeUserID}/>
            <EditProfileModal isOpen={isProfileOpen} onClose={closeProfileEdit} user={activeUser} />
        </>
    )
}

export default MainLayout