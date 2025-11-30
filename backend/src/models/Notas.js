const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Notas', {
    ID_Nota: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_Usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Contenido_Nota: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Notas',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Notas_pkey",
        unique: true,
        fields: [
          { name: "ID_Nota" },
        ]
      },
    ]
  });
};
