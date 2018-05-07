//llamamos al paquete mysql que hemos instalado
var moment = require('moment');

var mysql = require('mysql')
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createConnection(
	{
		host : '192.168.56.102',
		user : 'miguel',
		password :'miguel',
		database : 'prueba'
	}
);

//creamos un objeto para ir almacenando todo lo que necesitemos
var actModel = {};

//obtener listado de Actividades
actModel.getActividades = function (callback)
{
	if (connection){
     sql="select * from Actividad";
     connection.query(sql,function(error, result){
       if(error) throw error;
       else	callback(null, result);
     })
  }
}

//añadir actividad nueva
actModel.insertActividad = function(actData,callback)
{
	if (connection)
	{
    sql='INSERT INTO Actividad (titulo,descripcion,requisitos,fecha) VALUES(' + connection.escape(actData.titulo)+','+
    connection.escape(actData.descripcion)+','+
    connection.escape(actData.requisitos)+','+
    connection.escape(actData.fecha)+')'

    console.log("Insertar nueva actividad:"+sql);

		connection.query(sql,function(error, result)
		{
			if(error)
			{
				callback(error,null);
			}
			else
			{
        //devolvemos la última id insertada
        var lastAct=result.insertId;
        console.log('Ultimo id de actividad insertada:'+lastAct);
        sql='INSERT INTO Organizar (id_actividad,id_monitor,inicio_actividad, fin_actividad) VALUES (' + lastAct + ',' +
        connection.escape(actData.monitores) + ','+
        connection.escape(actData.inicio)+','+
        connection.escape(actData.fin)+')'

        console.log('Consulta de insercion en organizar:'+sql);
        connection.query(sql,function(error, result){
          if(error)
    			{
    				callback(error,null);
    			}
    			else
    			{
            callback(null,{"insertId" : result.insertId});
          }
        })
			}
		});
	}
}

//obtener actividad activa, estamos dentro del periodo de inscripcion
actModel.getActividad = function(callback)
{
  var fecha_actual=moment().format('YYYY-MM-DD');
  console.log('Fecha actual:'+fecha_actual);
  if (connection){
     sql="select id_actividad from Organizar where inicio_actividad<='"+
     fecha_actual +"' and fin_actividad>='"+ fecha_actual+"'";
     console.log("consultar fecha:"+sql)
     connection.query(sql,function(error, result){
       if(error) throw error;
       else
       {
         console.log("valor de result:"+result.length)
         sql='select * from Actividad where id_actividad='+connection.escape(result[0].id_actividad)
         console.log("consultar actividad:"+sql)
         connection.query(sql,function(error, result){
           if(error) throw error;
           else callback(null, result);
         });
       }
     })
  }
}

//obtener listado de actividades por fecha
actModel.getActividadesFecha = function(desde,hasta,callback)
{
  if (connection){
     sql="select * from Actividad where fecha>='"+
     desde +"' and fecha<='"+ hasta +"'";
     console.log("consultar fecha actividad concreta:"+sql)
     connection.query(sql,function(error, result){
       if(error) throw error;
       else callback(null, result);
     });
  }
}

module.exports = actModel;
