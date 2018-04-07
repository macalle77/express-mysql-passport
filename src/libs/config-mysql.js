//llamamos al paquete mysql que hemos instalado
var mysql = require('mysql')
//creamos la conexion a nuestra base de datos con los datos de acceso de cada uno

let db;

module.exports = function Connection() {

  if (!db) {

		db = mysql.createConnection(
			{
				host : '192.168.56.102',
				user : 'miguel',
				password :'miguel',
				database : 'prueba'
			}
		);
		connection.connect();
  }
	console.log('Datos conexión' + db);

  return db;
}
