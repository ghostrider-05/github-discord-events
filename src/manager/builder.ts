import type { WebhookEventName } from "@octokit/webhooks-types"
import { Resolvers } from "../data/resolve.js"

import type { GitHubEventRulesConfig, GitHubEventRule } from "../rules.js"

/**
 * Builder for creating filter rules
 */
 export class RuleBuilder {
    /**
     * The created rule configuration
     */
    public rules: GitHubEventRulesConfig

    constructor(webhook: GitHubEventRulesConfig['webhook']) {
        this.rules = {
            webhook
        }
    }

    /**
     * Create a new rule with types
     * @param event The event rule data
     */
    public static event <T extends WebhookEventName>(event: GitHubEventRule<T>): GitHubEventRule {
        return event as unknown as GitHubEventRule // Check workflow_run
    }

    /**
     * Create new event rules with the same rule data.\
     * Intended to use for defining multiple events with the same handlers
     * @param names The event names
     * @param rule The rule data
     */
    public static combineEvents <T extends WebhookEventName>(names: T[], rule: Omit<GitHubEventRule<T>, 'name'>): GitHubEventRule[] {
        return names.map(name => {
            const event = Object.defineProperty(rule, 'name', name) as GitHubEventRule<T>

            return RuleBuilder.event<T>(event)
        })
    }

    public static validateWebhook (webhook: GitHubEventRulesConfig['webhook']) {
        try {
            const url = Resolvers.webhook(webhook, {}, 10)

            return Resolvers.webhookRegex.test(url)
        } catch {
            return false
        }
    }

    /**
     * Set a filter on the main rule
     * @param key The name of filter
     * @param value The new value of the filter
     */
    public setFilter<
        K extends keyof Omit<GitHubEventRulesConfig, 'webhook' | 'events'>
    >(key: K, value: GitHubEventRulesConfig[K]) {
        this.rules[key] = value

        return this
    }

    /**
     * Add an event rule for filtering events on their name
     * @param event The event rule
     */
    public addEvent<T extends WebhookEventName>(event: GitHubEventRule<T>): this {
        this.rules.events ??= []

        this.rules.events.push(<never>event)

        return this
    }

    /**
     * Add multiple event rules for filtering events on their name
     * @param events The event rules
     */
    public addEvents<T extends WebhookEventName>(events: GitHubEventRule<T>[]): this {
        events.forEach(event => this.addEvent(<never>event))

        return this
    }

    /**
     * Returns an object containing the rules
     */
    public toJSON(): GitHubEventRulesConfig {
        return this.rules
    }

    /**
     * String representation of the rules.
     */
    public toString(): string {
        return JSON.stringify(this.toJSON())
    }
}
