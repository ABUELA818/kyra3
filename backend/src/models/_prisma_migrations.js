const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('_prisma_migrations', {
    id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    checksum: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    migration_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    logs: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rolled_back_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now')
    },
    applied_steps_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: '_prisma_migrations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "_prisma_migrations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
