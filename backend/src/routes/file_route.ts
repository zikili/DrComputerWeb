import express from "express";
const router = express.Router();
import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')
            .filter(Boolean)
            .slice(1)
            .join('.')
        cb(null, Date.now() + "." + ext)
    }
})
const upload = multer({ storage: storage });

router.post('/', upload.single("file"), function (req, res) {
    const base = process.env.LOCATION+process.env.PORT+"/";
    res.status(200).send({ url: base + req.file.path })
});
export = router;