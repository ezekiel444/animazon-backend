// dev-server.js - LOCAL DEVELOPMENT ONLY
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import db from './db.js';
import typeDefs from './schema.js';
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import Animal from "./resolvers/Animal.js";
import Category from "./resolvers/Category.js";

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ 
  typeDefs, 
  resolvers: {
    Query,
    Mutation,
    Animal,
    Category
  }
});

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async () => ({
    mainCards: db.mainCards,
    animals: db.animals,
    categories: db.categories
  })
});

console.log(`🚀 Server ready at ${url}`);
