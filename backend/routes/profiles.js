const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, username, displayName, bio, profilePicture, socials } = req.body;
    
    if (!userId || !username) {
      return res.status(400).json({ message: 'userId and username are required' });
    }

    let profile = await Profile.findOne({ userId });
    
    if (profile) {
      profile.username = username;
      profile.displayName = displayName || profile.displayName;
      profile.bio = bio || profile.bio;
      profile.profilePicture = profilePicture || profile.profilePicture;
      profile.socials = socials || profile.socials;
    } else {
      profile = new Profile({
        userId,
        username,
        displayName,
        bio,
        profilePicture,
        socials
      });
    }

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;