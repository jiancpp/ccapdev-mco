import { use, useState } from "react";
import { Outlet } from "react-router-dom";

/**** Pages and Styling ****/
import './MainLayout.css'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReviewModal from '../pages/ReviewModal';
import { dummyUsers } from "../data/dummyUsers";

/***** Utilities ******/
const getUserById = (id) => dummyUsers.find((user) => user._id === id );

function MainLayout({ activeUserID, setActiveUser}) {
    const activeUser = getUserById(activeUserID);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <Navbar activeUser={activeUser}/>
            <div className="layout-container flex">
                <Sidebar openModal={openModal}/>

                {/* Main Content Panel */}
                <div className="content">
                    <Outlet context={{ openModal, activeUser }}/>
                </div>
            </div>

            {/* Global Modal/s */}
            <ReviewModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    )
}

export default MainLayout