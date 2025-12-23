// netlify/functions/graphql.js - NETLIFY PRODUCTION ONLY
import { ApolloServer } from '@apollo/server';
import { netlifyHandler } from '@as-integrations/netlify-functions';
import db from '../db.js';
import typeDefs from '../schema.js';
import Query from "../resolvers/Query.js";
import Mutation from "../resolvers/Mutation.js";
import Animal from "../resolvers/Animal.js";
import Category from "../resolvers/Category.js";

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Animal,
    Category
  }
});

export default netlifyHandler(server, {
  context: () => ({
    mainCards: db.mainCards,
    animals: db.animals,
    categories: db.categories
  })
});
