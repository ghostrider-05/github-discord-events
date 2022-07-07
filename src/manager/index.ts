import { Resolvers } from "../data/resolve.js"
import { defaultWebhookUser } from "../data/Constants.js"
import { DiscordWebhookEmbed } from "../discord/embed.js"
import { DiscordWebhookUser, WebhookStorage, WebhookManager } from "../discord/webhook.js"

import { checkGitHubRules } from "../filter.js"
import { RuleBuilder } from "./builder.js"
import { GitHubResponse, RequestGitHubData, ResponseCreateManager } from "./response.js"
import { responseOptions } from './responseOptions.js'

import type { 
    GitHubEventFilter, 
    GitHubEventManagerOptions, 
} from "./options.js"
import type { 
    GitHubDiscordFinalUploadData, 
    GitHubEventFinalUploadData,
    GitHubEventRulesConfig 
} from "../rules.js"

export type {
    RequestGitHubData,
}

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
     * @default 10
     */
    public readonly apiVersion: number

    /**
     * Validate incoming webhook requests with a configured secret.
     * This function is not yet implemented to ensure that the crypto will work on every platform.
     * See the example with the 'crypto' module
     * @param request The incoming request
     * @param key The signature key with the request
     * @default (request, key) => true
     * @example
     * manager.validateEvent: (request, key) => {
     *      if (!key) return false // Disallow non-secret hook
            const sig = Buffer.from(key, 'utf8')
            const hmac = crypto.createHmac('sha256', process.env.SECRET)
            const digest = Buffer.from('sha256' + '=' + hmac.update(request.body).digest('hex'), 'utf8')
            if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
                return console.log(`Request body digest (${digest}) did not match webhook (${sig})`)
            }
     * }
     */
    public validateEvent?: (request: Request, key: string | null) => boolean = undefined

    private createResponse: ResponseCreateManager<'invalid' | 'unknown' | 'unverified' | 'complete'>

    constructor (options: GitHubEventManagerOptions) {
        this.rules = options.rules instanceof RuleBuilder ? options.rules.toJSON() : options.rules
        this.webhookUser = options.user ?? defaultWebhookUser
        this.filter = options.filter ?? 'default'

        this.apiVersion = options.apiVersion ?? 10

        WebhookStorage.setAction(options.fetchWebhook)

        this.createResponse = GitHubResponse.createManager(...responseOptions(options.response))
    }

    /**
     * Get the webhook data from an incoming webhook request
     * @param request The incoming request
     */
    public async getRequestMetadata (request: Request): Promise<RequestGitHubData> {
        return GitHubResponse.getRequestData(request)
    }

    /**
     * Handle an incoming request (via https, proxy, etc.) and perform actions based on the rules.
     * Use lifecycle hooks to add custom actions.
     * @param request The incoming request from your server
     * @returns The response whether the request was handled successfully.
     * The response will contain the appropriate status and status text with a human readable summary / error.
     * The response body will contain a JSON object ({@link EventResponseBody}) with a more detailed response.
     */
    public async handleEvent (request: Request) {
        const data = await this.getRequestMetadata(request)
        if (!data) return this.createResponse('invalid')

        const verified = this.validateEvent?.(request, data.signature) ?? true
        if (!verified) return this.createResponse('unverified', data)

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

            const messageData = Resolvers.message(message, this.webhookUser, rule.threadName)
            const webhook = rule.webhook ?? this.rules.webhook
            const webhookManager = new WebhookManager({
                version: this.apiVersion,
                ...webhook
            })

            const webhookData = await webhookManager.get()
            const uploadData: [GitHubDiscordFinalUploadData, GitHubEventFinalUploadData] = [
                {  
                    webhook: webhookData,
                    message, 
                },
                {
                    rule,
                    payload: event,
                }
            ]

            if (this.rules.onBeforeActivated != undefined) {
                await this.rules.onBeforeActivated(...uploadData)
            }

            if (rule.hasFilesAttached) {
                const completedFiles = await this.rules.handleFileUploads?.(...uploadData)
                return this.createResponse('complete', data, <never>rule, completedFiles)
            }

            const completed = await webhookManager.post(messageData, {
                thread_id: rule.threadId,
                wait: rule.wait
            }).then(res => res.ok)

            return this.createResponse('complete', data, <never>rule, completed)
        } else {
            return this.createResponse('unknown', data)
        }
    }
}

export * from './builder.js'
export * from './options.js'
