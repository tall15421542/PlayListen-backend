require('dotenv').config()
import cors from 'cors';
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import db from './models/index'
import schema from './schema/index'
import resolvers from './resolvers/index'

var model = new db()

const app = express();
app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        model: model
    },
});

server.applyMiddleware({app, path: '/graphql'});
app.listen({port: 8000}, () => {
   console.log('Apollo Server on http://localhost:8000/graphql');
});
