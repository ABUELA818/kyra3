const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Asignaciones', {
    ID_Asignacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Titulo_Asignacion: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    'Descripción_Asignacion': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Prioridad: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Estado_Asignacion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    Fecha_Entrega: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ID_Proyecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Proyectos',
        key: 'ID_Proyecto'
      }
    },
    Creado_Por: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    }
  }, {
    sequelize,
    tableName: 'Asignaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Asignaciones_pkey",
        unique: true,
        fields: [
          { name: "ID_Asignacion" },
        ]
      },
    ]
  });
};
