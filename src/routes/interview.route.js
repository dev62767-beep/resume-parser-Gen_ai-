const express = require("express")
const { authMiddleware } = require("../middleware/auth.middleware")
const {Upload } = require("../middleware/file.middleware")
    
    
const { generateInterViewReportController  } = require("../controllers/interview.controller")
const interviewRouter = express.Router()

interviewRouter.post('/', authMiddleware, Upload.single('resume'), generateInterViewReportController) 

module.exports = interviewRouter