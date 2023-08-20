const mongoose = require("mongoose")
const passportlocalongoose = require('passport-local-mongoose')
//var validate = require('input-validator');
//Ajouter validator
const resetSchema = mongoose.Schema({
    username:{type:String, required:true},
    resetPasswordToken:{type:String, required:true},
    resetExpire:{type:Number, required:true}
})
resetSchema.plugin(passportlocalongoose);
module.exports=mongoose.model('Reset',resetSchema);

 // on l'utilise si on est besoin de créer un article
 