import __dirname from "./index.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Chequeo si el body tiene el campo "specie" para saber si es una mascota
    if (req.body.specie) {
      cb(null, `${__dirname}/../public/img/pets`); // Upload to pets folder
    } else {
      cb(null, `${__dirname}/../public/img/documents`); // Upload to documents folder
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploader = multer({ storage });

export default uploader;
