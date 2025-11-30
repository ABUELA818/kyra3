const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Historial_Asignacion', {
    ID_Historial: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_Asignacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Asignaciones',
        key: 'ID_Asignacion'
      }
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Estado_Anterior: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Estado_Nuevo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Fecha_Cambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Historial_Asignacion',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Historial_Asignacion_pkey",
        unique: true,
        fields: [
          { name: "ID_Historial" },
        ]
      },
    ]
  });
};
