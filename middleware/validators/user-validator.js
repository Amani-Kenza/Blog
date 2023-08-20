const {Validator} = require('node-input-validator');

const userValidator=(req,res,next)=>{
    
    const v =new Validator(req.body,{
    firstname:'required',
    lastname:'required',
    username:'required',
    email:'required',
    password:'required',
    passwordConfirm:'required|same:password'
    });


v.check().then((matched)=>{
    if (!matched) {
        //errors
        req.flash('errorForm',v.errors);
        return res.redirect('/users/sign-up');
    }
     next();
})
}
module.exports=userValidator;