var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport){

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    //function integrated in mongoose
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    //fields from front end (name I gave the terms)
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //pass entire request to callback
  },
  function(req, email, password, done){
    // https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
    process.nextTick(function(){
      //first arg is path to email var from user object schema
      User.findOne({'email': email}, function(err, user){
        if(err){
          return done(err);
        }

        //already a user with email
        if(user){
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }
        else{
          var newUser = new User();
          newUser.email = email;
          //method from user schema
          newUser.password = newUser.generateHash(password);

          newUser.save(function(err){
            if(err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  //see local-signup method above to understand below
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){

    User.findOne({'email': email}, function(err, user){
      if(err){
        return done(err);
      }

      if(!user){
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }

      if(!user.isValidPassword(password)){
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      }

      return done(null, user);
    });
  }));
}
