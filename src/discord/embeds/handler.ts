import type {
    EventPayloadMap,
    User,
    WebhookEvent,
    WebhookEventName
} from "@octokit/webhooks-types"
import type { APIEmbed } from "discord-api-types/v10"

import { formatters } from "../../data/format.js"
import { Resolvers } from "../../data/resolve.js"
import { DiscordEmbedColors } from "./colors.js"

export interface BaseEmbedCreateOptions<T extends WebhookEventName> {
    name: Extract<WebhookEventName, T>
    saturation: number
    filterEvents: boolean
}

export type DefaultEmbedCreateOptions = BaseEmbedCreateOptions<WebhookEventName>

// Event embed options

/**@deprecated */
export type IssuesEmbedCreateOptions = BaseEmbedCreateOptions<'issues' | 'issue_comment'>

/**@deprecated */
export type PullRequestEmbedCreateOptions = BaseEmbedCreateOptions<
    | 'pull_request'
    | 'pull_request_review'
    | 'pull_request_review_comment'
    | 'pull_request_review_thread'
>

/**@deprecated */
export type PushEmbedCreateOptions = BaseEmbedCreateOptions<'push'>
/**@deprecated */
export type PushCommentEmbedCreateOptions = BaseEmbedCreateOptions<'commit_comment'>

/**@deprecated */
export type PingEmbedCreateOptions = BaseEmbedCreateOptions<'ping'>

/**@deprecated */
export type BranchEmbedCreateOptions = BaseEmbedCreateOptions<'create' | 'delete'>

/**@deprecated */
export type DiscussionEmbedCreateOptions = BaseEmbedCreateOptions<'discussion'>
/**@deprecated */
export type DiscussionCommentEmbedCreateOptions = BaseEmbedCreateOptions<'discussion_comment'>

/**@deprecated */
export type ForkEmbedCreateOptions = BaseEmbedCreateOptions<'fork'>

/**@deprecated */
export type ReleaseEmbedCreateOptions = BaseEmbedCreateOptions<'release'>

/**@deprecated */
export type StarEmbedCreateOptions = BaseEmbedCreateOptions<'star'>

// Handler

export type EmbedHandler<
    E extends WebhookEvent,
    O extends BaseEmbedCreateOptions<any>
    > = (event: E, options: O) => APIEmbed[] | undefined

export type EmbedHandlerEvent<T extends WebhookEventName> = EmbedHandler<
    EventPayloadMap[T],
    BaseEmbedCreateOptions<T>
>

export const CombinedHandlerKeys = {
    alert: ['code_scanning_alert', 'repository_vulnerability_alert'],
    branch: ['create', 'delete'],
    check: ['check_suite', 'check_run'],
    deployment: ['deployment_status'],
    issues: ['issue_comment'],
    pull_request: [
        'pull_request_review',
        'pull_request_review_comment',
        'pull_request_review_thread'
    ],
    star: ['watch'],
    team: ['team_add']
} as const

// TODO: do not include group event names
export const SupportedHandlerKeyNames = [
    'alert',
    'branch',
    'branch_protection_rule',
    'check',
    'commit_comment',
    'deploy_key',
    'deployment',
    'discussion',
    'discussion_comment',
    'fork',
    'gollum',
    'issues',
    'ping',
    'pull_request',
    'public',
    'push',
    'release',
    'repository',
    'repository_import',
    'sponsorship',
    'star',
    'status',
    'team',
    'workflow_job',
] as const

/** @deprecated */
export type SupportEmbedHandlerKeys = typeof SupportedHandlerKeyNames[number]

export type SupportedEmbedHandlerKeys = typeof SupportedHandlerKeyNames[number]

type TypedCombinedHandlerKeys = {
    [P in keyof typeof CombinedHandlerKeys]: (P extends WebhookEventName ? P : never) | typeof CombinedHandlerKeys[P][number]
}

type EmbedHandlerEventNames<T extends string> = T extends keyof TypedCombinedHandlerKeys ? TypedCombinedHandlerKeys[T] : T

export type SupportedEventNames = EmbedHandlerEventNames<SupportedEmbedHandlerKeys>

