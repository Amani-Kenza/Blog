//const user =require("../model/members-model");
const fs = require('fs');

module.exports = {
   
        addMember:async(req,res,next)=>{
        const{username, email, role_in_company, timestamp, added_by,image}=req.body;
        const { data, error } = await supabase.from('members').insert({
          username,
          email,
          role_in_company,
          timestamp,
          added_by,
          image
        })
        if (error) {
          req.flash('error','An error is occured')
          return res.redirect('/add-member');
        } 
        else{
          req.flash('success','Thank you your member is added')
          return res.redirect('/add-member');
        }
        },
        getMember: async (req, res) => {
          const { data, error } = await supabase
              .from('members')
              .select('*');
          
          if (error) {
              console.error(error);
              return res.status(500).json({ error: 'Unable to retrieve members.' });
          }
          
          if (data && data.length > 0) {
            res.status(200).json(articles);
          } else {
              return res.json({ message: 'No members found.' });
          }
        },
        updateMember:async(req, res,next)=>{
          const id = req.params.id;

          // Rechercher le membre dans la base de données Supabase
          const { data: members, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single();
          if (error) {
            req.flash('error', error.message);
            return res.redirect('/update-members/' + id);
          }
          if (!members) {
            req.flash('error', "Sorry, You can't edit this member!");
            return res.redirect('/update-members/' + id);
          }
          let imageUrl = articles.image;
          if (req.file) {
            // Supprimer l'ancienne image de l'article
            const filename = articles.image.split('/members/')[1];
            const { error } = await supabase.storage
              .from('members')
              .remove([filename]);
        
            if (error) {
              req.flash('error', error.message);
              return res.redirect('/edit-article/' + id);
            }
          // Ajouter la nouvelle image de l'article
         const file = req.file;
         const { data: uploadedFile, error: uploadError } = await supabase.storage
         .from('members')
         .upload(file.path, {
         cacheControl: 'public, max-age=31536000',
         upsert: false,
         contentType: file.mimetype,
         contentDisposition: `inline; filename="${file.filename}"`,
      });

         if (uploadError) {
         req.flash('error', uploadError.message);
         return res.redirect('/edit-article/' + id);
         }
        imageUrl = uploadedFile.Key;
        }

        // Mettre à jour les données de l'article dans la base de données Supabase
          const{ error: updateError } = await supabase
            .from('members')
            .update({
              username: req.body.username || members.updateMember,
              email: req.body.email || members.email,
              role_in_company: req.body.role_in_company || articles.role_in_company,
              timestamp:req.body.timestamp || members.timestamp,
              added_by:req.body.added_by || members.added_by,
              image: imageUrl,
            })
            .eq('id', id)
            .single();

          if (updateError) {
            req.flash('error', updateError.message);
            return res.redirect('/update-article/' + id);
          }

          req.flash('success', 'The member has been edited');
          return res.redirect('/update-article/' + id);
        },
        deleteMember:async  (req, res, next)=> {
          const { data, error } = await supabase
            .from('members')
            .delete()
            .eq('id', memberId)
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            });

        }
        
}
      

  /*const memberValidator=(req,res,next)=>{
    
    const v =new Validator(req.body,{
      username:'required',
      email:'required',
      role_in_company:'required',
      timestamp:'required',
      added_by:'required',
      image:'required'
    });

    v.check().then(async (matched)=>{
        if (!matched) {
            //errors
            req.flash('errorForm',v.errors);
            return res.redirect('/projectsRoutes/add-member');
        }
    })
}
module.exports = memberValidator;*/
  
  
  
  
  
  
  
      
     


 