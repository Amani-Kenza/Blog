const multer = require('multer');

const MIME_TYPES ={
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
    'image/png':'png'
}
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/public/images/articles/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
*/
const storage=multer.diskStorage({
 destination:(req,file,callback)=>{
    callback(null, 'public/images/articles/');
 },
 filename:(req,file,callback)=>{
    var name=Math.floor(Math.random()*Math.floor(15258652325)).toString();
    name+=Math.floor(Math.random()*Math.floor(15258652325)).toString();
    name+=Math.floor(Math.random()*Math.floor(23008652325)).toString();
    name+=Math.floor(Math.random()*Math.floor(45678652325)).toString();
    name+=Date.now()+".";
    const extension = MIME_TYPES[file.mimetype];
    name+=extension;
    callback(null,name);
}
});
//const upload = multer({ storage: storage });
module.exports=multer({storage}).single('image');
//module.exports=upload.single('image');