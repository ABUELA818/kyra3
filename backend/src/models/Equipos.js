const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Equipos', {
    ID_Equipo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre_Equipo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    ID_Usuario_Creador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Equipos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Equipos_pkey",
        unique: true,
        fields: [
          { name: "ID_Equipo" },
        ]
      },
    ]
  });
};
