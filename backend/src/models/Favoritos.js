const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Favoritos', {
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    ID_Archivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Archivo',
        key: 'ID_Archivo'
      }
    }
  }, {
    sequelize,
    tableName: 'Favoritos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Favoritos_pkey",
        unique: true,
        fields: [
          { name: "ID_Usuario" },
          { name: "ID_Archivo" },
        ]
      },
    ]
  });
};
