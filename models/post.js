module.exports = function (sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            len: [2]
        }
    }, {
        classMethods: {
            associate: function (models) {
                Post.belongsToMany(models.User, {
                    // as: "content",
                    through: models.UserPost
                        // foreignKey: "postId",
                        // constraints: false
                });
            }
        }
    }, {
        timestamps: false
    });
    return Post;
};