import type { WebhookEventName, WebhookEvent } from "@octokit/webhooks-types"

import { defaultWebhookUser } from "../data/Constants.js"
import { Resolvers } from "../data/resolve.js"
import { DiscordWebhookEmbed } from "../discord/embed.js"
import { DiscordWebhookUser, WebhookStorage, WebhookManager } from "../discord/webhook.js"
import { checkGitHubRules } from "../filter.js"

import { RuleBuilder } from "./builder.js"

import type { 
    GitHubEventFilter, 
    GitHubEventManagerOptions, 
    EventResponseBody, 
    EventResponseMetadata 
} from "./options.js"
import type { GitHubEventRulesConfig } from "../rules.js"

export class GitHubEventManager {
    /**
     * The configured rules for this manager
     */
    public rules: GitHubEventRulesConfig
    /**
     * The webhook user to use when sending the webhook event
     */
    public webhookUser: DiscordWebhookUser
    /**
     * The filter for webhook events
     */
    public filter: GitHubEventFilter

    /**
     * The Discord API version to use
     * @default 9
     */
    public readonly apiVersion: number

    /**
     * Validate incoming webhook requests with a configured secret.
     * This function is not yet implemented to ensure that the crypto will work on every platform.
     * See the example with the 'crypto' module
     * @param request The incoming 
     * @param key The signature key with the request
     * @example
     * ```js
     * manager.validateEvent: (request, key) => {
     *      if (!key) return false // Disallow non-secret hook
            const sig = Buffer.from(key, 'utf8')
            const hmac = crypto.createHmac('sha256', process.env.SECRET)
            const digest = Buffer.from('sha256' + '=' + hmac.update(request.body).digest('hex'), 'utf8')
            if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
                return console.log(`Request body digest (${digest}) did not match webhook (${sig})`)
            }
     * }
     * ```
     */
    public validateEvent?: (request: Request, key: string | null) => boolean = undefined

    constructor (options: GitHubEventManagerOptions) {
        this.rules = options.rules instanceof RuleBuilder ? options.rules.toJSON() : options.rules
        this.webhookUser = options.user ?? defaultWebhookUser
        this.filter = options.filter ?? 'default'

        this.apiVersion = options.apiVersion ?? 9

        WebhookStorage.setAction(options.fetchWebhook)
    }

    private getResponse (options: { status: number, statusText: string } & EventResponseBody) {
        const { status, statusText, ...body } = options

        return new Response(JSON.stringify(body), {
            status,
            statusText,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    /**
     * Get the webhook data from an incoming webhook request
     * @param request The incoming request
     */
    public async getRequestMetadata (request: Request): Promise<EventResponseMetadata | undefined> {
        const name = request.headers.get('X-GitHub-Event') as WebhookEventName
        const guid = request.headers.get('X-GitHub-Delivery')!
        const signature = request.headers.get('X-Hub-Signature-256')
        const event = await request.json() as WebhookEvent

        if (!name || !event) return undefined

        return {
            name,
            guid,
            payload: event,
            action: 'action' in event ? event.action : undefined,
            signature
        }
    }

    /**
     * Handle an incoming request (via https, proxy, etc.) and perform actions based on the rules.
     * Use lifecycle hooks to add custom actions.
     * @param request The incoming request from your server
     * @returns The response whether the request was handled succesfully.
     * The response will contain the appropiate status and status text with a human readable summary / error.
     * The response body will contain a JSON object ({@link EventResponseBody}) with a more detailed response.
     */
    public async handleEvent (request: Request) {
        const data = await this.getRequestMetadata(request)
        // const data = await this._validateEvent(request)
        if (!data) return this.getResponse({
            statusText: 'Received invalid github webhook event',
            status: 500,
            completed: false,
            event: undefined
        })

        const verified = this.validateEvent?.(request, data.signature) ?? true
        if (!verified) return this.getResponse({
            statusText: 'Received unverified github webhook event',
            status: 500,
            completed: false,
            event: data.payload,
            metaData: data
        })

        const { payload: event, name } = data
        const rule = checkGitHubRules({
            event,
            filterEvents: this.filter === 'default',
            rules: this.rules,
            name
        })

        if (rule) {
            const defaultEmbed = DiscordWebhookEmbed.resolveEmbed(event, {
                name,
                saturation: rule.saturation ?? 1,
                filterEvents: this.filter === 'default'
            })

            const embeds = rule.transformEmbed?.(event, defaultEmbed) ?? defaultEmbed
            const message = rule.transformMessage?.(event, embeds) ?? (embeds ? { embeds } : {})

            const messageData = Resolvers.message(message, this.webhookUser)
            const webhook = rule.webhook ?? this.rules.webhook
            const webhookManager = new WebhookManager({
                version: this.apiVersion,
                ...webhook
            })

            if (this.rules.onBeforeActivated != undefined) {
                const webhookData = await webhookManager.get()
                await this.rules.onBeforeActivated(message, webhookData, 'name' in rule ? rule : undefined)
            }

            const completed = await webhookManager.post(messageData, {
                thread_id: rule.threadId,
                wait: rule.wait
            }).then(res => res.ok)

            return this.getResponse({
                status: completed ? 200 : 500,
                statusText: 'Completed GitHub event',
                completed: true,
                metaData: data,
                event,
                eventName: name,
                action: 'action' in event ? event.action : undefined
            })

        } else return this.getResponse({
            status: 404,
            statusText: 'Received GitHub event, but no rules matched',
            event,
            metaData: data,
            eventName: name,
            completed: false
        })
    }
}

export * from './builder.js'
export * from './options.js'
