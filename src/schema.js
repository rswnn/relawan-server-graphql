const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    relawan: [Relawan!]!
  }

  type Relawan {
    id: Int!
    name: String!
    city: String!
    email: String!
    skill: String!
    user: User!
  }

  type Query {
    user(id: Int!): User
    allRelawan: [Relawan!]!
    relawan(id: Int!): Relawan
    hello: String
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): String!
    loginUser(email: String!, password: String!): String!
    createRelawan(
      name: String!
      city: String!
      email: String!
      skill: String!
    ): Relawan!
    updateRelawan(
      id: Int!
      name: String!
      city: String!
      email: String!
      skill: String!
    ): [Int!]!
    deleteRelawan(id: Int!): Int!
  }
`;

module.exports = typeDefs;
