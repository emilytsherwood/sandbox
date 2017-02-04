module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2]
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                // Associating Author with Posts
                User.belongsToMany(models.Post,
                  {through: 'Groups'});
            }
        }
    }, {
        timestamps: true
    });
    return User;
};