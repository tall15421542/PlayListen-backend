require('dotenv').config()
import cors from 'cors';
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import db from './models/index.js'

var model = new db()


/*
const app = express();
app.use(cors());
const schema = gql`
  type Query {
    users: [User!]
    me: User
    user(id: ID!): User
    messages: [Message!]!
    message(id: ID!): Message!
  }
  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }
  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;
let users = {
  1: {
    id: '1',
    username: 'Robin Wieruch',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Dave Davids',
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return users[id];
    },
    
    users: () => {
      return Object.values(users);
    },

    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },

  User: {
    username: (user) => user.username,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },

  Message: {
    user: message => {
      return users[message.userId];
    },
  }
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({app, path: '/graphql'});
app.listen({port: 8000}, () => {
   console.log('Apollo Server on http://localhost:8000/graphql');
});
*/ 
