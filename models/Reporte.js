const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Reporte = sequelize.define('Reporte', {
  nombrePlaga: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  latitud: { type: DataTypes.FLOAT, allowNull: false },
  longitud: { type: DataTypes.FLOAT, allowNull: false },
  fotoURL: { type: DataTypes.STRING, allowNull: true },
  //nueva implementacion al modelo para asignacion de personal
  estado: { 
  // Incluimos 'Asignado' para el flujo administrativo
  type: DataTypes.ENUM('Pendiente', 'Asignado', 'En Proceso', 'Solucionado'), 
  defaultValue: 'Pendiente',
  allowNull: false // El reporte siempre debe tener un estado
  },
  asignadoA: {
  type: DataTypes.STRING, 
  allowNull: true // Opcional, solo se llena cuando el administrador lo asigna
  }
});

Reporte.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = Reporte;