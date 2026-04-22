require('dotenv').config(); 

module.exports = {
  // Configuración para el entorno de desarrollo
  development: {
    url: process.env.DATABASE_URL, 
    dialect: 'postgres', // Especificamos tu motor de base de datos
    
    // Configuraciones de CLI para el registro de migraciones
    seederStorage: "sequelize", 
    seederStorageTableName: "SequelizeData",
    logging: false
  },
  // Puedes añadir configuraciones para 'production' y 'test' aquí
};