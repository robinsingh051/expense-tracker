const User=require('../models/user');

exports.getUsers=(req,res,next)=>{
    User.findAll()
    .then((result)=>{
        res.json(result);
    })
    .catch((err)=>{
        console.log(err);
    });
};

exports.postUsers=(req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    console.log(name,email);
    User.create({
        name:name,
        email:email
    })
    .then((newUser)=>{
        console.log(newUser.id);
        User.findByPk(newUser.id)
        .then((user)=>{
            res.status(201).json(user);
        })
    })
    .catch((err)=>{
        console.log(err);
    });
};

exports.getUser=(req,res,next)=>{
    const userId=req.params.id;
    User.findByPk(userId)
    .then((user)=>{
        res.json(user);
    })
    .catch((err)=>{
        console.log(err);
    });
};

exports.deleteUser=(req,res,next)=>{
    const userId=req.params.id;
    User.findByPk(userId)
    .then((user)=>{
        return user.destroy();
    })
    .then(()=>{
        res.satus(204).json({success:"user is deleted"});
    })
    .catch((err)=>{
        console.log(err);
    });
};