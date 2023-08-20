const Article = require('../model/article.model');
const category = require('../model/category.model');
const fs=require('fs');
const user=require('../model/user.model');
//const multerConfig=require('../middleware/multer-config');
//Recuperer les produits qu'ona dans la base de donnees
exports.listArticle=(req,res)=>{
    Article.find()
    .then((articles)=>{
      //res.status(200).json(articles);
     // req.flash('success','TEST OK '); mainteneta n a pas besoin de lui juste lorsque on veut l'afficher sur la page d'acceuille
      res.render('index', { title: 'Express' ,'articles':articles});
    })
    .catch(err=>{
      res.status(200).json(err);
    })
}
exports.showArticle=(req,res)=>{
    Article.findOne({_id:req.params.id})
  .then((article)=>{
      res.render("single-article",{article: article});
      //console.log(article);
  })
  .catch((err)=>{
    res.redirect('/');
    //console.log(err);
  })
}
exports.addArticle=(req,res)=>{
    
     category.find()
     .then((categories)=>{
          res.render('add-article',{categories:categories});
     })
     .catch(()=>{
        res.redirect('/');
     })
  }
exports.addOneArticle=(req,res)=>{
   var article = new Article({
      ...req.body,
      image:`http://localhost:3000/images/articles/${req.file.filename}`,
      author:req.user,
      publishedAt: Date.now()
     });
    //console.log(article);
    article.save((error,article)=>{
      if (error) {
        req.flash('error','An error is occured')
        return res.redirect('/add-article');
      } 
      else{
         req.flash('success','Thank you your article is added')
        return res.redirect('/add-article');
      }
      });
}
exports.editArticle=(req,res)=>{
  const id=req.params.id;
  Article.findOne({_id:id,author:req.user._id},(err,article)=>{
         if (err) {
             req.flash('error',err.message);
             return res.redirect('/');
         }
         if(!article){
          req.flash('error',"Sorry, You can't edit this article!");
          return res.redirect('/');
        }
         category.find((err,categories)=>{
          if (err) {
            req.flash('error',err.message);
            return res.redirect('/');
          }else{
                return res.render('edit-article',{categories:categories,article:article});
          }
         })
  })
}
exports.editOneArticle=(req,res)=>{
  const id=req.params.id;
  Article.findOne({_id:id, author:req.user._id},(err,article)=>{
    if (err) {
       req.flash('error',err.message);
       return res.redirect('/edit-article/'+id);
    }
    if(!article){
      req.flash('error',"Sorry, You can't edit this article!");
      return res.redirect('/edit-article/'+id);
    }
    if (req.file) {
       const filename=article.image.split('/articles/')[0];
       fs.unlink(`public/images/articles/${filename}`,()=>{
       console.log('Deleted:',+filename);
       })
    }
    article.title=req.body.title ?req.body.title:article.title;
    article.category=req.body.category ?req.body.category:article.category;
    article.content=req.body.content ?req.body.content:article.content;
    article.image=req.file ? `http://localhost:3000/images/articles/${req.file.filename}`:article.image;
    article.save((err,article)=>{
      if (err) {
        req.flash('error',err.message);
        return res.redirect('/edit-article/'+id);
      }
      req.flash('success',"The article has been edited");
      return res.redirect('/edit-article/'+id);
    });
  })
}
exports.deleteArticle=(req,res)=>{
       Article.deleteOne({_id:req.params.id, author:req.user._id},(err,message)=>{
                 if (err) {
                  req.flash('error',"Sorry , you can't delete this article");
                  return res.redirect('/users/dashboard');
                 }if(!message.deletedCount){ //pour ne ps supprimerun article d'un autre user
                     req.flash('error',"Sorry , you can't delete this article");
                     return res.redirect('/users/dashboard');
                  }
                  console.log(message);
                  req.flash('success',"your article has been deleted! ");
                  return res.redirect('/users/dashboard');
       })
}