import { FastifyInstance } from "fastify";
import z from "zod";
import { votingPubSub } from "../../utilts/voting-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    { websocket: true },
    async (connection, request) => {
      const getPollParam = z.object({
        pollId: z.string().uuid(),
      });
      const { pollId } = getPollParam.parse(request.params);

      votingPubSub.subscribe(pollId, (message) => {
        connection.socket.send(JSON.stringify(message));
      });
    }
  );
}
