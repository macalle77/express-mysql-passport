var express = require('express');

var moment=require('moment');

var sleep=require('system-sleep');

var modelact = require ('../model/actividad');

var modelpart = require ('../model/participantes');

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
              users:users,
              mensajeRegistroError: req.flash('mensajeRegistroError'),
              mensajeRegistro: req.flash('mensajeRegistro')
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
              modelpart.obtenerEstadoParticipantes(activity[0].id_actividad,function(error,listado){
                res.render('secrelistuser',{
                  title: 'Lista de usuarios',
                  accion: 'activos',
                  tipo_listado: 'listado_actual',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="listado_pendientes"){
            modelact.getActividad(function(err,activity){
              modelpart.obtenerEstadoParticipantesPendientes(activity[0].id_actividad,function(error,listado){
                res.render('secrelistuser',{
                  title: 'Lista de usuarios',
                  accion: 'pendientes',
                  tipo_listado: 'listado_pendientes',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="listado"){
            modeluser.getUsers(function(error,listado){
              res.render('secrelistuser',{
                title: 'Lista de usuarios',
                tipo_listado: 'listado',
                accion: 'gestion',
                users: listado
              });
            })
          }
          else if(seccion=="listado_actividades"){
            modelact.getActividades(function(error,listado){
              res.render('listadoactividadessecre',{
                title: 'Lista de actividades',
                tipo_listado: 'listado_actividades',
                moment: moment,
                actividades: listado
              })
            })
          }
          else if(seccion=="listado_actividades_filtro_fecha"){
            console.log("desde:"+req.query.desde);
            modelact.getActividadesFecha(req.query.desde,req.query.hasta,function(error,listado){
              res.render('listadoactividadessecre',{
                title: 'Lista de actividades en el periodo',
                tipo_listado: 'listado_actividades',
                moment: moment,
                actividades: listado
              })
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
              modelpart.obtenerEstadoParticipantes(activity[0].id_actividad,function(error,listado){
                res.render('monlistuser',{
                  title: 'Lista de participantes',
                  accion: 'activos',
                  tipo_listado: 'listado_actual',
                  users: listado
                });
              })
            })
          }
          else if(seccion=="listado_pendientes"){
            modelact.getActividad(function(err,activity){
              modelpart.obtenerEstadoParticipantesPendientes(activity[0].id_actividad,function(error,listado){
                res.render('monlistuser',{
                  title: 'Lista de usuarios no apuntados',
                  accion: 'pendientes',
                  tipo_listado: 'listado_pendientes',
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
                fecha_actividad: moment(activity[0].fecha).format('YYYY-MM-DD'),
                inicio_inscripcion: moment(activity[0].inicio_inscripcion).format('YYYY-MM-DD'),
                fin_inscripcion:moment(activity[0].fin_inscripcion).format('YYYY-MM-DD'),
                message: req.flash('message')
              });
            })
          }
          else if(seccion=="listado_actividades"){
            modelact.getActividades(function(error,listado){
              res.render('listadoactividadesmon',{
                title: 'Lista de actividades',
                tipo_listado: 'listado_actividades',
                moment: moment,
                actividades: listado
              })
            })
          }
          else if(seccion=="listado_actividades_filtro_fecha"){
            console.log("desde:"+req.query.desde);
            modelact.getActividadesFecha(req.query.desde,req.query.hasta,function(error,listado){
              res.render('listadoactividadesmon',{
                title: 'Lista de actividades en el periodo',
                tipo_listado: 'listado_actividades',
                moment: moment,
                actividades: listado
              })
            })
          }
          else if(seccion=="listado_monitores"){
            modelact.getMonitoresParticipantes(function(error,listado1){
              modelact.getMonitoresNoParticipantes(function(error,listado2){
                res.render('monlistmonitor',{
                  title: 'Lista de monitores organizadores',
                  organizadores: listado1,
                  noorganizadores: listado2
                });
              })
            })
          }
          else{
            modeluser.getUserPerfil('monitor',function(err,usuarios){
              res.render('monnewactividad',{
                monitores: usuarios,
                title: 'Nueva Actividad',
                message: req.flash('message')
              })
            })
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
            modelpart.apuntarActividad(id_participante,activity[0].id_actividad,function(err,activity){
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
            modelpart.darBajaActividad(id_participante,activity[0].id_actividad,function(err,activity){
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
            modelpart.confirmarPagoActividad(id_participante,activity[0].id_actividad,function(err,result){
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
            modelpart.firmarActividad(id_participante,activity[0].id_actividad,function(err,result){
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
            modelpart.firmarActividad(id_participante,activity[0].id_actividad,function(err,result){
                if(err) throw err;
                else{
                  message: "Usuario apuntado a la actividad, aceptando las condiciones"
                }
            })
          else
            modelpart.darBajaActividad(id_participante,activity[0].id_actividad,function(err,activity){
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
        else{
          if(req.body.tipo_listado=="listado_pendientes")
              res.redirect('/home?seccion=listado_pendientes');
          else if(req.body.tipo_listado=="listado_actual")
              res.redirect('/home?seccion=listado_actual');
          else res.redirect('/home?seccion=listado');
        }
      })
    });

    router.post('/updateuser',isAuthenticated,(req,res)=> {
        console.log("Valor req:"+req.body.nombre+"***"+req.body.tipo_listado);
        modeluser.updateUser(req.body,function(err,rows){
          if(err){
             console.log('Error en la actualización')
             req.flash('mensajeRegistroError','Asegurate que los nuevos datos no se corresponden, con el mismo DNI, nombre y apellidos ó correo electrónico');
             //throw err;
          }
          else {
            req.flash('mensajeRegistro','Usuario actualizado');
          }
          if(req.body.tipo_listado=="listado_pendientes")
                res.redirect('/home?seccion=listado_pendientes');
          else if(req.body.tipo_listado=="listado_actual")
                res.redirect('/home?seccion=listado_actual');
          else res.redirect('/home?seccion=listado');
        })
    });

    router.get('/organizaractividad/:id',isAuthenticated,(req,res)=>{
      let id=req.params.id;
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else
        {
          modelact.organizarActividadMonitor(id,activity[0].id_actividad,function(err,rows){
            if(err) throw err;
            else{
              res.redirect('/home?seccion=listado_monitores');
            }
          })
        }
      })
    })

    router.get('/finorganizaractividad/:id',isAuthenticated,(req,res)=>{
      let id=req.params.id;
      modelact.getActividad(function(err,activity){
        if(err) throw err
        else
        {
          modelact.finOrganizarActividadMonitor(id,activity[0].id_actividad,function(err,rows){
            if(err) throw err;
            else{
              res.redirect('/home?seccion=listado_monitores');
            }
          })
        }
      })
    })

    router.post('/listadomonitores',isAuthenticated,(req,res)=> {
          res.redirect('/home?seccion=listado_monitores');
    })

    router.post('/filtrarfecha',isAuthenticated,(req,res)=> {
         res.redirect('/home?seccion=listado_actividades_filtro_fecha&desde='+req.body.desde+'&hasta='+req.body.hasta);
    })

    router.post('/listado_actividades',isAuthenticated,(req,res)=> {
         res.redirect('/home?seccion=listado_actividades');
    })
    /* Logout */
    router.get('/signout', function(req, res) {
      req.logout();
      res.redirect('/');
    });

    return router;
}



/*module.exports = router;*/
