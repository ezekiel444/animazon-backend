import { ApolloServer } from '@apollo/server';

import db from '../../db.js';
import typeDefs from '../../schema.js';
import Query from '../../resolvers/Query.js';
import Mutation from '../../resolvers/Mutation.js';
import Animal from '../../resolvers/Animal.js';
import Category from '../../resolvers/Category.js';

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Animal,
    Category,
  },
});

// Cold-start safe
let started = false;

// Whitelist your frontend URL
const FRONTEND_URL = "https://animazon.netlify.app";

export async function handler(event) {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': FRONTEND_URL,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (!started) {
    await server.start();
    started = true;
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
        categories: db.categories,
      },
    }
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': FRONTEND_URL,
    },
    body: JSON.stringify(response.body.singleResult),
  };
}
