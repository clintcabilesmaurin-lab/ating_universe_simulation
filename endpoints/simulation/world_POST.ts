import superjson from "superjson";
import { publish } from "@floot/realtime";
import { db } from "../../helpers/db";
import type { InputType, OutputType } from "./world_POST.schema";

export async function handle(request: Request): Promise<Response> {
  try {
    const input = superjson.parse<InputType>(await request.text());
    if (!input.sessionId || !["living-room", "music-room"].includes(input.world)) {
      return new Response(superjson.stringify({ error: "Invalid world state." }), { status: 400 });
    }

    const currentActivity =
      input.world === "music-room"
        ? "Walking into Music World"
        : "Settling into the Living Room";

    const updated = await db.updateTable("simulationSessions")
      .set({
        world: input.world,
        currentActivity,
        updatedAt: new Date(),
      })
      .where("sessionId", "=", input.sessionId)
      .returning(["sessionId", "world"])
      .executeTakeFirst();

    if (!updated) {
      return new Response(superjson.stringify({ error: "Simulation session not found." }), { status: 404 });
    }

    const output: OutputType = {
      sessionId: updated.sessionId,
      world: updated.world as InputType["world"],
      currentActivity,
    };

    await publish("simulation:main", {
      type: "simulation.world",
      ...output,
    });

    return new Response(superjson.stringify(output), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(superjson.stringify({
      error: error instanceof Error ? error.message : "World update failed.",
    }), { status: 502 });
  }
}