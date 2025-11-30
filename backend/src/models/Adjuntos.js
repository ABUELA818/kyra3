const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Adjuntos', {
    ID_Adjunto: {
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
    ID_Archivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Archivo',
        key: 'ID_Archivo'
      }
    },
    Subido_Por: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Tipo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Adjuntos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Adjuntos_pkey",
        unique: true,
        fields: [
          { name: "ID_Adjunto" },
        ]
      },
    ]
  });
};
