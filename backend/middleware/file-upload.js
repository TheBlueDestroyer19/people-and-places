const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/png': '.png'
};

const fileUpload = multer({
  limits: { fileSize: 500000 }, // specify inside an object
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid file type.');
    cb(error, isValid);
  }
});

module.exports = fileUpload;
