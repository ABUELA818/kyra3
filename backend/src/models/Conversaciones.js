const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Conversaciones', {
    ID_Conversacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre_Conversacion: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    Es_Grupo: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    ID_Equipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Equipos',
        key: 'ID_Equipo'
      }
    }
  }, {
    sequelize,
    tableName: 'Conversaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Conversaciones_pkey",
        unique: true,
        fields: [
          { name: "ID_Conversacion" },
        ]
      },
    ]
  });
};
