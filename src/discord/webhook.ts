import type {
    RESTPostAPIWebhookWithTokenJSONBody,
    RESTPostAPIWebhookWithTokenQuery,
    RESTGetAPIWebhookWithTokenResult
} from "discord-api-types/v10"
import type {
    WebhookClientData,
    WebhookClientDataIdWithToken,
    WebhookMessageOptions
} from "discord.js"

import { Resolvers } from "../data/resolve.js"

export type DiscordWebhookUser = Required<Pick<
    WebhookMessageOptions,
    | 'username'
    | 'avatarURL'
>>

export type DiscordWebhookMessage = Omit<
    RESTPostAPIWebhookWithTokenJSONBody,
    | 'attachments'
    | 'thread_name'
    | 'username'
    | 'avatar_url'
>

type DiscordWebhookData = WebhookClientData & {
    version: number
}

export const WebhookStorage = new class WebhookDataStorageManager {
    public fetchedWebhooks: Record<string, RESTGetAPIWebhookWithTokenResult | undefined> = {}
    public action: 'all' | 'stored' | 'never' = 'never'

    public setAction(action?: 'all' | 'stored' | 'never') {
        if (!action) return this

        this.action = action

        return this
    }

    public hasId(id: string) {
        return id in this.fetchedWebhooks
    }

    public resolveId(id: string) {
        return this.fetchedWebhooks[id]
    }

    public storeId(id: string, data: RESTGetAPIWebhookWithTokenResult | undefined) {
        this.fetchedWebhooks[id] = data

        return this
    }
}

export class WebhookManager {
    public webhook: WebhookClientData
    public version: number

    constructor(data: DiscordWebhookData) {
        const { version, ...webhook } = data

        this.version = version
        this.webhook = webhook
    }

    private parseUrl() {
        const url = 'url' in this.webhook ? this.webhook.url : undefined

        const matches = url?.match(
            /https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i
        )

        if (!matches) return undefined
        const [, id, token] = matches.map(n => n);

        (this.webhook as WebhookClientDataIdWithToken).id = id;
        (this.webhook as WebhookClientDataIdWithToken).token = token
    }

    public get id() {
        if (!('id' in this.webhook)) this.parseUrl()

        return (this.webhook as WebhookClientDataIdWithToken).id
    }

    public get data() {
        return {
            version: this.version,
            ...this.webhook
        }
    }

    public url(query?: any) {
        return Resolvers.webhook(this.webhook, query, this.version)
    }

    public async get() {
        const id = this.id
        const action = WebhookStorage.action;

        if (action === 'never') {
            return WebhookStorage.resolveId(id)

        } else if (action === 'stored' && WebhookStorage.hasId(id)) {
            return WebhookStorage.resolveId(id)

        } else {
            const webhook = await this.fetch()

            WebhookStorage.storeId(id, webhook)

            return webhook
        }
    }

    public async fetch() {
        return await fetch(this.url({}), {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()) as RESTGetAPIWebhookWithTokenResult | undefined
    }

    public async post(
        body: RESTPostAPIWebhookWithTokenJSONBody,
        options: RESTPostAPIWebhookWithTokenQuery
    ) {
        const url = this.url(options)
        if (!body.content && !body.embeds) {
            throw new Error('Cannot send empty embed: ' + JSON.stringify(body))
        }

        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}