const t: SupportedEventNames = 'code_scanning_alert'
export type EmbedHandlers = {
    [K in SupportedEmbedHandlerKeys]: EmbedHandlerEvent<EmbedHandlerEventNames<K>>
} & {
    /** @deprecated */
    pushComment: EmbedHandlerEvent<'commit_comment'>
    /** @deprecated */
    discussionComment: EmbedHandlerEvent<'discussion_comment'>
    /** @deprecated */
    pullRequest: EmbedHandlerEvent<
        | 'pull_request'
        | 'pull_request_review'
        | 'pull_request_review_comment'
        | 'pull_request_review_thread'
    >
}

// Embed

export const EmbedTitle = new class EmbedTitle {
    public formatters = formatters

    /** @deprecated */
    public format(input: string) {
        return this.formatters.capitalize(input)
    }

    /** @deprecated */
    public formatAction(action: string) {
        return this.formatters.action(action)
    }

    /** @deprecated */
    public formatCommitId(id: string) {
        return this.formatters.commitId(id)
    }

    /** @deprecated */
    public formatRef(ref: string) {
        return this.formatters.ref(ref)
    }

    public fork(repository: string, fork: string) {
        return `[${repository}] Fork created: ${fork}`
    }

    public push(repository: string, commits: number) {
        return `[${repository}] ${commits} new commit${commits === 1 ? '' : 's'}`
    }

    public forcePush(ref: string, id: string) {
        return `**Branch ${ref} was force-pushed to \`${id.slice(0, 7)}\`**`
    }

    public pullRequest(repository: string, pr: { title: string, action: string, number: number, name: WebhookEventName }) {
        const review = pr.name === 'pull_request_review' ? 'review ' : ''

        const actionTitle = ['pull_request', 'pull_request_review'].includes(pr.name)
            ? `Pull request ${review}${pr.action}: #${pr.number} ${pr.title}`
            : pr.name === 'pull_request_review_comment'
                ? this.comment(repository, {
                    action: pr.action,
                    type: 'review',
                    on: `pull request #${pr.number}: ${pr.title}`
                })
                : `Pull request review thread ${pr.action}: #${pr.number} ${pr.title}`

        return `[${repository}] ${actionTitle}`
    }

    public branch(repository: string, branch: { name: string, action: string, type: string }) {
        const prefix = branch.action === 'create' ? ' New' : ''
        return `[${repository}]${prefix} ${branch.type} ${branch.action}: ${branch.name}`
    }

    public discussion(repository: string, discussion: { action: string, number: number, title: string }) {
        const { action, number, title } = discussion
        const actionTitle = action === 'answered'
            ? `Discussion #${number} marked answered`
            : action === 'created'
                ? `New discussion #${number}`
                : `Discussion #${number} ${action}`

        return `[${repository}] ${actionTitle}: ${title}`
    }

    public comment(repository: string, comment: { action: string, type?: string, on: string }) {
        const action = this.format(comment.action === 'created' ? 'new' : comment.action)
        return `[${repository}] ${action} ${comment.type ?? ''} comment on ${comment.on}`
    }
}

/**
 * Internal embed builder
 */
export class Embed {
    public embed: APIEmbed

    constructor (sender: User) {
        this.embed = {
            author: {
                name: sender.login,
                icon_url: sender.avatar_url,
                url: sender.url
            }
        }
    }

    public static Title = EmbedTitle

    public setColor (...options: Parameters<typeof DiscordEmbedColors['resolveColor']>) {
        const color = DiscordEmbedColors.resolveColor(...options)
        this.embed.color = color

        return this
    }

    public setDescription (body?: string | null, limit?: number) {
        this.embed.description = Resolvers.body(body, limit ?? 500)

        return this
    }

    public setTitle (title: string) {
        this.embed.title = title

        return this
    }

    public setActionTitle (...options: Parameters<typeof EmbedTitle['formatters']['actionTitle']>) {
        const title = EmbedTitle.formatters.actionTitle(...options)

        return this.setTitle(title)
    }

    public setUrl (url: string | null | undefined) {
        if (url) this.embed.url = url

        return this
    }
}

export * from './colors.js'
export * from '../events.js'
export type { APIEmbed }
