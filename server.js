require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Reporte = require('./models/Reporte');
const authRoutes = require('./routes/auth');
const reporteRoutes = require('./routes/reportes');
const usuariosRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// CONFIGURACIÓN DE CORS SEGURA
// =======================================================

// Obtiene la URL del Front-end desde las variables de entorno (http://localhost:3001)
const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir solicitudes sin origen (como clientes REST, Postman o curl)
        if (!origin) return callback(null, true); 

        // 1. Verificar si el origen está en la lista blanca
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // 2. Bloquear si el origen no está permitido
            callback(new Error(`No permitido por CORS. Origen: ${origin}`), false); 
        }
    },
    // Permitir los métodos HTTP que usas en tu API
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    // Permitir cookies y encabezados de autenticación
    credentials: true, 
};

// Aplicar el middleware CORS con las opciones seguras
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/usuarios', usuariosRoutes);
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada y lista.');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });