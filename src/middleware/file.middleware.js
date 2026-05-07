const multer = require('multer');
const Upload = multer({
    storage: multer.memoryStorage(),
    limits  : {
        fileSize: 10 * 1024 * 1024
    }
})  
module.exports = {Upload}