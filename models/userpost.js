module.exports = function (sequelize, DataTypes) {
    var UserPost = sequelize.define("UserPost", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        // We're saying that we want our Author to have Groups
        classMethods: {
            associate: function (models) {
                // When we delete an Author, we'll also delete their Groups "cascade"
                // An Author (foreignKey) is required or a Group can't be made
                UserPost.belongsTo(models.User, {
                    foreignKey: {
                        name: "groupId",
                        allowNull: true
                    },
                    constraint: false
                });
            }
        }
    }, {
        timestamps: false
    });
    return UserPost;
};