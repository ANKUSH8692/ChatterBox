import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

import '../../index.css';

import { setUser } from '../../redux/userSlice';
import { showLoader, hideLoader } from '../../redux/loaderSlice';
import { getProfile, updateProfile, uploadProfilePicture} from '../../ApiCall/user';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const { user } = useSelector(state => state.userReducer);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const navigator =useNavigate();
    
    const [profileData, setProfileData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        profilepic: ''
    });
    
    const [isEditing, setIsEditing] = useState(false);
    // const [backupHistory, setBackupHistory] = useState([]);
    // const [lastBackup, setLastBackup] = useState(null);

    // Load profile data
    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            dispatch(showLoader());
            const response = await getProfile();
            if (response.success) {
                const userData = response.data;
                setProfileData({
                    firstname: userData.firstname || '',
                    lastname: userData.lastname || '',
                    email: userData.email || '',
                    profilepic: userData.profilePic || ''
                });
            }
        } catch (error) {
            toast.error(error.message || 'Failed to load profile');
        } finally {
            dispatch(hideLoader());
        }
    };

    // const loadBackupHistory = async () => {
    //     try {
    //         const response = await getBackupHistory();
    //         if (response.success) {
    //             setBackupHistory(response.data.backupHistory || []);
    //             setLastBackup(response.data.lastBackup);
    //         }
    //     } catch (error) {
    //         console.error('Failed to load backup history:', error);
    //     }
    // };

    // Get user initials for logo
    const getUserInitials = () => {
        const first = profileData.firstname?.charAt(0)?.toUpperCase();
        const last = profileData.lastname?.charAt(0)?.toUpperCase();
        return first + last;
    };

    // Format account creation date
    const getAccountCreatedDate = () => {
        if (!user?.createdAt) return 'N/A';
        return new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // // Format last backup date
    // const getLastBackupDate = () => {
    //     if (!lastBackup) return 'Never';
    //     return new Date(lastBackup).toLocaleDateString('en-US', {
    //         year: 'numeric',
    //         month: 'short',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit'
    //     });
    // };

    // Handle profile picture change
    const handleProfilePicChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            try {
                dispatch(showLoader());
                const response = await uploadProfilePicture(file);
                const url=response.data.profilePic;
                if (response.success) {
                    setProfileData(prev => ({
                        ...prev,
                        profilepic: url
                    }));
                    // Update user in Redux store
                    dispatch(setUser(...user,{profilePic:url}));
                    toast.success('Profile picture updated successfully!');
                }
            } catch (error) {
                toast.error('Failed to upload profile picture e2');
            } finally {
                dispatch(hideLoader());
            }
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save profile changes
    const handleSaveProfile = async () => {
        try {
            dispatch(showLoader());
            const response = await updateProfile(profileData);
            if (response.success) {
                // Update user in Redux store
                dispatch(setUser(response.data));
                toast.success('Profile updated successfully!');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update profile');
        } finally {
            dispatch(hideLoader());
        }
    };

    // // Backup chats
    // const handleBackupChats = async () => {
    //     try {
    //         dispatch(showLoader());
    //         const response = await backupChats();
    //         if (response.success) {
    //             setLastBackup(new Date());
    //             setBackupHistory(prev => [{
    //                 date: new Date(),
    //                 backupId: response.data.backupId,
    //                 chatCount: response.data.chatCount,
    //                 messageCount: response.data.messageCount
    //             }, ...prev]);
    //             toast.success('Chat backup completed successfully!');
    //         }
    //     } catch (error) {
    //         toast.error(error.message || 'Failed to backup chats');
    //     } finally {
    //         dispatch(hideLoader());
    //     }
    // };

    // // Restore chats
    // const handleRestoreChats = async () => {
    //     try {
    //         if (backupHistory.length === 0) {
    //             toast.error('No backup found to restore');
    //             return;
    //         }

    //         const latestBackup = backupHistory[0];
            
    //         if (!window.confirm(`Are you sure you want to restore from backup dated ${new Date(latestBackup.date).toLocaleDateString()}? This will replace your current chats.`)) {
    //             return;
    //         }

    //         dispatch(showLoader());
    //         const response = await restoreChats(latestBackup.backupId);
    //         if (response.success) {
    //             toast.success('Chats restored successfully!');
    //             // You might want to refresh the chat data here
    //         }
    //     } catch (error) {
    //         toast.error(error.message || 'Failed to restore chats');
    //     } finally {
    //         dispatch(hideLoader());
    //     }
    // };

    return (
        <div className="profile-container">
            <div className="profile-header">
                
                 <div className='button-pre' onClick={()=>{
                    navigator('/');
                }}>
                    <img className="previous"src="next.png"/>
                </div>
                <div>
                    <h1>User Profile</h1>
                    <p>Manage your account settings and preferences</p>
                </div>
                
            </div>

            <div className="profile-content">
                {/* Profile Picture Section */}
                <div className="profile-picture-section">
                    <div className="profile-picture-container">
                        {profileData.profilepic ? (
                            <img 
                                src={profileData.profilepic} 
                                alt="Profile" 
                                className="profile-picture"
                            />
                        ) : (
                            <div className="profile-picture-default">
                                {getUserInitials()}
                            </div>
                        )}
                        
                        <div className="profile-picture-overlay">
                            <button 
                                className="change-photo-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <i className="fas fa-camera"></i>
                                Change Photo
                            </button>
                        </div>
                        
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfilePicChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </div>
                    
                    <div className="profile-picture-info">
                        <h3>Profile Picture</h3>
                        <p>JPG, GIF or PNG. Max size 5MB.</p>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="profile-info-section">
                    <div className="section-header">
                        <h2>Personal Information</h2>
                        <button 
                            className="edit-toggle-btn"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? (
                                <>
                                    <i className="fas fa-times"></i>
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-edit"></i>
                                    Edit Profile
                                </>
                            )}
                        </button>
                    </div>

                    <div className="info-grid">
                        <div className="info-field">
                            <label>First Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="firstname"
                                    value={profileData.firstname}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                />
                            ) : (
                                <div className="info-value">{profileData.firstname}</div>
                            )}
                        </div>

                        <div className="info-field">
                            <label>Last Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="lastname"
                                    value={profileData.lastname}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                />
                            ) : (
                                <div className="info-value">{profileData.lastname}</div>
                            )}
                        </div>

                        <div className="info-field full-width">
                            <label>Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleInputChange}
                                    className="edit-input"
                                />
                            ) : (
                                <div className="info-value">{profileData.email}</div>
                            )}
                        </div>

                        <div className="info-field">
                            <label>Account Created</label>
                            <div className="info-value">{getAccountCreatedDate()}</div>
                        </div>

                        <div className="info-field">
                            <label>User ID</label>
                            <div className="info-value user-id">{user?._id || 'N/A'}</div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="save-actions">
                            <button 
                                className="save-btn"
                                onClick={handleSaveProfile}
                            >
                                <i className="fas fa-save"></i>
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Chat Backup Section */}
                <div className="backup-section">
                    <div className="section-header">
                        <h2>Chat Management</h2>
                        <p>Backup and restore your conversations</p>
                    </div>

                    <div className="backup-actions">
                        <button 
                            className="backup-btn"
                            // onClick={handleBackupChats}
                        >
                            <i className="fas fa-cloud-download-alt"></i>
                            Backup All Chats
                        </button>
                        
                        <button 
                            className="restore-btn"
                            // onClick={handleRestoreChats}
                            // disabled={backupHistory.length === 0}
                        >
                            <i className="fas fa-cloud-upload-alt"></i>
                            Restore Chats
                        </button>
                    </div>

                    <div className="backup-info">
                        <div className="info-item">
                            <i className="fas fa-database"></i>
                            {/* <span>Last backup: {getLastBackupDate()}</span> */}
                        </div>
                        <div className="info-item">
                            <i className="fas fa-history"></i>
                            {/* <span>Total backups: {backupHistory.length}</span> */}
                        </div>
                        <div className="info-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>Your data is encrypted and secure</span>
                        </div>
                    </div>

                    {/* Backup History
                    {backupHistory.length > 0 && (
                        <div className="backup-history">
                            <h4>Backup History</h4>
                            <div className="history-list">
                                {backupHistory.slice(0, 5).map((backup, index) => (
                                    <div key={index} className="history-item">
                                        <div className="history-date">
                                            {new Date(backup.date).toLocaleDateString()}
                                        </div>
                                        <div className="history-stats">
                                            {backup.chatCount} chats, {backup.messageCount} messages
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
};

export default Profile;