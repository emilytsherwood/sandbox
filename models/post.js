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
        // We're saying that we want our Author to have Posts
        classMethods: {
            associate: function (models) {
                // When we delete an Author, we'll also delete their Posts "cascade"
                // An Author (foreignKey) is required or a Post can't be made
                // Post.belongsTo(models.User);
                Post.belongsTo(models.User, {
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    }, {
        timestamps: false
    });
    return Post;
};