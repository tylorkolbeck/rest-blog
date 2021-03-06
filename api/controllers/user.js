const mongoose = require("mongoose");
const User = require("../models/user"); 
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");


exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
          return res.status(409).json({
            message: "E-Mail exists"
          });
        } else if (user.length === 0) {
          bcrypt.hash(req.body.password, null, null, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              })
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: "User created"
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      })
      .catch(err => {
          console.log(err) 
          res.status(500).json({
              error: err
          })})
  }

  exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email.toLowerCase() })
        .exec()
        .then(user => {
            
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Wrong user name.'
                })
            } 
        
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({
                        message: "Login Failed. Wrong password or Username",
                        error: err
                    })
                }
                
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        }, 
                        
                        process.env.JWT_KEY, 
                        {
                            expiresIn: "10d"
                        }
                        )
                      
                        return res.status(200).json({
                            message: "Login successful",
                            token: token,
                            userId: user[0]._id
                        })
                }

                res.status(401).json({
                    message: 'Login Failed. Not sure why.',
                })
            })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
}

exports.user_delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            })
        } )
        .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
        });
}