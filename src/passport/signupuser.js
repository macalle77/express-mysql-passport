var LocalStrategy   = require('passport-local').Strategy;

var usermysql = require('../model/user');

var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

 passport.use('signupuser', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, dni, password, done) {

            findOrCreateUser = function(){
                // find a user in mysql with provided username
                usermysql.getUserDni(dni,function(err,rows){
                  if(err){
                    console.log('Error en el registro: '+err);
                    return done(err);
                  }
                  if(rows.length > 0){
                    console.log('Usuario con dni: '+dni+' ya existe');
                    return done(null, false, req.flash('message','Usuario ya existe'));
                  }
                  else {
                        // if there is no user with that email
                        // create the user
                        var newUser = {
                        // set the user's local credentials
                          dni : req.param('dni'),
                          nombre : req.param('nombre'),
                          apellidos : req.param('apellidos'),
                          telefono: req.param('telefono'),
                          direccion: req.param('direccion'),
                          email: req.param('email'),
                          password : createHash(password),
                          perfil: req.param('perfil')
                        };
                        // save the user
                        //db.query('INSERT INTO accesos SET ?', newUser, function(err, rows, fields){
                        usermysql.insertUser(newUser,function(err,rows){
                            if (err){
                                console.log('Error al salvar usuario: '+err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
