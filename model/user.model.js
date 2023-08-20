const mongoose = require("mongoose")
const passportlocalongoose = require('passport-local-mongoose')
//var validate = require('input-validator');
//Ajouter validator
const userSchema = mongoose.Schema({
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    username:{type:String, required:true},
    email:{type:String, required:true},
    password:String,
    //articles:Array,//car user peut creer ou non un article donc c'est normal d'avoir un tableau vide
    createdAt:{type:Date,default:Date.now()}
})
userSchema.plugin(passportlocalongoose);
module.exports=mongoose.model('User',userSchema);

 // on l'utilise si on est besoin de créer un arti