# Backend "Delilah Restó", App de pedidos de comida Trabajo #3 del curso de Desarrollo Web Full Stack de Acámica.

Recursos y tecnologías utilizadas Node.js Nodemon Express JWT para autenticación via Token MySQL Sequelize Postman para manejo de endpoints y testing Swagger para documentación de API El objetivo del trabajo es generar el backend de una app de pedidos de comida llamada Delilah Restó, generando la arquitectura, bases de datos relacionales, endpoints funcionales y documentación.

- Documentación de la API Abrir el archivo swagger.yaml y copiar su contenido en Swagger o importar el mismo desde las opciones

- Se listarán los endpoints y métodos disponibles y la información necesaria para hacer uso de los mismos

Instalación e inicializacion del proyecto 
- 1 Clonar proyecto Desde la consola con el siguiente link:

git clone https://github.com/RockStoneStudios/Proyecto3.git .

- 2 - Instalación de dependencias npm install 
- 3 - Creando base de datos Abrir XAMPP y asegurarse que el puerto sobre el cual se está ejecutando es el 3306 Inicializar los servicios de Apache y MySQL Abrir el panel de control del servicio MySQL Generar una nueva base de datos llamada delilah-resto desde el panel de control
- 4 - Iniciando el servidor Desde la terminal poner el siguiente comando : npm start
- 5 - para cargar Usuarios-Iniciales ve a Postman y en (Post) http://localhost:3000/cargarUsuarios
- 6 - luego logueate en postman en (Post) http://localhost:3000/usuario/login con el admin = {
    "email" : "RockStoneStudios666@gmail.com",
    "password" : "3508436568Omar"
}
- 7 - luego carga Productos-Iniciales en Postman y en (Post) http://localhost:3000/cargarProductos
- 8 - luego de estos pasos para crear pedido  (Post) direccion : http://localhost:3000/pedido en el body por ejemplo  "ProductoId" : [1,2], "cantidad" :[1,1] , "metodo_pago" :"Efectivo" 
  

- 5 - Listo para usar! Testear los endpoints provistos desde postman para poder hacer uso de la API y base de datos generadas

