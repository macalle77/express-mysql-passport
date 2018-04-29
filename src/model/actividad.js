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

//Obtener un listado con información de los participantes que no están apuntados
actModel.obtenerEstadoParticipantesPendientes = function(actividad,callback){
	if(connection){
	sql="select * from listadoEstadosUsuarios where dni not in (select dni from listadoEstadosUsuarios where id_actividad="+connection.escape(actividad)+") group by dni"
	console.log("SQl"+sql);
		connection.query(sql,function(error,result){
			if(error) callback(error,null)
			else {
					callback(null,result);
			}
		})
	}
}

//Obtener un listado con información de los participantes de una actividad
actModel.obtenerEstadoParticipantes = function(actividad,callback){
	if(connection){
	sql="select * from listadoEstadosUsuarios where id_actividad="+connection.escape(actividad)
		connection.query(sql,function(error,result){
			if(error) callback(error,null)
			else {
					console.log("SQl"+sql);
					callback(null,result);
			}
		})
	}
}

//comprobar si usuario esta apuntado a una actividad ó no
/*actModel.comprobarEstadoActividad = function(partData,actData,callback){
	if(connection){
		sql='SELECT * from Participantes WHERE id_usuario='+connection.escape(partData)+
		' AND id_actividad='+connection.escape(actData)
		connection.query(sql,function(error,result){
			if(error) callback(error,null)
			else {
				if(result.length>0){
					console.log("SQl"+sql);
					callback(null,true);
				}
				else callback(null,false);
			}
		})
	}
}*/


/*actModel.comprobarEstadoActividad = function(partData,actData){
	if(connection){
		sql='SELECT * from Participantes WHERE id_usuario= '+connection.escape(partData)+
		'AND id_actividad='+connection.escape(actData)
		var valor=(function(){
			connection.query(sql,function(error,result){
				if(error) throw error
				else {
					if(result.length>0) return false;
					else return true;
				}
			})
		})()
		console.log("valor desde funcion:"+valor())
		return valor;
	}
}*/

//confirmar pago de usuario de la actividad actividad
actModel.firmarActividad = function(partData,actData,callback){
	if(connection){
		sql="SELECT firmado from Participantes where id_actividad=" +
		connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
		console.log("Firmar actividad:"+sql)
		connection.query(sql,function(error, result){
			if(error) throw error;
			else{
			console.log("Valor d firmado:"+result[0].firmado)
				if(result[0].firmado==1)
					sql1="UPDATE Participantes SET firmado=0 WHERE id_actividad="+
					connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
				else{
					sql1="UPDATE Participantes SET firmado=1 WHERE id_actividad="+
					connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
				}
				connection.query(sql1,function(error, result){
					if(error) throw error
					else {
						callback(null, {"updateId" : result});
					}
				})
			}
		})
	}
}

//confirmar pago de usuario de la actividad actividad
actModel.confirmarPagoActividad = function(partData,actData,callback){
	if(connection){
		sql="SELECT pagado from Participantes where id_actividad=" +
		connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
		connection.query(sql,function(error, result){
			if(error) throw error;
			else{
			console.log("Valor d pagado:"+result[0].pagado)
				if(result[0].pagado==1)
					sql1="UPDATE Participantes SET pagado=0 WHERE id_actividad="+
					connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
				else{
					sql1="UPDATE Participantes SET pagado=1 WHERE id_actividad="+
					connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
				}
				connection.query(sql1,function(error, result){
					if(error) throw error
					else {
						callback(null, {"updateId" : result});
					}
				})
			}
		})
	}
}

//dar de baja usuario de una Actividad
actModel.darBajaActividad = function(partData,actData,callback){
	if(connection){
		sql="DELETE FROM Participantes WHERE id_actividad=" +
		connection.escape(actData)+" AND id_usuario=" +	connection.escape(partData)
		console.log("consulta borrar de actividad:"+sql)
		connection.query(sql,function(error, result){
			if(error)	callback(error,null);
			else callback(null,{"borrarId" : result});
		})
	}
}

//asignar actividad a usuario desde secretaria
actModel.apuntarActividad = function(partData,actData,callback){
	if(connection){
		sql='INSERT INTO Participantes (id_actividad, id_usuario) VALUES (' +
		connection.escape(actData)+','+
		connection.escape(partData)+')'
		console.log("consulta apuntar a actividad:"+sql)
		connection.query(sql,function(error, result){
			if(error)	callback(error,null);
			else callback(null,{"insertId" : result});
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
     fecha_actual +"'and fin_actividad>='"+ fecha_actual+"'";
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

module.exports = actModel;
