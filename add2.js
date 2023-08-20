const { sync } = require('mkdirp');
const supabase=require('../config/supabase');
//const admin =require("../model/admin-model");
const { nanoid } = require('nanoid');

module.exports = {
    addAdmin:async(req,res,next)=>{
        const { username, role, email, password, token } = req.body;
        const { admin, error } = await supabase
    .from('admin')
    .insert([{ username, role, email, password, token }]).single();
     if(error){
      req.flash('error','An error is occured');
      return res.redirect('/add-admin');
     }else{
      req.flash('success','Thank you your article is added')
      return res.redirect('/add-article');
     }
    },
    deleteAdmin:async(req,res)=>{
      const { admin, error } = await supabase
      .from('admin')
      .delete()
      .eq('id', req.params.id)
      if(error){
      throw new Error(error.message)};
      return admin;
    },
    updateAdmin:async(req,res)=>{
        const { data: admin, error } = await supabase.from('admin').update(data).eq('id', id).single();
        if (error) {
          throw new Error(error.message);
        }
        return admin;
    },
    login: async (req, res, next) => {
      const { email, password } = req.body;
  
      try {
        // Authentifier l'utilisateur avec Supabase
        const { user, session, error } = await supabase.auth.signIn({
          email,
          password,
        });
  
        if (error) {
          req.flash('error', error.message);
          return res.redirect('/projectsRoutes/login');
        }
  
        req.flash('success', 'You are connected successfully');
        return res.redirect('/users/dashboard');
      } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/projectsRoutes/login');
      }
    },
    resetpassword: async(req,res,next)=>{
        //Rechercher l'admin dans la table
    const { data: admin, error } = await supabase
    .from("admin")
    .select("*")
    .eq("email", req.body.email)
    .single();
    
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/projectsRoutes/forgot-password");
  }

  if (!admin) {
    req.flash("error", "username not found");
    return res.redirect("/users/forgot-password");
  }
    //token
    const token = nanoid(16); 
    const Reset = async (email) => {
      const token = nanoid(16);
      const resetExpire = new Date(Date.now() + 3600000);
    
      const { data, error } = await supabase.from('reset').insert({
        email,
        resetPasswordToken: token,
        resetExpire: resetExpire.toISOString()
      });
    
      if (error) {
        throw error;
      }
    
      return data;
    };
    
    // Utilisation de la fonction Reset :
    router.post('/forgot-password', async (req, res) => {
      try {
        const { email } = req.body;
        const resetRecord = await Reset(email);
      // Personnaliserl'e-mail de réinitialisation de mot de passe
     req.body.email=user.email;
     req.body.message="<h3>Hello" +user.username+"</h3></br>click this link to reset your password:</br>"
     +req.protocol+"://"+req.get('host')+"/users/reset-password/"+token;
      }catch{
     next()
     //pour le midlleware
      }
      });
    
    
  }
}


 