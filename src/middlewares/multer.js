import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'others';

    if (file.fieldname === 'documents') {
      folder = 'documents';
    } else if (file.fieldname === 'pets') {
      folder = 'pets';
    }

    const uploadPath = path.resolve(`./uploads/${folder}`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

export const uploader = multer({ storage });
