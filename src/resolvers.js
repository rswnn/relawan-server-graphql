const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;
const resolvers = {
  Query: {
    async user(root, { id }, { models }) {
      return models.User.findByPk(id);
    },
    async allRelawan(root, args, { models }) {
      return models.Relawan.findAll();
    },
    async relawan(root, { id }, { models }) {
      return models.Relawan.findByPk(id);
    },
    async hello(root) {
      return "hello";
    },
  },
  Mutation: {
    async registerUser(root, { name, email, password }, { models }) {
      const user = await models.User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return models.User.create({
          name,
          email,
          password: await bcrypt.hash(password, 10),
        }).then((res) => "REGISTER_SUCCESS");
      } else {
        throw new Error("sudah digunakan");
      }
    },
    async loginUser(root, { email, password }, { models }) {
      const user = await models.User.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return "NO_USER_WITH_EMAIL";
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return "INCORRECT_PASSWORD";
      }
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
    },
    async createRelawan(root, { name, city, email, skill }, { models, auth }) {
      const user = await getUser(auth);
      const userId = user.id;
      if (user) {
        try {
          return models.Relawan.create({ userId, name, city, email, skill });
        } catch (error) {
          throw new Error(err);
        }
      }
    },
    async updateRelawan(
      root,
      { id, name, city, email, skill },
      { models, auth }
    ) {
      const user = await getUser(auth);
      if (user) {
        return models.Relawan.update(
          {
            name,
            city,
            email,
            skill,
          },
          {
            where: {
              id: id,
            },
          }
        );
      }
    },
    async deleteRelawan(root, { id }, { models, auth }) {
      const user = await getUser(auth);
      if (user) {
        return models.Relawan.destroy({
          where: {
            id: id,
          },
        });
      }
    },
  },
  User: {
    async relawan(user) {
      return user.getRelawans();
    },
  },
  Relawan: {
    async user(relawan) {
      return relawan.getUser();
    },
  },
};

const getUser = async (auth) => {
  if (!auth) throw new AuthenticationError("you must be logged in!");

  const token = auth.split("Bearer ")[1];
  if (!token) throw new AuthenticationError("you should provide a token!");

  const user = await jsonwebtoken.verify(token, SECRET, (err, decoded) => {
    if (err) throw new AuthenticationError("invalid token!");
    return decoded;
  });
  return user;
};

module.exports = resolvers;
