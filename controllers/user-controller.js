const user=require('../model/user.model');
//const bcryptjs=require('bcryptjs');
const passport = require('passport');
var randomToken = require('random-token');
const reset=require('../model/reset-model');
module.exports={
    login:(req,res,next)=>{
      //constituer les donnes recues
      const User =new user({
            username:req.body.username,
            password:req.body.password
      })
      req.login(User,(err)=>{
          if (err) {
              req.flash('error',err.message);
              return res.redirect('/users/login');
          }
          passport.authenticate("local",{failureRedirect:'/users/login',failureFlash:'Invalid username or password.'})
          (req,res,(err,User)=>{
            if (err) {
                req.flash('error',err.message);
                return res.redirect('/users/login');
            }
                req.flash('success',"you are connected successfully");
                return res.redirect('/users/dashboard');
            })
      })
    },
    signup:(req,res,next)=>{
        const newUser=user({
             username:req.body.username,
             firstname:req.body.firstname,
             lastname:req.body.lastname,
             email:req.body.email
        })
        user.register(newUser, req.body.password, (err,user)=>{
            if (err) {
                req.flash('error',err.message);
                return res.redirect('/users/sign-up');
            }
        
            //Authentification
            passport.authenticate("local")(req,res,(err,newUser)=>{
                if (err) {
                    req.flash('error',err.message);
                    return res.redirect('/users/sign-up');
                }
                    req.flash('success',"you are connected successfully");
                    return res.redirect('/users/dashboard');
                })
            })
        },
    resetPassword:(req,res,next)=>{
           user.findOne({username: req.body.username},(err,user)=>{
                if (err) {
                   req.flash('error',err.message);
                   return res.redirect('/users/forgot-password');
                }
                if (!user) {
                    req.flash('error','username not found');
                    return res.redirect('/users/forgot-password');
                }
                // creation du token
                const token=randomToken(16);
                const Reset=new reset({
                      username:req.body.username,
                      resetPasswordToken:token,
                      resetExpire:Date.now()+3600000
                    })
                    Reset.save((err,Reset)=>{
                        if (err) {
                            req.flash('error',err.message);
                            return res.redirect('/users/forgot-password');
                        }
                
                    //email de renitialisation
                    req.body.email=user.email;
                    req.body.message="<h3>Hello" +user.username+"</h3></br>click this link to reset your password:</br>"
                    +req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;
                    next(); //pour le midlleware
                    })
        })
    },
    resetPasswordForm:(req,res,next)=>{
        const token= req.params.token;
        reset.findOne({resetPasswordToken: token, resetExpire: {$gt: Date.now()}},(err,reset)=>{
            if (err) {
                req.flash('error',err.message);
                return res.redirect('/users/forgot-password');
            }if (!reset) {
                req.flash('error','Your token is invalid, please ask again');
                return res.redirect('/users/forgot-password');
            }
                req.flash('success','Please reset your password');
                return res.render('reset-password');
            
        });

    },
    postResetPasswordForm:(req,res,next)=>{
        const token=req.params.token;
        const password=req.body.password;
        //savoir si le token est valide
        reset.findOne({resetPasswordToken: token, resetExpire: {$gt: Date.now()}},(err,reset)=>{
            if (err) {
                req.flash('error',err.message);
                return res.redirect('/users/forgot-password');
            }
            if (!reset) {
                req.flash('error','Your token is invalid, please ask again');
                return res.redirect('/users/forgot-password');
            }
              
            user.findOne({username:reset.username},(err,user)=>{
                if (err) {
                    req.flash('error',err.message);
                    return res.redirect('/users/forgot-password');
                }if (!user) {
                    req.flash('error','User not found.please enter your email and ask again.');
                    return res.redirect('/users/forgot-password');
                }
                user.setPassword(password,(err)=>{
                    if (err) {
                        req.flash('error','You can\'t change your password.please enter your email');
                        return res.redirect('/users/forgot-password');
                    }
                    user.save();
                    //supprimer lestokens lorsque user modifi son mot de passe
                    reset.deleteMany({username: user.username},(err,message)=>{ 
                          if (err) {
                             console.log(err);
                          }
                          console.log(message);
                    })
                })
            
            })
               req.flash('success','Your password has been updated successfully');
               return res.redirect('/users/login');
        })
    },
    saveProfile:(req,res,next)=>{
        if (!req.user) {
            req.flash('warning','Please login to modify your profile!');
            return res.redirect('/users/login');
        }
        if (req.user._id != req.body.userId) {
            req.flash('error','You do not have the right to modify this profile!');
            return res.redirect('/users/dashboard');
        }
        //modifiction de ces informations
        user.findOne({_id: req.body.userId},(err,user)=>{
            if (err) {
               console.log(err); 
            }
            const oldUsername=user.username;
            const oldPassword=user.password;
            user.username=req.body.username ?req.body.username:user.username;
            user.firstname=req.body.firstname ?req.body.firstname:user.firstname;
            user.lastname=req.body.lastname ?req.body.lastname:user.lastname;
            user.email=req.body.email ?req.body.email:user.email;
            user.password=req.body.password ?req.body.password:user.password;
            user.save((err,user)=>{
                if (err) {
                    req.flash('error','An error has been occured. Please try again!');
                    return res.redirect('/users/dashboard');
                } if (oldUsername != user.username) {
                    req.flash('success','Your username has been changed successfully and you hve been logged out Please reconnect using yur new username:'+req.body.username);
                    return res.redirect('/users/login');
                } else if (oldPassword != user.password) {
                    req.flash('success','Your password has been changed successfully and you have been logged out Please reconnect using your new password:'+req.body.password);
                    return res.redirect('/users/login');
                }  
                req.flash('success','Your account has been updated successfully');
                return res.redirect('/users/dashboard');
            })
        });
        
    }
}


/*bcryptjs.hash(req.body.password, 10,(err, hash)=>{
    // Store hash in your password DB.
    if (err) {
        req.flash('error',err.message);
        return res.redirect('/users/sign-up')
    }
    const newUser=user({
        ...req.body,
        password:hash
     })
     newUser.save((err,user)=>{
        if (err) {
            req.flash('error',err.message);
            return res.redirect('/users/sign-up')
        }
        req.flash('success',"Your account has been successfully created. You can login");
        return res.redirect('/users/login')
     });
});*/