import { ApolloServer } from 'apollo-server-express';
import { 
    ApolloServerPluginDrainHttpServer, 
    ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';
import { createServer } from 'http';
import express from 'express';
import fs from 'fs';
import {join, dirname } from 'path';
import {fileURLToPath} from 'url';
import prismaClient from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import Query from './resolvers/Query.mjs';
import Mutation from './resolvers/Mutation.mjs';
import Link from './resolvers/Link.mjs';
import User from './resolvers/User.mjs';
import Vote from './resolvers/Vote.mjs';
import Subscription from './resolvers/Subscription.mjs';
import { getUserId } from './utils.mjs';

let subscriptionServer;
const prisma = new prismaClient.PrismaClient();
const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const httpServer = createServer(app)
const schema = makeExecutableSchema({
    typeDefs: fs.readFileSync(join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers
});

async function startApolloServer() {
    const server = new ApolloServer({
        schema,
        context: ({req}) => ({
            ...req,
            prisma,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null
        }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground({
                subscriptionEndpoint: 'ws://localhost:4000/graphql'
            }), 
            {async serverWillStart() {
            return {
                async drainServer() {
                    subscriptionServer.close();
                }
            }
        }}]
    });

    await server.start();

    server.applyMiddleware({
        app,
        path: '/'
    })
}



httpServer.listen(4000,() => {
    console.log(`🚀 Server ready at http://localhost:4000`);

    subscriptionServer = SubscriptionServer.create({
        schema,
        execute,
        subscribe,
        onConnect: (connectionParams) => {
            if (connectionParams.authToken) {
              return {
                prisma,
                pubsub,
                userId: getUserId(
                  null,
                  connectionParams.authToken
                )
              };
            } else {
              return {
                prisma,
                pubsub
              };
            }
          }
    },{   
        server: httpServer,
        path: '/graphql'
    })

})


startApolloServer()
