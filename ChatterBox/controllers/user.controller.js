const router = require('express').Router();
const user = require('./../models/user.js');
const authMidlleware = require("./../middlewares/auth.middleware.js")
const uploadMiddleware = require('../middlewares/upload.middleware.js');
const cloudinary = require('../cloudinary.js');

router.get('/get-logged-user', authMidlleware, async (req, res) => {
  try {
    const User = await user.findOne({ _id: req.user.id });
    res.status(200).send({
      message: "user fetch successfully",
      success: true,
      data: User
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
      success: false
    });
  }
});

router.get('/get-All-users', authMidlleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const All_users = await user.find({ _id: { $ne: user_id } });
    res.status(200).send({
      message: "ALL user fetch successfully",
      success: true,
      data: All_users
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
      success: false
    });
  }
});

// Get user profile
router.get('/profile', authMidlleware, async (req, res) => {
  try {
    const User = await user.findById(req.user.id).select('-password');
    if (!User) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: User
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user details profile
router.put('/profile', authMidlleware, async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;

    // Validate input
    if (!firstname || !lastname || !email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if email already exists for another user
    const existingUser = await user.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.user.id }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Update user
    const updatedUser = await user.findByIdAndUpdate(
      req.user.id,
      {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.toLowerCase().trim(),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Upload profile picture
router.post('/profile-picture', authMidlleware, uploadMiddleware, async (req, res) => {
  try {

    const image = req.file;
    const dataUri = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;

    const profilePicturePath = await cloudinary.uploader.upload(dataUri, {
      folder: 'Chat-Box',
      format: 'webp'
    });
    // Update user profile picture
    const userId = req.user.id; // 👈 Is this ID coming through correctly?

    // const currentUser = await user.findById(userId);

    // console.log("Current user fetched:",currentUser);
    // // If previous image exists in Cloudinary, delete it
    // if (currentUser.profilePic) {
    //   try {
    //     await cloudinary.uploader.destroy(currentUser.profilePic);
    //     console.log("Previous profile picture deleted ✅");
    //   } catch (err) {
    //     console.log("Previous image deletion skipped (maybe already removed).");
    //   }
    // }

    const updatedUser = await user.findByIdAndUpdate(
      {_id:userId}, 
      { profilePic: profilePicturePath.secure_url },
      { new: true } // This ensures 'updatedUser' contains the new data
    );
    if (!updatedUser) {
      // If this log fires, the user ID was either wrong or the user doesn't exist.
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  

    return res.status(201).send({
      success: true,
      message: 'Profile picture updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Upload profile picture error: e4', error);

  }
  res.status(500).json({
    success: false,
    message: 'Server error 4'
  });

});

// // Backup user chats
// router.post('/chats/backup', authMidlleware, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Here you would typically:
//     // 1. Get all user chats and messages
//     // 2. Create a backup file
//     // 3. Store it in cloud storage or database
//     // 4. Update backup history

//     const backupData = {
//       userId: userId,
//       backupDate: new Date(),
//       chats: [], // This would contain actual chat data
//       messages: [] // This would contain actual message data
//     };

//     // Save backup record to user
//     await user.findByIdAndUpdate(userId, {
//       $push: {
//         backupHistory: {
//           date: new Date(),
//           backupId: 'backup-' + Date.now(),
//           chatCount: 0, // Actual count
//           messageCount: 0 // Actual count
//         }
//       },
//       lastBackup: new Date()
//     });
//     res.json({
//       success: true,
//       message: 'Chat backup completed successfully',
//       data: {
//         backupId: backupData.backupDate.getTime(),
//         backupDate: backupData.backupDate,
//         chatCount: backupData.chats.length,
//         messageCount: backupData.messages.length
//       }
//     });
//   } catch (error) {
//     console.error('Backup chats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to backup chats'
//     });
//   }
// });
// // Restore user chats
// router.post('/chats/restore', authMidlleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { backupId } = req.body;

//     // Here you would typically:
//     // 1. Retrieve backup data
//     // 2. Restore chats and messages
//     // 3. Update user's chat data

//     res.json({
//       success: true,
//       message: 'Chats restored successfully',
//       data: {
//         restoredChats: 0, // Actual count
//         restoredMessages: 0 // Actual count
//       }
//     });
//   } catch (error) {
//     console.error('Restore chats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to restore chats'
//     });
//   }
// });

// // Get backup history
// router.get('/chats/backup-history', authMidlleware, async (req, res) => {
//   try {
//     const User = await user.findById(req.user.id).select('backupHistory lastBackup');

//     res.json({
//       success: true,
//       data: {
//         backupHistory: User.backupHistory || [],
//         lastBackup: User.lastBackup
//       }
//     });
//   } catch (error) {
//     console.error('Get backup history error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get backup history'
//     });
//   }
// });

module.exports = router;