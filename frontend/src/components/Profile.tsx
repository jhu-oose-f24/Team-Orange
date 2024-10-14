import React from 'react';
import Feed from './Feed'; // Import the Feed component

const Profile: React.FC = () => {

    // Hardcoded values for right now, will eventually be replaced with dynamic data. Props can be used to pass data to the component.
    const name = "Beej Doe"; 
    const bio = "Software developer with a passion for creating amazing applications.";
    const avatarUrl = "https://i.pravatar.cc/150?img=3"; // A placeholder avatar URL

    return (
        <div>
            <div className="profile-card">
                <img src={avatarUrl} alt={`${name}'s avatar`} className="profile-avatar" />
                <h2 className="profile-name">{name}</h2>
                <p className="profile-bio">{bio}</p>
            </div>
            <Feed statusFilter='OPEN'/> {/* Will eventually be a feed of your created tickets and picked up tickets */}
        </div>
    );
};

export default Profile;
