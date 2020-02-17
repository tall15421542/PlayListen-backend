require('dotenv-flow').config()
import cors from 'cors';
import express from 'express';
import {ApolloServer, gql} from 'apollo-server-express';
import db from './models/index'
import { schema, resolvers } from './schema/index'
import jwt from 'jsonwebtoken'
import session from 'express-session'
import { Auth } from './auth/index'
import bodyParser from 'body-parser'
import path from 'path'
import passport from 'passport'

var model = new db()
passport.serializeUser((user, done) => {
  console.log("serial")
  if(user.userId) done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  console.log("deserial")
  const user = await model.user.getById(userId)
  done(null, user);
});

const app = express();
app.use('/static', express.static(path.join(__dirname, 'public')))
// parse application/x-www-form-urlencoded
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(session({
  secret: 'secret',
    saveUninitialized: true,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', Auth);

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async({req}) => {
        const token = req.headers['x-token']
        if(token){
            const me = await jwt.decode(token, process.env.TOKEN_SECRET);
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
