const nodemailer=require('nodemailer');

const sendResetMail=(req,res,next)=>{
      var transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:'amanikenza7@gmail.com',
            pass:'wvwjqylasnszutsc'
          },
          tls: {
            rejectUnauthorized: false
          }
      });
      var message="<br>Message: "+req.body.message;
      var mailOptions={
          form:'amanikenza7@gmil.com',
          to:req.body.email,
          subject:"Reset your password",
          html:message
      };
      transporter.sendMail(mailOptions,(err,infos)=>{
        if (err) {
           console.log(err);
           req.flash('error',err.message);
           return res.redirect('/users/forgot-password');
        }else{
            console.log(infos);
            req.flash('success','Great, a reset email has been sent to the adress:'+req.body.email+'please check your mailbox');
            return res.redirect('/users/forgot-password');
        }
     })
}
module.exports=sendResetMail;