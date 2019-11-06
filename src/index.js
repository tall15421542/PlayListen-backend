require('dotenv').config()
import cors from 'cors';
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import db from './models/index'
import schema from './schema/index'
import resolvers from './resolvers/index'
import jwt from 'jsonwebtoken'

var model = new db()

const app = express();
app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async({req}) => {
        const token = req.headers['x-token']
        if(token){
            const me = await jwt.verify(token, process.env.TOKEN_SECRET);
            return{
                me: me, 
                model: model
            }
        }
        return {model}
    }, 
});

server.applyMiddleware({app, path: '/graphql'});
app.listen({port: 8000}, () => {
   console.log('Apollo Server on http://localhost:8000/graphql');
});
