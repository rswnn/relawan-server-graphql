const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const models = require("../models");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the authorization from the request headers
    // return a context obj with our token. if any!
    const auth = req.headers.authorization || "";
    return {
      auth,
      models,
    };
  },
});

server
  .listen()
  .then(({ url }) => console.log("Server is running on localhost:4000"));
