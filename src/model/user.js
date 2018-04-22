//llamamos al paquete mysql que hemos instalado
var mysql = require('mysql'),
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno
connection = mysql.createConnection(
	{
		host : '192.168.56.102',
		user : 'miguel',
		password :'miguel',
		database : 'prueba'
	}
);

//var connection = require ('../libs/config-mysql');

//creamos un objeto para ir almacenando todo lo que necesitemos
var userModel = {};

//obtenemos todos los usuarios
userModel.getUsers = function(callback)
{
	if (connection)
	{
		connection.query('SELECT * FROM Usuarios ORDER BY nombre', function(error, rows) {
			if(error)
			{
				throw error;
			}
			else
			{
				callback(null, rows);
			}
		});
	}
}

//obtenemos un usuario por su dni
userModel.getUserDni = function(dni,callback)
{
	if (connection)
	{
		var sql = 'SELECT * FROM Usuarios WHERE dni ='+connection.escape(dni);
		connection.query(sql, function(error, rows)
		{
			if(error)
			{
				throw error;
			}
			else
			{
			  console.log("SQL actualización:"+sql+"Resultado:"+rows.length+"nombre"+rows.nombre);

				callback(null, rows);
			}
		});
	}
}

//obtenemos un usuario por su nombre de usuario
userModel.getUserName = function(user,callback)
{
	if (connection)
	{
		var sql = 'SELECT * FROM accesos WHERE username = ' + connection.escape(user);
		connection.query(sql, function(error, row)
		{
			if(error)
			{
				callback(error, row);
			}
			else
			{
				callback(null, row);
			}
		});
	}
}

//obtenemos un usuario por su email
userModel.getUserEmail = function(email,callback)
{
	if (connection)
	{
		var sql = 'SELECT * FROM Usuarios WHERE email = ' + connection.escape(email);
		connection.query(sql, function(error, row)
		{
			if(error)
			{
				callback(error, row);
			}
			else
			{
				callback(null, row);
			}
		});
	}
}


//añadir un nuevo usuario
userModel.insertUser = function(userData,callback)
{
	if (connection)
	{
		connection.query('INSERT INTO Usuarios SET ?', userData, function(error, result)
		{
			if(error)
			{
				callback(error,null);
			}
			else
			{
				//devolvemos la última id insertada
				callback(null,{"insertId" : result.insertId});
			}
		});
	}
}

//actualizar un usuario
userModel.updateUser = function(userData, callback)
{
	//console.log(userData); return;
	if(connection)
	{
		var sql = 'UPDATE Usuarios SET nombre = ' + connection.escape(userData.nombre) + ',' +
		'apellidos = ' + connection.escape(userData.apellidos) + ','+
		'telefono = ' + connection.escape(userData.telefono) + ',' +
		'direccion = ' + connection.escape(userData.direccion) + ',' +
		'email = ' + connection.escape(userData.email) + ',' +
		'perfil = ' + connection.escape(userData.perfil) +
		' WHERE dni = ' + userData.dni;

		console.log('Consulta de actualización:'+sql);

		connection.query(sql, function(error, result)
		{
			if(error)
			{
				callback(error, result);
			}
			else
			{
				callback(null,{"msg":"success"});
			}
		});
	}
}

//eliminar un usuario pasando la id a eliminar
userModel.deleteUser = function(id, callback)
{
	console.log("Valor de id:"+id)
	if(connection)
	{
		var sqlExists = 'SELECT * FROM Usuarios WHERE dni = ' + connection.escape(id);
		connection.query(sqlExists, function(err, row)
		{
			//si existe la id del usuario a eliminar
			if(row)
			{
				console.log("Borrar:"+connection.escape(id));
				var sql = 'DELETE FROM Usuarios WHERE dni = ' + connection.escape(id);
				connection.query(sql, function(error, result)
				{
					if(error)
					{
						throw error;
					}
					else
					{
						callback(null,{"msg":"deleted"});
					}
				});
			}
			else
			{
				console.log("No puede borrar:"+connection.escape(id));
				callback(null,{"msg":"notExist"});
			}
		});
	}
}

//exportamos el objeto para tenerlo disponible en la zona de rutas
module.exports = userModel;
