import { use, useState } from "react";
import { Outlet } from "react-router-dom";

/**** Pages and Styling ****/
import './MainLayout.css'
import Navbar from './Navbar';
import ReplyModal from '../pages/ReplyModal';
import { dummyUsers } from "../data/dummyUsers";
import EditProfileModal from "../pages/EditProfileModal";

/***** Utilities ******/
const getUserById = (id) => dummyUsers.find((user) => user._id === id );

function SecondLayout({ activeUserID, setActiveUser}) {
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

                {/* Main Content Panel */}
                <div className="content">
                    <Outlet context={{ activeUser, openModal, openProfileEdit }}/>
                </div>
            </div>

            {/* Global Modal/s */}
            <ReplyModal isOpen={isModalOpen} onClose={closeModal} />
            <EditProfileModal isOpen={isProfileOpen} onClose={closeProfileEdit} user={activeUser} />
        </>
    )
}

export default SecondLayout