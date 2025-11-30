const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('UsuariosAsignados', {
    ID_Asignacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Asignaciones',
        key: 'ID_Asignacion'
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
    }
  }, {
    sequelize,
    tableName: 'UsuariosAsignados',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "UsuariosAsignados_pkey",
        unique: true,
        fields: [
          { name: "ID_Asignacion" },
          { name: "ID_Usuario" },
        ]
      },
    ]
  });
};
