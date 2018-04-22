var express = require('express');

var model = require ('../model/user');

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
        model.getUsers(function(err,users){
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
        model.getUsers(function(err,users){
          if(seccion=="nuevo"){
            res.render('secrenewuser',{
              title: 'Nuevo usuario',
              message: req.flash('message')
            });
          }
          else if(seccion=="listado"){
            res.render('secrelistuser',{
              title: 'Lista de usuarios',
              users:users
            });
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
        });
      }
      else if (req.user.perfil=="monitor") {
        console.log("Seccion monitor:"+seccion)
        model.getUsers(function(err,users){
          if(seccion=="nuevo"){
            res.render('monnewuser',{
              title: 'Nuevo usuario',
              message: req.flash('message')
            });
          }
          else if(seccion=="listado"){
            res.render('monlistuser',{
              title: 'Lista de usuarios',
              users:users
            });
          }
          else if(seccion=="gestionar"){
            res.render('mongestactividad',{
              title: 'Gestionar Actividades',
              actividad:{
                  titulo:'Actividad 1',
                  descripcion:'Descripcion 1',
                  requisitos: 'Requisitos 1'
              },
              message: req.flash('message')
            });
          }
          else{
            res.render('monnewactividad',{
              title: 'Nueva Actividad',
              message: req.flash('message')
            });
          }
        });
      }
      else{
         model.getUserDni(req.user.dni,function(err,usuario){
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
            console.log("Datos de participante:"+req.user.nombre);
            res.render('parveractividad',{
              title: 'Datos Actividad',
              actividad:{
                  titulo:'Actividad 1',
                  descripcion:'Descripcion 1',
                  requisitos: 'Requisitos 1'
              },
              message: req.flash('message')
            });
          }
        })
      }
    });

    router.get('/deleteuser/:id',isAuthenticated,(req, res)=>{
      let id=req.params.id;
      console.log("borrado");
      model.deleteUser(id,function(err,rows){
        if(err) throw err;
        res.redirect('/home?seccion=listado');
      })
    });

    router.post('/updateuser',isAuthenticated,(req,res)=> {
        console.log("Valor req:"+req.body.nombre);
        model.updateUser(req.body,function(err,rows){
          if(err) throw err;
          res.redirect('/home?seccion=listado');
        })
    });

    router.post('/add',isAuthenticated ,(req, res) => {
      let body=req.body;
      body.status=false;
      console.log ("nuevo");
      console.log("Mensaje sesion add:"+req.user.username)
      model.create(body, (err, task) => {
        if(err) throw err;
        res.redirect('/home');
       });
    });

    router.get('/turn/:id', isAuthenticated, (req, res)=> {
      let id=req.params.id;
      console.log("cambio");
      model.findById(id, (err,task)=>{
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
