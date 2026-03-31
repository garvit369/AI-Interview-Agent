import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, 'public')
    },
    filename: function (req,file,cb){
        const filename = Date.now() + "-" + file.originalname
        cb(null, filename)
    }
})

export const upload = multer({
    storage,
    limits : {fileSize: 5 * 1024 * 1024}, // 5MB
//     fileFilter: function (req, file, cb){
//     const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
//     if(allowedTypes.includes(file.mimetype)){
//         cb(null, true)   // accept file
//     } else {
//         cb(new Error("Only JPEG, PNG, and PDF files are allowed"), false) // reject
//     }
// }
})


// The code above is a configuration for the `multer` middleware, which is used in Node.js applications to handle file uploads. Here's a detailed explanation of the code:

// 1. **Importing Multer**: The code starts by importing the `multer` library, which is a middleware for handling `multipart/form-data`, primarily used for uploading files.

// 2. **Storage Configuration**: The `storage` variable is defined using `multer.diskStorage()`, which specifies how and where the uploaded files should be stored on the server.      

//     - `destination`: This function determines the folder where the uploaded files will be stored. In this case, it is set to the 'public' directory. The `cb` function is a callback that takes an error (if any) and the destination path. 

//     - `filename`: This function determines the name of the uploaded file. It generates a unique filename by prefixing the original filename with the current timestamp (using `Date.now()`). The `cb` function is a callback that takes an error (if any) and the generated filename.

// 3. **Multer Configuration**: The `upload` variable is created by calling `multer()` with an object that contains the storage configuration and additional options.
//     - `storage`: This specifies the storage configuration defined earlier.
//     - `limits`: This sets a limit on the file size that can be uploaded. In this case, it is set to 5MB (5 * 1024 * 1024 bytes).
//     - `fileFilter`: This function is used to filter the types of files that can be uploaded. It checks the MIME type of the uploaded file against a list of allowed types (JPEG, PNG, PDF). The `cb` function is a callback that takes an error (if any) and a boolean indicating whether the file should be accepted or rejected.


// To use this `upload` middleware in your server routes, you can do the following:
// ```javascript
// import express from 'express';
// import { upload } from './middlewares/multer.js'; // Adjust the path as necessary   
// const router = express.Router();

// // Example route to handle file upload
// router.post('/upload', upload.single('file'), (req, res) => {
//     // 'file' is the name of the input field in the form that uploads the file  
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }
//     res.send(`File uploaded successfully: ${req.file.filename}`);
// });