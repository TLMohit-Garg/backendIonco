import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename for the uploaded image
  },
});

const upload = multer({ storage: storage,
  fileFilter: function(req, file, callback){
    if(
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype === 'image/jpeg' || 
      file.mimetype === 'application/pdf'
    ){
      callback(null, true);
    }else{
      callback(new Error('Invalid file type'), false);
    }
  },
  limits:{
    filesize: 1024 * 1024 * 2
  }
 });

 
export default upload;
