import { WebhookEventName, WebhookEvent } from "@octokit/webhooks-types"

import { EventResponseBody, EventResponseMetadata } from "./options.js"

type KeyResponse = ((
        data?: EventResponseBody['data'],
        rule?: EventResponseBody['rule'],
        completed?: boolean
    ) => ConstructorParameters<typeof GitHubResponse>);

export type ResponseCreateManager<T extends string> = ((key: T, ...args: Parameters<KeyResponse>) => Response);

export type RequestGitHubData = EventResponseMetadata & { payload: WebhookEvent } | undefined

export class GitHubResponse {
    init: ResponseInit;
    options: {
        completed: boolean
        message: string
        data?: EventResponseBody['data']
        rule?: EventResponseBody['rule']
    }

    constructor (options: {
        status?: number
        statusText: string
    } & EventResponseBody) {
        const { status, statusText, data, completed, rule, message } = options

        this.init = {
            status: status ?? (completed ? 200 : 500),
            statusText,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        this.options = {
            completed,
            rule,
            message: message ?? statusText,
            data
        }
    }

    private _data (includePayload: boolean) {
        const { completed, data, message, rule } = this.options
        const { payload, ...event } = data ?? {}
    
        const eventData = 'name' in event ? {
            ...event,
            payload: includePayload ?  payload! : undefined
        } : undefined

        const output = completed ? {
            ...(rule ? { rule: { ...rule } } : {}),
            ...eventData
        } : { message }

        return {
            completed,
            ...output
        }
    }

    public createResponse (includePayload: boolean) {
        const message = this._data(includePayload)

        return new Response(JSON.stringify(message, null, 4), this.init)
    }

    public static createManager <T extends string>(keys: Record<T, KeyResponse>, includePayload: boolean) {
        return function (key: T, ...args: Parameters<KeyResponse>) {
            const options = keys[key](...args)

            return new GitHubResponse(...options).createResponse(includePayload)
        }
    }

    public static async getRequestData (request: Request): Promise<RequestGitHubData> {
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
}
