
import { createServer,createPubSub } from '@graphql-yoga/node'

// Create a new instance
const pubsub = createPubSub();

const messages = [];
const subscribers = [];

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    text: String!  
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, text: String!): ID!
  }

  type Subscription {
    messages: [Message!]
  }
`;

const resolvers = {
  Query: {
    messages: () => messages
  },
  Mutation: {
    postMessage: (parent,args, context, info) => {
      const { user, text } = args;
      const id = messages.length;
      messages.push({ id, user, text });
      subscribers.forEach(fn => fn());
      return id;
    }
  },
  Subscription: {
    messages: (parent, args, context, info) => {
      const { pubsub } = context;

      // Creating a channel with random number
      const channel = Math.random().toString().slice(2, 15);

      // 
      onMessageUpdate(() => pubsub.publish(channel, { messages }));

      // Publish all the messages once the user subscribes to the channel
      setTimeout(() => pubsub.publish(channel, { messages }), 0);

      // return the async iterator
      return context.subscribe(channel);
    }
  }
}

const server = new createServer({
  schema: {
    typeDefs,
    resolvers, 
    context: {
      pubsub
    }
  }
});

server.start(({port}) => {
  console.log(`Server started on http://localhost:${port}`);
});
