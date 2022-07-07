import type { WebhookEventName, WebhookEvent } from "@octokit/webhooks-types"

import type { DiscordWebhookUser } from "../discord/webhook.js"
import type { GitHubEventRulesConfig, GitHubEventRule } from "../rules.js"

export type GitHubEventFilter =
    | 'default'
    | 'all'

export interface GitHubEventManagerResponseOptions {
    /**
     * Include the payload in the response body
     * @deprecated
     * @default true
     */
    includePayload?: boolean

    /**
     * The values (specified by their keys) to include in the response body.
     * Keys:
     * - payload: the event payload
     * @default []
     */
    includeKeys?: ('payload')[]
}

export interface GitHubEventManagerOptions {
    /**
     * The rules to use for filtering / sending events.
     */
    rules: GitHubEventRulesConfig
    /**
     * The Discord API version to use for webhook requests.
     * @default 10
     */
    apiVersion?: number
    /**
     * The webhook user to use for posting messages. Defaults to the GitHub profile
     */
    user?: DiscordWebhookUser
    /**
     * Filter for the incoming webhook events.
     * - default: only pass events that would be sent with a normal webhook
     * - all: continue with all incoming events
     * @default 'default'
     */
    filter?: GitHubEventFilter
    /**
     * For the `onBeforeActivated` hook, determine how often the Discord API 
     * will be used to fetch information about the webhook.
     * Options:
     * - all: fetch after every passed rule
     * - stored: only fetch when the webhook has not been fetched before. Does not update after this call.
     * - never: never fetch, `webhook` param will be the client data
     * @default 'never'
     */
    fetchWebhook?: 'all' | 'stored' | 'never'
    /**
     * Options for the response of the event handler
     */
    response?: GitHubEventManagerResponseOptions

    // Improves relative links like #42
    // Check autolinks
    //enhanceMarkdown?: boolean
}

export interface EventResponseMetadata {
    name: WebhookEventName
    action: string | undefined
    guid: string
    payload: WebhookEvent | undefined
    signature: string | null
}

export interface EventResponseBody {
    /**
     * Whether the event is completed
     */
    completed: boolean
    /**
     * The data associated with the event
     */
    data?: EventResponseMetadata
    /**
     * If failed, a human readable error message
     */
    message?: string
    /**
     * If completed and the event is passed by an event rule, the event rule that passed the event.
     */
    rule?: GitHubEventRule
}
