import multer from 'multer'
import os from 'os' // <-- Add this import

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        // Use the OS temporary directory instead of a local 'public' folder
        cb(null, os.tmpdir()) 
    },
    filename: function (req,file,cb){
        const filename = Date.now() + "-" + file.originalname
        cb(null, filename)
    }
})

export const upload = multer({
    storage,
    limits : {fileSize: 5 * 1024 * 1024}, // 5MB
})