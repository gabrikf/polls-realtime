import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, reply) => {
    const getPollParam = z.object({
      pollId: z.string().uuid(),
    });
    const { pollId } = getPollParam.parse(request.params);
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    if (!poll) {
      return reply.status(404).send({ error: "Poll not found" });
    }
    const votes = await redis.zrange(pollId, 0, -1, "WITHSCORES");

    const options = votes.reduce((acc, vote, index) => {
      if (index % 2 === 0) {
        const score = votes[index + 1];

        Object.assign(acc, { [vote]: Number(score) });
      }
      return acc;
    }, {} as Record<string, number>);

    const pollWithVotes = {
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        votes: options[option.id] || 0,
      })),
    };

    reply.status(200).send({ pollWithVotes });
  });
}
