import { axiosInstance,BASE_URL } from "./index.js"; 


// Get user profile
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/api/user/profile`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get profile' };
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(`${BASE_URL}/api/user/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axiosInstance.post(`${BASE_URL}/api/user/profile-picture`, formData, {
      headers:{
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw { message: 'Failed to upload profile picture e1' };
  }
};


export const getLoggedUser=async()=>{
    try{
        const response=await axiosInstance.get(`${BASE_URL}/api/user/get-logged-user`);
        return response.data;
    }catch(err){
        return err;
    }
}
export const getAllUser=async()=>{
    try{
        const response=await axiosInstance.get(`${BASE_URL}/api/user/get-All-users`);
        return response.data;
    }catch(err){
        return err;
    }
}

// // Backup chats
// export const backupChats = async () => {
//   try {
//     const response = await axiosInstance.post('api/user/chats/backup');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to backup chats' };
//   }
// };

// // Restore chats
// export const restoreChats = async (backupId) => {
//   try {
//     const response = await axiosInstance.post('api/user/chats/restore', { backupId });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to restore chats' };
//   }
// };

// // Get backup history
// export const getBackupHistory = async () => {
//   try {
//     const response = await axiosInstance.get('api/user/chats/backup-history');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Failed to get backup history' };
//   }
// };

// export default {
//   getProfile,
//   updateProfile,
//   uploadProfilePicture,
//   backupChats,
//   restoreChats,
//   getBackupHistory
// };