import { DataTypes } from 'sequelize';

const createUserModel=(sequelize)=>{
  const Usuarios=sequelize.define("Usuarios",{
    ID_Usuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Nombre_Usuario: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    Correo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    Contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ID_Rol: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Roles',
        key: 'ID_Rol'
      }
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    Color: {
      type: DataTypes.STRING(7),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Usuarios',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Usuarios_Correo_key",
        unique: true,
        fields: [
          { name: "Correo" },
        ]
      },
      {
        name: "Usuarios_pkey",
        unique: true,
        fields: [
          { name: "ID_Usuario" },
        ]
      },
    ]
  });

  return Usuarios;
}

export default createUserModel;