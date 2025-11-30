const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MiembrosEquipos', {
    ID_Equipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Equipos',
        key: 'ID_Equipo'
      }
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Rol_equipo: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "Miembro"
    }
  }, {
    sequelize,
    tableName: 'MiembrosEquipos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "MiembrosEquipos_pkey",
        unique: true,
        fields: [
          { name: "ID_Equipo" },
          { name: "ID_Usuario" },
        ]
      },
    ]
  });
};
