import type { WebhookEventName, WebhookEvent } from "@octokit/webhooks-types"

import type { DiscordWebhookUser } from "../discord/webhook.js"
import type { GitHubEventRulesConfig, GitHubEventRule } from "../rules.js"

export type GitHubEventFilter =
    | 'default'
    | 'all'

export interface GitHubEventManagerOptions {
    /**
     * The rules to use for filtering / sending events.
     */
    rules: GitHubEventRulesConfig
    /**
     * The Discord api version to use for webhook requests.
     * @default 9
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
     * For the `onBeforeActivated` hook, determine how often the Discord api 
     * will be used to fetch information about the webhook.
     * Options:
     * - all: fetch after every passed rule
     * - stored: only fetch when the webhook has not been fetched before. Does not update after this call.
     * - never: never fetch, `webhook` param will be the client data
     * @default 'never'
     */
    fetchWebhook?: 'all' | 'stored' | 'never'

    // Improves relative links like #42
    // Check autolinks
    //enhanceMarkdown?: boolean
}

export interface EventResponseMetadata {
    name: WebhookEventName
    action: string | undefined
    guid: string
    payload: WebhookEvent
    signature: string | null
}

export interface EventResponseBody {
    completed: boolean
    /**@deprecated */
    event: WebhookEvent | undefined
    /**@deprecated */
    action?: string
    rule?: GitHubEventRule
    /**@deprecated */
    eventName?: string
    metaData?: EventResponseMetadata
}
