const mongoose = require("mongoose")
//var validate = require('input-validator');
//Ajouter validator
const articleSchema = mongoose.Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    category:{type:String, required:true},
    image:{type:String, required:true},
    author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
    },
    publishedAt: {type:Date,required:true}
})
 module.exports=mongoose.model('Article',articleSchema);

 // on l'utilise si on est besoin de créer un article