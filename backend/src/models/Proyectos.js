const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Proyectos', {
    ID_Proyecto: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre_Proyecto: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    'Descripción_Proyecto': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Estado_Proyecto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Fecha_Inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Fecha_Termino: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ID_Equipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Equipos',
        key: 'ID_Equipo'
      }
    },
    ID_Usuario_Creador: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Usuarios',
        key: 'ID_Usuario'
      }
    }
  }, {
    sequelize,
    tableName: 'Proyectos',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Proyectos_pkey",
        unique: true,
        fields: [
          { name: "ID_Proyecto" },
        ]
      },
    ]
  });
};
