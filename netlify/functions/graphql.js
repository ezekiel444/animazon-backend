// netlify/functions/graphql.js - NETLIFY PRODUCTION ONLY
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';
import db from '../../db.js';
import typeDefs from '../../schema.js';
import Query from "../../resolvers/Query.js";
import Mutation from "../../resolvers/Mutation.js";
import Animal from "../../resolvers/Animal.js";
import Category from "../../resolvers/Category.js";

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Animal,
    Category
  }
});

const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  {
    context: async (request) => ({
      // Your DB data—loaded once per cold start (efficient for Netlify)
      mainCards: db.mainCards,
      animals: db.animals,
      categories: db.categories
      // Add headers/user from request if needed: request.headers, request.user, etc.
    })
  }
);

export default graphqlHandler;  // Netlify expects default export for handler