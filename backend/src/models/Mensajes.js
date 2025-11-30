const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Mensajes', {
    ID_Mensaje: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_Conversacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Conversaciones',
        key: 'ID_Conversacion'
      }
    },
    Enviado_A: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    },
    Mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Fecha_Envio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Mensajes',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Mensajes_pkey",
        unique: true,
        fields: [
          { name: "ID_Mensaje" },
        ]
      },
    ]
  });
};
