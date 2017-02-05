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
                // User.belongsTo(models.Group, {
                //     foreignKey: {
                //         allowNull: false
                //     }
                // });
                User.belongsToMany(models.Post, {
                    // as: "member",
                    through:
                        models.UserPost


                    // foreignKey: {
                    //     name: "userId",
                    //     allowNull: false
                    // },
                    // constraints: false
                });
            }
        }
    }, {
        timestamps: true
    });
    return User;
};