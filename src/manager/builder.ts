import type { WebhookEventName } from "@octokit/webhooks-types"

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
