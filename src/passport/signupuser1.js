var LocalStrategy   = require('passport-local').Strategy;

var usermysql = require('../model/user');

var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

 passport.use('signupuser', new LocalStrategy({
            usernameField: 'dni',
            passwordField: 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log('Registro comenzado con perfil:'+req.user.perfil);
            findOrCreateUser = function(){              
                          // creamos el usuario
                          // Tendremos en cuenta si el usuario que está registrando tiene perfil Administrador.
                          // El nuevo usuario tendrá un password asignado por el administrador y el perfil indicado
                          if(req.user.perfil=='administrador'){
                            passwordAsignada=createHash(password);
                            perfilAsignado=req.param('perfil');
                          }
                          // O tiene pefil monitor, secretaria, en este caso el password se genera automáticamente.
                          // Y el perfil del nuevo usuario será siempre participante.
                          else{
                            passwordAsignada=createHash('12345');
                            perfilAsignado='participante';
                          }
                          var newUser = {
                            // set the user's local credentials
                            dni : username,
                            nombre : req.param('nombre'),
                            apellidos : req.param('apellidos'),
                            telefono: req.param('telefono'),
                            direccion: req.param('direccion'),
                            email: req.param('email'),
                            password : passwordAsignada,
                            perfil: perfilAsignado
                          };
                          //Salvar el nuevo usuaruio
                          usermysql.insertUser(newUser,function(err,rows){
                                  if (err){
                                      console.log('Error al salvar usuario: '+err);
                                      return done(null, false, req.flash('message','Asegurate que el nuevo usuario no esta ya registrado, con el mismo DNI, nombre y apellidos ó correo electrónico'));
                                  }
                                  console.log('Usuario registrado correctamente'+req.user.perfil);
                                  return done(null, req.user);
                          });
                      //}
                }
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
