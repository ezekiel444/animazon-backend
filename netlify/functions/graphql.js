import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Handler } from '@netlify/functions';

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

// Lazy init (cold start friendly)
let serverStarted = false;

export const handler: Handler = async (event, context) => {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }

  const body = event.body ? JSON.parse(event.body) : {};

  const response = await server.executeOperation(
    {
      query: body.query,
      variables: body.variables,
      operationName: body.operationName,
    },
    {
      contextValue: {
        mainCards: db.mainCards,
        animals: db.animals,
        categories: db.categories
      }
    }
  );

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(response.body.singleResult)
  };
};
