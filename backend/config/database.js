const { Sequelize } = require('sequelize');

// --- Dejamos la lógica para que tome la URL del entorno ---
if (!process.env.DATABASE_URL) {
    require('dotenv').config();
}
const dbUrl = process.env.DATABASE_URL;
// -----------------------------------------------------------

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Desactiva los logs de SQL en la consola
  
  // === AÑADE ESTE BLOQUE PARA FORZAR SSL/TLS ===
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // NECESARIO para que Render acepte la conexión
    }
  }
  // =============================================
});

module.exports = sequelize;