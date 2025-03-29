import multer from "multer";
import crypto from "crypto";
import path from "path";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            const filename = name.toString("hex") + path.extname(file.originalname);
            cb(null, filename)
        })
    }
});

export const upload = multer({ storage: storage });

