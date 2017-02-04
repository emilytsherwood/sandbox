module.exports = function (sequelize, DataTypes) {
    var Group = sequelize.define("Group", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
      timestamps: false
    });
    return Group;
};