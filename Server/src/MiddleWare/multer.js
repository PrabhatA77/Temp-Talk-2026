import multer from "multer";

const storage = multer.memoryStorage();

const allowedNonImageTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain", // .txt
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //10 MB max image size
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isAllowedDoc = allowedNonImageTypes.includes(file.mimetype);

    if (isImage || isAllowedDoc) {
      return cb(null, true);
    }
    cb(new Error("Unsupported file type"), false);
  },
});

export default upload;
