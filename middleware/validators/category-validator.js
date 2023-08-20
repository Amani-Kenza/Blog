const {Validator} = require('node-input-validator');

const categoryValidator=(req,res,next)=>{
    
    const v =new Validator(req.body,{
    title:'required',
    description:'required',
    });


v.check().then((matched)=>{
    if (!matched) {
        //errors
        req.flash('errorForm',v.errors);
        return res.redirect('/add-category');
    }
     next();
})
}
module.exports=categoryValidator;