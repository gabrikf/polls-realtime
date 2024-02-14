import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";
import { redis } from "../../lib/redis";
import { votingPubSub } from "../../utilts/voting-pub-sub";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/vote", async (request, reply) => {
    const voteOnPollBody = z.object({
      optionId: z.string().uuid(),
    });
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });
    const { optionId } = voteOnPollBody.parse(request.body);
    const { pollId } = voteOnPollParams.parse(request.params);
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
          },
        },
      },
    });
    if (!poll) {
      return reply.status(404).send({ error: "Poll not found" });
    }
    const option = poll.options.find((option) => option.id === optionId);
    if (!option) {
      return reply.status(404).send({ error: "Option not found" });
    }

    let sessionId = request.cookies.voted;

    if (sessionId) {
      const vote = await prisma.vote.findUniqueOrThrow({
        where: {
          sessionId_pollId: {
            sessionId: sessionId.split(".")[0],
            pollId,
          },
        },
      });
      if (vote.pollOptionId === optionId) {
        return reply.status(400).send({ error: "You have already voted" });
      } else {
        const votes = await redis.zincrby(pollId, -1, vote.pollOptionId);
        votingPubSub.publish(pollId, {
          pollOptionId: vote.pollOptionId,
          votes: Number(votes),
        });
        await prisma.vote.delete({
          where: {
            id: vote.id,
          },
        });
      }
    }
    sessionId = randomUUID();
    await prisma.vote.create({
      data: {
        pollOptionId: optionId,
        sessionId,
        pollId,
      },
    });

    const votes = await redis.zincrby(pollId, 1, optionId);

    votingPubSub.publish(pollId, {
      pollOptionId: optionId,
      votes: Number(votes),
    });

    reply.setCookie("voted", sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week,
      signed: true,
      httpOnly: true,
    });
    reply.status(201).send();
  });
}
