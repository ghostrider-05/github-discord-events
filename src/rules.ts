import type { EventPayloadMap, WebhookEventName, WebhookEvent } from "@octokit/webhooks-types"
import type { APIEmbed, Snowflake, RESTGetAPIWebhookWithTokenResult } from "discord-api-types/v9"
import type { WebhookClientData } from "discord.js"

import type { DiscordWebhookMessage } from "./discord/webhook.js"

import type { GitHubLabelData, GitHubMileStoneData, GitHubEventActions } from "./github.js"

export interface TransformedGitHubEventData<T extends WebhookEventName = WebhookEventName> {
    embeds?: APIEmbed[]
    event: GitHubEventPayload<T>
}

type GitHubEventPayload<T extends string> = T extends WebhookEventName
    ? EventPayloadMap[T]
    : WebhookEvent

export type GitHubEventPayloadFilters =
    | 'name'
    | 'actions'
    | 'branches'
    | 'labels'
    | 'milestone'
    | 'repos'
    | 'tags'
    // Custom filters
    | 'filter'
    | 'replacedFilter'
    | GitHubCustomEventRuleFilters

export type GitHubCustomEventRuleFilters =
    | 'pass'
    | 'skip'

export interface GitHubEventRule<T extends WebhookEventName = WebhookEventName> {
    /**
     * The name of the event to apply these filters to
     */
    name: T

    // GitHub

    /**
     * Only pass when a speficied action is executed.
     */
    actions?: GitHubEventActions<T>[]

    /**
     * Only allow events from these branches.
     * Specify the branch name.
     */
    branches?: string[]

    /**
     * Only pass this rule when the action has all the specified labels.
     * If this event has no labels attached (e.g. issue comment), the event will pass this option.
     */
    labels?: GitHubLabelData[]

    /**
     * Only pass if the action is associated with the milestone.
     */
    milestone?: GitHubMileStoneData

    /**
     * For organization / user webhooks, only pass events from these repositories.
     */
    repos?: string[]

    /**
     * Only pass if one of these tags is present on the event
     */
    tags?: string[]

    // Discord

    /**
     * The webhook data to execute the event
     */
    webhook?: WebhookClientData

    /**
     * The saturation factor for the embed color.
     * A float between 0 and 1
     */
    saturation?: number

    /**
     * If provided, post the event to the thread with this id if 
     */
    threadId?: Snowflake

    /**
     * waits for server confirmation of message send before response
     */
    wait?: boolean

    // Other

    // TODO: what happens to a filter for a label when a ci assigns a label after creating?
    //waitInterval?: number

    /**
     * Whether to skip this rule and continue with other event rules / the main rule.
     */
    pass?: boolean | ((event: GitHubEventPayload<T>) => boolean)

    /**
     * Whether to skip this event. 
     * If skipped on any rule, the event will not continue (also not on the main rule).
     */
    skip?: boolean | ((event: GitHubEventPayload<T>) => boolean)

    /**
     * Add a custom filter to this rule.
     * Acts as the other filters on the rule.
     */
    addFilter?: (event: GitHubEventPayload<T>) => boolean

    /**
     * Add a custom filter. If this filter returns a boolean, 
     * this result will be used as the final check for this rule (and ignores all other filters).
     * 
     * If this filter returns undefined, this filter will be skipped
     * and the results of the other filters will count.
     */
    addReplacingFilter?: (event: GitHubEventPayload<T>) => boolean | undefined

    /**
     * Transform the embed that would be sent to Discord
     * @param event The incoming event payload
     * @param defaultEmbeds The default Discord embeds for this event
     */
    transformEmbed?: (event: GitHubEventPayload<T>, defaultEmbeds?: APIEmbed[]) => APIEmbed[] | undefined

    /**
     * Transform / add more data to the webhook message
     * @param event The incoming event payload
     * @param defaultEmbeds The default Discord (or transformed) embeds for this event
     */
    transformMessage?: (event: GitHubEventPayload<T>, defaultEmbeds?: APIEmbed[]) => DiscordWebhookMessage | undefined

    // Lifecycle

    /**
     * Called when the current rule is checked.
     * @param event The incoming event payload
     * @param rule The current rule, not present when the rule is not an event rule
     */
    onCheck?: (event: WebhookEvent, rule?: GitHubEventRule<T>) => void

    /**
     * Called when the current rule is triggered and passes all filters.
     * @param event The incoming event payload
     * @param rule The current rule, not present when the rule is not an event rule
     */
    onTrigger?: (event: WebhookEvent, rule?: GitHubEventRule<T>) => void

    /**
     * Called when the current rule did not pass the filters.
     * @param filter The name of the filter that failed
     * @param event The incoming event payload
     * @param rule The current rule, not present when the rule is not an event rule
     */
    onFailed?: (filter: GitHubEventPayloadFilters, event: GitHubEventPayload<T>, rule?: GitHubEventRule<T>) => void

    // onTransform?: (type: 'message' | 'embed', output: DiscordWebhookMessage | APIEmbed[]) => void
}

export interface GitHubEventRulesConfig extends Omit<GitHubEventRule & {
    webhook: WebhookClientData
}, 'name' | GitHubCustomEventRuleFilters> {
    // GitHub

    /**
     * Filter incoming webhooks by their event name.
     * Each event can have their own specified filters.
     * If no filters are set on the event, the global filters will be used as a fallback.
     */
    events?: GitHubEventRule[]

    // TODO: what to do with form uploads?
    /**
     * Called when a rule is triggered and before the webhook message is sent to Discord.
     * @param event The incoming event payload
     * @param webhook If fetched succesfully, the webhook structure
     * @param rule The passed rule, not present when the rule is not an event rule
     */
    onBeforeActivated?: (payload: DiscordWebhookMessage, webhook?: RESTGetAPIWebhookWithTokenResult, rule?: GitHubEventRule) => Promise<void> | void
}
