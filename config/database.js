const { Sequelize } = require('sequelize');

// --- INICIO DE CAMBIO ---
// 1. Cargamos dotenv SOLO si no estamos en producción (o si no existe la URL de la DB)
// En Railway (producción), la URL ya viene inyectada y no necesitamos dotenv.
if (!process.env.DATABASE_URL) {
    require('dotenv').config();
}

// 2. Definimos la URL de conexión, asegurando que use la de Railway o la de respaldo.
const dbUrl = process.env.DATABASE_URL;
// --- FIN DE CAMBIO ---

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Desactiva los logs de SQL en la consola
});

module.exports = sequelize;