const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Usuario_Conversacion', {
    ID_Conversacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Conversaciones',
        key: 'ID_Conversacion'
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
    LastReadAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Usuario_Conversacion',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Usuario_Conversacion_pkey",
        unique: true,
        fields: [
          { name: "ID_Conversacion" },
          { name: "ID_Usuario" },
        ]
      },
    ]
  });
};
