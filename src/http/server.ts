import { PrismaClient } from "@prisma/client/extension";
import { create } from "domain";
import fastify from "fastify";
import { z } from "zod";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import fastifyCookie from "@fastify/cookie";
import { voteOnPoll } from "./routes/vote-on-poll";
import fastifyWebsocket from "@fastify/websocket";
import { pollResults } from "./ws/poll-results";

const app = fastify();

app.register(fastifyCookie, {
  secret: "my-secret-opa-opa",
  hook: "onRequest",
});

app.register(fastifyWebsocket);
app.register(pollResults);
app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
