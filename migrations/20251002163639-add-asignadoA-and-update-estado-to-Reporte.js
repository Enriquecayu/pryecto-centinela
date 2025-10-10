'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Añadir la nueva columna 'asignadoA' (el nombre del personal/equipo)
    await queryInterface.addColumn('Reportes', 'asignadoA', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null // Los reportes existentes tendrán NULL
    });

    // 2. Modificar la columna 'estado' para incluir el nuevo valor 'Asignado'
    // Esto es crucial para el flujo de trabajo del administrador.
    await queryInterface.changeColumn('Reportes', 'estado', {
      type: Sequelize.ENUM('Pendiente', 'Asignado', 'En Proceso', 'Solucionado'),
      defaultValue: 'Pendiente',
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // 1. Eliminar la columna 'asignadoA' si se revierte la migración
    await queryInterface.removeColumn('Reportes', 'asignadoA');
    
    // 2. Revertir el ENUM de 'estado' a su valor original (quitando 'Asignado')
    await queryInterface.changeColumn('Reportes', 'estado', {
      type: Sequelize.ENUM('Pendiente', 'En Proceso', 'Solucionado'),
      defaultValue: 'Pendiente',
      allowNull: false,
    });
  }
};