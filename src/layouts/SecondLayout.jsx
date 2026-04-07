import { use, useState } from "react";
import { Outlet } from "react-router-dom";

/**** Pages and Styling ****/
import './MainLayout.css'
import Navbar from './Navbar';
import EditProfileModal from "../modals/EditProfileModal";
import LoadingBlock from "../components/LoadingBlock";
import AlertBlock from "../components/AlertBlock";

function SecondLayout({ activeUser, setActiveUser}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAlertOn, setIsAlertOn] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        message: '',
        icon: 'bi-check-circle-fill'
    });

    const openProfileEdit = () => setIsProfileOpen(true);
    const closeProfileEdit = () => setIsProfileOpen(false);

    const showAlert = (config) => {
        setAlertConfig(prev => ({
            ...prev,    
            ...config
        }));
        setIsAlertOn(true);
        setTimeout(() => setIsAlertOn(false), 2000); // Reset after 2 seconds
    };

    console.log(activeUser);
    
    return (
        <>
            <Navbar activeUser={activeUser} setActiveUser={setActiveUser}/>
            <div className="layout-container flex">

                {/* Main Content Panel */}
                <div className="content">
                    {isAlertOn && (
                        <AlertBlock
                            message={alertConfig.message}
                            icon={alertConfig.icon}
                            bgColor={alertConfig.bgColor}
                            textColor={alertConfig.textColor}
                            styling={{
                                width: '96%'
                            }}
                        />
                    )}
                    <Outlet context={{ activeUser, openProfileEdit, showAlert, setAlertConfig}}/>
                </div>
            </div>

            {/* Global Modal/s */}
            <EditProfileModal isOpen={isProfileOpen} onClose={closeProfileEdit} user={activeUser} />
        </>
    )
}

export default SecondLayout