const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Carpetas', {
    ID_Carpeta: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_Equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Equipos',
        key: 'ID_Equipo'
      }
    },
    Nombre_Carpeta: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    Carpeta_Origen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Carpetas',
        key: 'ID_Carpeta'
      }
    }
  }, {
    sequelize,
    tableName: 'Carpetas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Carpetas_pkey",
        unique: true,
        fields: [
          { name: "ID_Carpeta" },
        ]
      },
    ]
  });
};
