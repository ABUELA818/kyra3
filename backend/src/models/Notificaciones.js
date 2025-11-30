const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Notificaciones', {
    ID_Notificacion: {
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
    Tipo_Noti: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Detalles: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    Visto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Notificaciones',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Notificaciones_pkey",
        unique: true,
        fields: [
          { name: "ID_Notificacion" },
        ]
      },
    ]
  });
};
