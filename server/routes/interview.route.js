import express from 'express'
import isAuth from '../middlewares/isAuth.js'
import { upload } from '../middlewares/multer.js'
import { analyzeResume, generateQuestion,submitAnswer, finishInterview, getMyInterviews,getInterviewReport } from '../controllers/interview.controller.js'


const interviewRouter = express.Router()

interviewRouter.post("/resume", isAuth, upload.single('resume'), analyzeResume )
// explain upload.single('resume') in the code above and how it is used to handle file uploads in the interviewRouter.post route.

// The `upload.single('resume')` in the code above is a middleware function provided by the `multer` library, which is used to handle file uploads in Express.js applications. When a POST request is made to the "/resume" route, this middleware processes the incoming request and looks for a file upload with the field name 'resume'. It expects the client to send a multipart/form-data request that includes a file in the 'resume' field. The `upload.single()` method is designed to handle a single file upload, and it will parse the incoming request, save the uploaded file to the specified destination (as configured in the multer storage settings), and attach information about the uploaded file to the `req.file` object. 

// This allows the `analyzeResume` controller function to access the uploaded file's details (such as its path, original name, size, etc.) through `req.file`, enabling it to read and process the resume file accordingly. If the file upload is successful, the middleware will pass control to the next function in the route handler (in this case, `analyzeResume`). If there is an error during the file upload process (e.g., no file uploaded, file too large, etc.), the middleware will handle the error and prevent further processing of the request.


interviewRouter.post("/generate-questions",isAuth,generateQuestion)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)

interviewRouter.get("/get-interview", isAuth, getMyInterviews)
interviewRouter.get("/report/:id", isAuth, getInterviewReport)


export default interviewRouter