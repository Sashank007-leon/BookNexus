import multer from 'multer';
import path from 'path';
import fs from 'fs'; // ✅ Required for deleting files

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    cb(null, true);
  } else {
    cb(new Error('Only images (.jpg, .jpeg, .png) are allowed'));
  }
};

// ✅ Correct usage: only pass storage and fileFilter here
const upload = multer({ storage, fileFilter });

// ✅ Export deleteImageFile separately
const deleteImageFile = (imagePath) => {
  const filePath = path.join(path.resolve(), imagePath);
  fs.unlink(filePath, (err) => {
    if (err) console.error('Failed to delete image:', err.message);
  });
};

export { upload, deleteImageFile };
