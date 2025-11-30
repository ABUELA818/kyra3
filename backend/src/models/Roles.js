const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    ID_Rol: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Rol: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    Nivel: {
      type: DataTypes.SMALLINT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Roles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Roles_pkey",
        unique: true,
        fields: [
          { name: "ID_Rol" },
        ]
      },
    ]
  });
};
