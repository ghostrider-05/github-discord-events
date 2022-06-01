import type { WebhookEvent } from "@octokit/webhooks-types"

import { handlers } from './embeds/export.js'
import {
    CombinedHandlerKeys,
    DefaultEmbedCreateOptions,
    DiscordEmbedColors,
    EmbedTitle
} from "./embeds/handler.js"

export class DiscordWebhookEmbed {
    public static defaultEmbeds = handlers
    public static defaultTitles = EmbedTitle

    public static embedColor = DiscordEmbedColors

    public static resolveEmbed(event: WebhookEvent, options: DefaultEmbedCreateOptions) {
        const key = (Object.keys(CombinedHandlerKeys).find(key => {
            const events = CombinedHandlerKeys[key as keyof typeof CombinedHandlerKeys]

            return events.includes(<never>options.name)
        }) ?? Object.keys(handlers).find(key => key === options.name)) as keyof typeof handlers | undefined

        //@ts-ignore TODO: remove
        const embeds = key ? handlers[key](<never>event, <never>options) : undefined;

        return embeds
    }

    /**
     * Get the url for a GitHub embed image preview
     * @param path the relative path: https://github.com/{path} \
     * Examples:
     * - issues: org/repo/issues/1
     * - repo: user/repo
     */
    public static embedImage(path: string) {
        const hash = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 20);

        return `https://opengraph.githubassets.com/${hash}/${path}`
    }
}
