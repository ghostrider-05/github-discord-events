import type { GitHubResponse } from "./response";
import type { GitHubEventManagerOptions } from "./options.js"

type ResponseOptions = (options: GitHubEventManagerOptions['response']) => Parameters<typeof GitHubResponse['createManager']>

export const responseOptions: ResponseOptions = (options) => [
    {
        'invalid': (data, rule) => [{
            statusText: 'Received invalid GitHub webhook event',
            status: 500,
            completed: false,
            event: undefined
        }],
        'unknown': (data, rule) => [{
            status: 404,
            statusText: 'Received GitHub event, but no rules matched',
            data,
            completed: false,
            event: undefined
        }],
        'unverified': (data, rule) => [{
            statusText: 'Received unverified GitHub webhook event',
            status: 500,
            completed: false,
            event: undefined,
            data
        }],
        'complete': (data, rule, complete) => [{
            statusText: 'Completed GitHub event',
            completed: complete ?? true,
            data,
            rule,
            event: undefined
        }]
    }, options?.includePayload ?? true
]
