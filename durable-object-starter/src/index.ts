import { DurableObject } from "cloudflare:workers";

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

/** A Durable Object's behavior is defined in an exported Javascript class */
export class DumbExample extends DurableObject<Env> {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * The Durable Object exposes an RPC method sayHello which will be invoked when a Durable
	 *  Object instance receives a request from a Worker via the same method invocation on the stub
	 *
	 * @param name - The name provided to a Durable Object instance from a Worker
	 * @returns The greeting to be sent back to the Worker
	 */
	async sayHelloAndDate(name: string, hits: number): Promise<string> {
		const today = new Intl.DateTimeFormat("en-US", {
			dateStyle: "long",
			timeZone: "America/New_York"
		}).format(new Date());
		return `Hello, ${name}! Today's date is ${today} and you have already visited us ${hits} times.`;
	}

	async hits(): Promise<number> {
		let hits = (await this.ctx.storage.get<number>("hits")) ?? 0;
		hits += 1;
		await this.ctx.storage.put("hits", hits);
		return hits;
	}
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/favicon.ico") {
			return new Response(null, { status: 404 });
		}
		const name = url.searchParams.get("name")?.trim() || "world";
		const stub = env.DUMB_EXAMPLE.getByName(name);
		const hits = await stub.hits()
		const greeting = await stub.sayHelloAndDate(name, hits);
		return new Response(greeting);
	},
} satisfies ExportedHandler<Env>;
