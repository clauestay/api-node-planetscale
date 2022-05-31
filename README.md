# api-node-planetscale
Proyecto en Node/Express para api con datos almacenados en una base de datos MySQL en PlanetScale.

como usar.

- clonar repositorio.
- instalar las dependencias: 
npm install
- crear archivo .env para conexion a bd.
DB_USER
DB_PASSWORD
DB_HOST
DB_DATABASE

o puede crear una bd MySQL en https://planetscale.com/
y agregar la conexion en su archivo .env
DATABASE_URL='string entregado por planetscale'

- ejecutar seed.js para crear las tablas y poblar la base de datos.
npm run seed

finalmente, correr la aplicación.
npm run dev

endpoints
/
/characters
/characters/:id
/wands
/wands/:id

