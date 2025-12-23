import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNetlifyFunction } from '@as-integrations/netlify';
import db from '../db.js';
import typeDefs from '../schema.js';
import Query from "../resolvers/Query.js";
import Mutation from "../resolvers/Mutation.js";
import Animal from "../resolvers/Animal.js";
import Category from "../resolvers/Category.js";

// Create Apollo Server instance (same as before)
const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Animal,
    Category
  },
  introspection: true, // Enable GraphQL playground
});

// Create the Netlify Function handler with context
const handler = startServerAndCreateNetlifyFunction(
  server,
  {
    context: async () => ({
      mainCards: db.mainCards,
      animals: db.animals,
      categories: db.categories
    })
  }
);

export { handler };