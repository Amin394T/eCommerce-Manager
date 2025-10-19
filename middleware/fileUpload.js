import multer from "multer";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "media/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/ /g, "-");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});

export default multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }).single("image");
