
const Category = require('../model/category.model');


exports.addCategory=(req,res,next)=>{
       const{title,description}=req.body;
       const newCategory=new Category({
       ...req.body
      })
      newCategory.save((err,category)=>{
           if(err){
              console.log(err.message);
           }
           req.flash('success','Great , category has been created');
           res.redirect('/add-category');
      })
}
