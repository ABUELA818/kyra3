var DataTypes = require("sequelize").DataTypes;
var _Adjuntos = require("./Adjuntos");
var _Archivo = require("./Archivo");
var _Asignaciones = require("./Asignaciones");
var _Carpetas = require("./Carpetas");
var _Conversaciones = require("./Conversaciones");
var _Equipos = require("./Equipos");
var _Favoritos = require("./Favoritos");
var _Historial_Asignacion = require("./Historial_Asignacion");
var _Mensajes = require("./Mensajes");
var _MiembrosEquipos = require("./MiembrosEquipos");
var _Notas = require("./Notas");
var _Notificaciones = require("./Notificaciones");
var _Proyectos = require("./Proyectos");
var _Roles = require("./Roles");
var _Usuario_Conversacion = require("./Usuario_Conversacion");
var _Usuarios = require("./Usuarios");
var _UsuariosAsignados = require("./UsuariosAsignados");
var __prisma_migrations = require("./_prisma_migrations");

function initModels(sequelize) {
  var Adjuntos = _Adjuntos(sequelize, DataTypes);
  var Archivo = _Archivo(sequelize, DataTypes);
  var Asignaciones = _Asignaciones(sequelize, DataTypes);
  var Carpetas = _Carpetas(sequelize, DataTypes);
  var Conversaciones = _Conversaciones(sequelize, DataTypes);
  var Equipos = _Equipos(sequelize, DataTypes);
  var Favoritos = _Favoritos(sequelize, DataTypes);
  var Historial_Asignacion = _Historial_Asignacion(sequelize, DataTypes);
  var Mensajes = _Mensajes(sequelize, DataTypes);
  var MiembrosEquipos = _MiembrosEquipos(sequelize, DataTypes);
  var Notas = _Notas(sequelize, DataTypes);
  var Notificaciones = _Notificaciones(sequelize, DataTypes);
  var Proyectos = _Proyectos(sequelize, DataTypes);
  var Roles = _Roles(sequelize, DataTypes);
  var Usuario_Conversacion = _Usuario_Conversacion(sequelize, DataTypes);
  var Usuarios = _Usuarios(sequelize, DataTypes);
  var UsuariosAsignados = _UsuariosAsignados(sequelize, DataTypes);
  var _prisma_migrations = __prisma_migrations(sequelize, DataTypes);

  Archivo.belongsToMany(Usuarios, { as: 'ID_Usuario_Usuarios', through: Favoritos, foreignKey: "ID_Archivo", otherKey: "ID_Usuario" });
  Asignaciones.belongsToMany(Usuarios, { as: 'ID_Usuario_Usuarios_UsuariosAsignados', through: UsuariosAsignados, foreignKey: "ID_Asignacion", otherKey: "ID_Usuario" });
  Conversaciones.belongsToMany(Usuarios, { as: 'ID_Usuario_Usuarios_Usuario_Conversacions', through: Usuario_Conversacion, foreignKey: "ID_Conversacion", otherKey: "ID_Usuario" });
  Equipos.belongsToMany(Usuarios, { as: 'ID_Usuario_Usuarios_MiembrosEquipos', through: MiembrosEquipos, foreignKey: "ID_Equipo", otherKey: "ID_Usuario" });
  Usuarios.belongsToMany(Archivo, { as: 'ID_Archivo_Archivos', through: Favoritos, foreignKey: "ID_Usuario", otherKey: "ID_Archivo" });
  Usuarios.belongsToMany(Asignaciones, { as: 'ID_Asignacion_Asignaciones', through: UsuariosAsignados, foreignKey: "ID_Usuario", otherKey: "ID_Asignacion" });
  Usuarios.belongsToMany(Conversaciones, { as: 'ID_Conversacion_Conversaciones', through: Usuario_Conversacion, foreignKey: "ID_Usuario", otherKey: "ID_Conversacion" });
  Usuarios.belongsToMany(Equipos, { as: 'ID_Equipo_Equipos', through: MiembrosEquipos, foreignKey: "ID_Usuario", otherKey: "ID_Equipo" });
  Adjuntos.belongsTo(Archivo, { as: "ID_Archivo_Archivo", foreignKey: "ID_Archivo"});
  Archivo.hasMany(Adjuntos, { as: "Adjuntos", foreignKey: "ID_Archivo"});
  Favoritos.belongsTo(Archivo, { as: "ID_Archivo_Archivo", foreignKey: "ID_Archivo"});
  Archivo.hasMany(Favoritos, { as: "Favoritos", foreignKey: "ID_Archivo"});
  Adjuntos.belongsTo(Asignaciones, { as: "ID_Asignacion_Asignacione", foreignKey: "ID_Asignacion"});
  Asignaciones.hasMany(Adjuntos, { as: "Adjuntos", foreignKey: "ID_Asignacion"});
  Historial_Asignacion.belongsTo(Asignaciones, { as: "ID_Asignacion_Asignacione", foreignKey: "ID_Asignacion"});
  Asignaciones.hasMany(Historial_Asignacion, { as: "Historial_Asignacions", foreignKey: "ID_Asignacion"});
  UsuariosAsignados.belongsTo(Asignaciones, { as: "ID_Asignacion_Asignacione", foreignKey: "ID_Asignacion"});
  Asignaciones.hasMany(UsuariosAsignados, { as: "UsuariosAsignados", foreignKey: "ID_Asignacion"});
  Archivo.belongsTo(Carpetas, { as: "ID_Carpeta_Carpeta", foreignKey: "ID_Carpeta"});
  Carpetas.hasMany(Archivo, { as: "Archivos", foreignKey: "ID_Carpeta"});
  Carpetas.belongsTo(Carpetas, { as: "Carpeta_Origen_Carpeta", foreignKey: "Carpeta_Origen"});
  Carpetas.hasMany(Carpetas, { as: "Carpeta", foreignKey: "Carpeta_Origen"});
  Mensajes.belongsTo(Conversaciones, { as: "ID_Conversacion_Conversacione", foreignKey: "ID_Conversacion"});
  Conversaciones.hasMany(Mensajes, { as: "Mensajes", foreignKey: "ID_Conversacion"});
  Usuario_Conversacion.belongsTo(Conversaciones, { as: "ID_Conversacion_Conversacione", foreignKey: "ID_Conversacion"});
  Conversaciones.hasMany(Usuario_Conversacion, { as: "Usuario_Conversacions", foreignKey: "ID_Conversacion"});
  Archivo.belongsTo(Equipos, { as: "ID_Equipo_Equipo", foreignKey: "ID_Equipo"});
  Equipos.hasMany(Archivo, { as: "Archivos", foreignKey: "ID_Equipo"});
  Carpetas.belongsTo(Equipos, { as: "ID_Equipo_Equipo", foreignKey: "ID_Equipo"});
  Equipos.hasMany(Carpetas, { as: "Carpeta", foreignKey: "ID_Equipo"});
  Conversaciones.belongsTo(Equipos, { as: "ID_Equipo_Equipo", foreignKey: "ID_Equipo"});
  Equipos.hasMany(Conversaciones, { as: "Conversaciones", foreignKey: "ID_Equipo"});
  MiembrosEquipos.belongsTo(Equipos, { as: "ID_Equipo_Equipo", foreignKey: "ID_Equipo"});
  Equipos.hasMany(MiembrosEquipos, { as: "MiembrosEquipos", foreignKey: "ID_Equipo"});
  Proyectos.belongsTo(Equipos, { as: "ID_Equipo_Equipo", foreignKey: "ID_Equipo"});
  Equipos.hasMany(Proyectos, { as: "Proyectos", foreignKey: "ID_Equipo"});
  Asignaciones.belongsTo(Proyectos, { as: "ID_Proyecto_Proyecto", foreignKey: "ID_Proyecto"});
  Proyectos.hasMany(Asignaciones, { as: "Asignaciones", foreignKey: "ID_Proyecto"});
  Usuarios.belongsTo(Roles, { as: "ID_Rol_Role", foreignKey: "ID_Rol"});
  Roles.hasMany(Usuarios, { as: "Usuarios", foreignKey: "ID_Rol"});
  Adjuntos.belongsTo(Usuarios, { as: "Subido_Por_Usuario", foreignKey: "Subido_Por"});
  Usuarios.hasMany(Adjuntos, { as: "Adjuntos", foreignKey: "Subido_Por"});
  Archivo.belongsTo(Usuarios, { as: "ID_Dueño_Usuario", foreignKey: "ID_Dueño"});
  Usuarios.hasMany(Archivo, { as: "Archivos", foreignKey: "ID_Dueño"});
  Asignaciones.belongsTo(Usuarios, { as: "Creado_Por_Usuario", foreignKey: "Creado_Por"});
  Usuarios.hasMany(Asignaciones, { as: "Asignaciones", foreignKey: "Creado_Por"});
  Equipos.belongsTo(Usuarios, { as: "ID_Usuario_Creador_Usuario", foreignKey: "ID_Usuario_Creador"});
  Usuarios.hasMany(Equipos, { as: "Equipos", foreignKey: "ID_Usuario_Creador"});
  Favoritos.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(Favoritos, { as: "Favoritos", foreignKey: "ID_Usuario"});
  Historial_Asignacion.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(Historial_Asignacion, { as: "Historial_Asignacions", foreignKey: "ID_Usuario"});
  Mensajes.belongsTo(Usuarios, { as: "Enviado_A_Usuario", foreignKey: "Enviado_A"});
  Usuarios.hasMany(Mensajes, { as: "Mensajes", foreignKey: "Enviado_A"});
  MiembrosEquipos.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(MiembrosEquipos, { as: "MiembrosEquipos", foreignKey: "ID_Usuario"});
  Notas.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(Notas, { as: "Nota", foreignKey: "ID_Usuario"});
  Notificaciones.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(Notificaciones, { as: "Notificaciones", foreignKey: "ID_Usuario"});
  Proyectos.belongsTo(Usuarios, { as: "ID_Usuario_Creador_Usuario", foreignKey: "ID_Usuario_Creador"});
  Usuarios.hasMany(Proyectos, { as: "Proyectos", foreignKey: "ID_Usuario_Creador"});
  Usuario_Conversacion.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(Usuario_Conversacion, { as: "Usuario_Conversacions", foreignKey: "ID_Usuario"});
  UsuariosAsignados.belongsTo(Usuarios, { as: "ID_Usuario_Usuario", foreignKey: "ID_Usuario"});
  Usuarios.hasMany(UsuariosAsignados, { as: "UsuariosAsignados", foreignKey: "ID_Usuario"});

  return {
    Adjuntos,
    Archivo,
    Asignaciones,
    Carpetas,
    Conversaciones,
    Equipos,
    Favoritos,
    Historial_Asignacion,
    Mensajes,
    MiembrosEquipos,
    Notas,
    Notificaciones,
    Proyectos,
    Roles,
    Usuario_Conversacion,
    Usuarios,
    UsuariosAsignados,
    _prisma_migrations,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
