const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Archivo', {
    ID_Archivo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_Equipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Equipos',
        key: 'ID_Equipo'
      }
    },
    'ID_Dueño': {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Nombre_Archivo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    'Tamaño_Archivo': {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    Tipo_Archivo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ID_Carpeta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Carpetas',
        key: 'ID_Carpeta'
      }
    },
    Fecha_Subida: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    StorageKey: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Ruta: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ""
    }
  }, {
    sequelize,
    tableName: 'Archivo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Archivo_pkey",
        unique: true,
        fields: [
          { name: "ID_Archivo" },
        ]
      },
    ]
  });
};
