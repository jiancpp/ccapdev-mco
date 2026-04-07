import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllData, getReview, getTimeAgo } from "../../api/api"; 

import BackButton from "../../components/BackButton"
import LoadingBlock from "../../components/LoadingBlock";
import NothingBlock from "../../components/NothingBlock";
import "./Notification.css"


function NotificationPage({ activeUser }) {
    const { id } = useParams();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const data = await getAllData(`users/fetch-notifs/${id}`);
                setNotifications(data);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifs();
    }, [id]);

    if (loading) return <LoadingBlock />;
    
    return (
        <div className="notif-page">
            <BackButton />
            <h1>Notifications</h1>
            {!notifications.length ? 
                <NothingBlock message={'No new notifications.'}/> : 
                <ul>
                {
                    notifications.map((notif) => (
                        // Use a 'key' so React doesn't complain
                        <li key={notif._id} onClick={() => navigate(`/review/${notif.relatedEntityId}`)}> 
                            <div className="profile avatar-picture"
                                style={{
                                    backgroundImage: notif.senderId ? `url(${notif.senderId?.avatar})` :  `url(../../../public/assets/default.jpg);`,
                                }}>
                            </div>
                            <span className="notif-content">
                                <strong>{notif.senderId?.username || "Someone"}</strong> 
                                {" "}{notif.type.toLowerCase()}d your review
                            </span>
                            <span className="date">{getTimeAgo(notif.createdAt)}</span>
                        </li>
                    ))
                }
                </ul>
            }
        </div>
    );
}

export default NotificationPage;