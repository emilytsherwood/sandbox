module.exports = function (sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3-140]
            }
        },
        groupLimit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        capacity: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        authorEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2]
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
        timestamps: true
    });
    return Post;
};