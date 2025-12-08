const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "public/images";
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

const videoDir = "public/videos";
if(!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, {recursive:true})
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.mimetype.startsWith("video/")){
            cb(null, videoDir);
        }
        else{
            cb(null, uploadDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const allowedVideo = /mp4|mov|avi|mkv/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if(allowedTypes.test(ext) && allowedTypes.test(mime)) {
        cb(null, true);
    }
    else if(allowedVideo.test(ext) && mime.startsWith("video/")) {
        cb(null, true);
    }
    else{
        cb(new Error("Only .jpeg, .jpg, .png images OR .mp4, .mov, .avi, .mkv videos are allowed"), false);
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 20 * 1024 * 1024,
    },
});

module.exports = upload;