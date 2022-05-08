import type {
    CommitCommentEvent,
    CreateEvent,
    DeleteEvent,
    DiscussionCommentEvent,
    DiscussionEvent,
    ForkEvent,
    IssuesEvent,
    PingEvent,
    PullRequestEvent,
    PullRequestReviewCommentEvent,
    PullRequestReviewEvent,
    PullRequestReviewThreadEvent,
    PushEvent,
    ReleaseEvent,
    StarEvent,
    User,
    WebhookEvent,
    WebhookEventName
} from "@octokit/webhooks-types"
import type { APIEmbed } from "discord-api-types/v9"

import { resolveBody } from "../../data/resolve.js"

export interface BaseEmbedCreateOptions<T extends WebhookEventName> {
    name: Extract<WebhookEventName, T>
    saturation: number
    filterEvents: boolean
}

export type DefaultEmbedCreateOptions = BaseEmbedCreateOptions<WebhookEventName>

// Event embed options

export type IssuesEmbedCreateOptions = BaseEmbedCreateOptions<'issues' | 'issue_comment'>

export type PullRequestEmbedCreateOptions = BaseEmbedCreateOptions<
    | 'pull_request'
    | 'pull_request_review'
    | 'pull_request_review_comment'
    | 'pull_request_review_thread'
>

export type PushEmbedCreateOptions = BaseEmbedCreateOptions<'push'>
export type PushCommentEmbedCreateOptions = BaseEmbedCreateOptions<'commit_comment'>

export type PingEmbedCreateOptions = BaseEmbedCreateOptions<'ping'>

export type BranchEmbedCreateOptions = BaseEmbedCreateOptions<'create' | 'delete'>

export type DiscussionEmbedCreateOptions = BaseEmbedCreateOptions<'discussion'>
export type DiscussionCommentEmbedCreateOptions = BaseEmbedCreateOptions<'discussion_comment'>

export type ForkEmbedCreateOptions = BaseEmbedCreateOptions<'fork'>

export type ReleaseEmbedCreateOptions = BaseEmbedCreateOptions<'release'>

export type StarEmbedCreateOptions = BaseEmbedCreateOptions<'star'>

// Handler

export type EmbedHandler<
    E extends WebhookEvent,
    O extends BaseEmbedCreateOptions<any>
    > = (event: E, options: O) => APIEmbed[] | undefined

export type EmbedHandlers = {
    branch: EmbedHandler<CreateEvent | DeleteEvent, BranchEmbedCreateOptions>,
    discussion: EmbedHandler<DiscussionEvent, DiscussionEmbedCreateOptions>,
    discussionComment: EmbedHandler<DiscussionCommentEvent, DiscussionCommentEmbedCreateOptions>,
    fork: EmbedHandler<ForkEvent, ForkEmbedCreateOptions>,
    issues: EmbedHandler<IssuesEvent, IssuesEmbedCreateOptions>,
    ping: EmbedHandler<PingEvent, PingEmbedCreateOptions>
    pullRequest: EmbedHandler<
        | PullRequestEvent
        | PullRequestReviewThreadEvent
        | PullRequestReviewEvent
        | PullRequestReviewCommentEvent,
        PullRequestEmbedCreateOptions
    >
    push: EmbedHandler<PushEvent, PushEmbedCreateOptions>
    pushComment: EmbedHandler<CommitCommentEvent, PushCommentEmbedCreateOptions>
    release: EmbedHandler<ReleaseEvent, ReleaseEmbedCreateOptions>
    star: EmbedHandler<StarEvent, StarEmbedCreateOptions>
}

// Embed

export const EmbedTitle = new class EmbedTitle {
    public format(input: string) {
        return input[0].toUpperCase() + input.slice(1)
    }

    public formatAction(action: string) {
        return action.includes('_') ? action.split('_').join(' ') : action
    }

    public formatCommitId(id: string) {
        return id.slice(0, 7)
    }

    public formatRef(ref: string) {
        return ref.slice(ref.lastIndexOf('/') + 1)
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

export function embedData(body: string | null | undefined, sender: User, limit?: number): APIEmbed {
    return {
        description: resolveBody(body, limit ?? 500),
        author: {
            name: sender.login,
            icon_url: sender.avatar_url,
            url: sender.url
        }
    }
}

export * from './colors.js'
export * from '../events.js'
export type { APIEmbed }
