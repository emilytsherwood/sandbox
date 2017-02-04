USE sandbox_db;

INSERT INTO Users (user_name) VALUES ('Mr.ONE');
INSERT INTO Posts (body, UserId) VALUES ('I have this wonderful idea for an app', 1);
INSERT INTO Posts (body, UserId) VALUES ('I want to build a Sequelize DB with someone', 1);

INSERT INTO Users (user_name) VALUES ('Mrs.TWO');
INSERT INTO Posts (body, UserId) VALUES ('I create a shopping list app', 2);


INSERT INTO Posts (body, UserId) VALUES ('I create a boolean', 2);