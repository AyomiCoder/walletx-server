import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary'; // Ensure this points to your cloudinary config file

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'profile_pictures', // Folder name in Cloudinary
      format: 'png', // Set a default format (or use 'jpg', 'jpeg')
      // Transformation options (optional, can be adjusted as needed)
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});

export const upload = multer({ storage });
