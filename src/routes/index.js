var express = require('express');

var moment=require('moment');

var sleep=require('system-sleep');

var modelact = require ('../model/actividad');

var modeluser = require ('../model/user');

var router=express.Router();

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  console.log("hola autenticación");
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport){

    /*
    router.get('/saludo', function(req,res){
      res.render('saludo',{ message: req.flash('message') });
    });

    router.post('/prueba', function(req,res){
      res.render('welcome',{ message: req.flash('message') });
    });
    */

    /* GET login page. */

    router.get('/', function(req, res) {
      // Display the Login page with any flash message, if any
      res.render('index', { message: req.flash('message') });
    });

      /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash : true
    }));

    /* GET Registration Page */
    /*router.get('/signup', function(req, res){
      res.render('register',{message: req.flash('message')});
    });*/

    /* Handle Registration POST */
    router.post('/signupuser', passport.authenticate('signupuser', {
      successRedirect: '/home?seccion=listado',
      failureRedirect: '/home?seccion=nuevo',
      failureFlash : true
    }));

    /* Handle Home Page and the rest*/

    router.get('/home', isAuthenticated, (req, res) => {
      let seccion=req.query.seccion || 'listado'

      if(req.user.perfil=="administrador"){
        console.log("Seccion administrador:"+seccion)
        modeluser.getUsers(function(err,users){
          if(seccion=="nuevo"){
            res.render('adminnewuser',{
              title: 'Nuevo usuario',
              message: req.flash('message')
            });
          }
          else{
            res.render('adminlistuser',{
              title: 'Lista de usuarios',
              users:users
            });
          }
        });
      }
      else if (req.user.perfil=="secretaria") {
        console.log("Seccion secretaria:"+seccion)
          if(seccion=="nuevo"){
            res.render('secrenewuser',{
              title: 'Nuevo usuario',
              message: req.flash('message')
            });
          }
          else if(seccion=="listado_actual"){
            modelact.getActividad(function(err,activity){
              modelact.obtenerEstadoParticipantes(activity[0].id_actividad,function(error,listado){
                res.render('secrelistuser',{
                  title: 'Lista de usuarios',
                  accion: 'activos',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="listado_pendientes"){
            modelact.getActividad(function(err,activity){
              modelact.obtenerEstadoParticipantesPendientes(activity[0].id_actividad,function(error,listado){
                res.render('secrelistuser',{
                  title: 'Lista de usuarios',
                  accion: 'pendientes',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="listado"){
            modeluser.getUsers(function(error,listado){
              res.render('secrelistuser',{
                title: 'Lista de usuarios',
                accion: 'gestion',
                users: listado
              });
            })
          }
          else{
            res.render('secregestactividad',{
              title: 'Gestionar Actividades',
              actividad:{
                  titulo:'Actividad 1',
                  descripcion:'Descripcion 1',
                  requisitos: 'Requisitos 1'
              },
              message: req.flash('message')
            });
          }
      }
      else if (req.user.perfil=="monitor") {
        console.log("Seccion monitor:"+seccion)
        modeluser.getUsers(function(err,users){
          if(seccion=="nuevo"){
            res.render('monnewuser',{
              title: 'Nuevo usuario',
              message: req.flash('message')
            });
          }
          else if(seccion=="listado_actual"){
            modelact.getActividad(function(err,activity){
              modelact.obtenerEstadoParticipantes(activity[0].id_actividad,function(error,listado){
                res.render('monlistuser',{
                  title: 'Lista de participantes',
                  accion: 'activos',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="listado_pendientes"){
            modelact.getActividad(function(err,activity){
              modelact.obtenerEstadoParticipantesPendientes(activity[0].id_actividad,function(error,listado){
                res.render('monlistuser',{
                  title: 'Lista de usuarios no apuntados',
                  accion: 'pendientes',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="gestionar"){
            modelact.getActividad(function(err,activity){
              res.render('mongestactividad',{
                title: 'Gestionar Actividades',
                actividad:activity[0],
                message: req.flash('message')
              });
            })
          }
          else{
            modeluser.getUserPerfil('monitor',function(err,usuarios){
              res.render('monnewactividad',{
                monitores: usuarios,
                title: 'Nueva Actividad',
                message: req.flash('message')
            });
          });
          }
        });
      }
      else{
         modeluser.getUserDni(req.user.dni,function(err,usuario){
          console.log("Seccion participante:"+usuario[0].dni);
          if(seccion=="gestionar"){
            res.render('pardatospersonales',{
              title: 'Gestionar Actividades',
              user:usuario[0],
              message: req.flash('message')
            });
          }
          else if(seccion=="nuevaactividad"){
            res.render('parnewactividad',{
              title: 'Nueva Actividad',
              actividad:{
                titulo:'Actividad 1'
              },
              message: req.flash('message')
            });
          }
          else{
            modelact.getActividad(function(err,activity){
              console.log("fecha actividad 1:"+activity[0].fecha)
              fecha=moment(activity[0].fecha).format('YYYY-MM-DD')
              console.log("Fecha actividad 2:"+fecha)
              res.render('parveractividad',{
                title: 'Datos Actividad',
                actividad:activity[0],
                fecha_actividad:fecha,
                message: req.flash('message')
              });
            })
          }
        })
      }
    });

    router.get('/asignaractividad/:id',isAuthenticated,(req,res)=>{
      let id_participante=req.params.id;
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else {
            modelact.apuntarActividad(id_participante,activity[0].id_actividad,function(err,activity){
              if(err) throw err;
              else message: "Usuario apuntado a la actividad"
            })
          res.redirect('/home?seccion=listado_pendientes');
        }
      })
    })

    router.get('/darbajaactividad/:id',isAuthenticated,(req,res)=>{
      let id_participante=req.params.id;
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else {
            modelact.darBajaActividad(id_participante,activity[0].id_actividad,function(err,activity){
              if(err) throw err;
              else message: "Usuario borrado de la actividad"
            })
          res.redirect('/home?seccion=listado_actual');
        }
      })
    })

    router.get('/confirmarpago/:id',isAuthenticated,(req,res)=>{
      let id_participante=req.params.id;
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else{
            modelact.confirmarPagoActividad(id_participante,activity[0].id_actividad,function(err,result){
                if(err) throw err;
                else{
                  message: "Pago de usuario gestionado";
                }
            })
          res.redirect('/home?seccion=listado_actual');
        }
      })
    })

    router.get('/firmadouser/:id',isAuthenticated,(req,res)=>{
      let id_participante=req.params.id;
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else{
            modelact.firmarActividad(id_participante,activity[0].id_actividad,function(err,result){
                if(err) throw err;
                else{
                  message: "Firma de usuario gestionada";
                }
            })
          if(req.user.perfil=="monitor") res.redirect('/home?seccion=listado');
          else res.redirect('/home?seccion=listado_actual');
        }
      })
    })

    router.post('/condicionesactividad',isAuthenticated,(req,res)=>{
      id_participante=req.user.dni
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else
        {
          if(req.body.aceptar=="aceptar")
            modelact.firmarActividad(id_participante,activity[0].id_actividad,function(err,result){
                if(err) throw err;
                else{
                  message: "Usuario apuntado a la actividad, aceptando las condiciones"
                }
            })
          else
            modelact.darBajaActividad(id_participante,activity[0].id_actividad,function(err,activity){
              if(err) throw err;
              else{
                  message: "Usuario se da de baja de la actividad"
              }
          })
          res.redirect('/home?seccion=listado');
        }
      })
    })

    router.post('/nuevaactividad',isAuthenticated,(req,res)=>{
      modelact.insertActividad(req.body,function(err,rows){
          if(err) throw err;
          res.redirect('/home?seccion=listado');
      })
    })

    router.get('/deleteuser/:id',isAuthenticated,(req, res)=>{
      let id=req.params.id;
      console.log("borrado");
      modeluser.deleteUser(id,function(err,rows){
        if(err) throw err;
        res.redirect('/home?seccion=listado');
      })
    });

    router.post('/updateuser',isAuthenticated,(req,res)=> {
        console.log("Valor req:"+req.body.nombre);
        modeluser.updateUser(req.body,function(err,rows){
          if(err) throw err;
          else{
            if(req.user.perfil=="monitor")
              res.redirect('/home?seccion=listado_actual')
          }
        })
    });

    router.post('/add',isAuthenticated ,(req, res) => {
      let body=req.body;
      body.status=false;
      console.log ("nuevo");
      console.log("Mensaje sesion add:"+req.user.username)
      modeluser.create(body, (err, task) => {
        if(err) throw err;
        res.redirect('/home');
       });
    });

    router.get('/turn/:id', isAuthenticated, (req, res)=> {
      let id=req.params.id;
      console.log("cambio");
      modeluser.findById(id, (err,task)=>{
        if(err) throw err;
        task.status = !task.status;
        task.save()
          .then(() => res.redirect('/home'))
      });
    });

    /* Logout */
    router.get('/signout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    return router;
}



/*module.exports = router;*/
