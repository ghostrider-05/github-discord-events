import { EmbedHandlers } from './handler.js'

// TODO: add more events
import { handler as BranchHandler } from './handlers/Branch.js'
import { handler as DiscussionHandler } from './handlers/Discussion.js'
import { handler as DiscussionCommentHandler } from './handlers/DiscussionComment.js'
import { handler as ForkHandler } from './handlers/Fork.js'
import { handler as IssueHandler } from './handlers/Issues.js'
import { handler as PullRequestHandler } from './handlers/PullRequest.js'
import { handler as PingHandler } from './handlers/Ping.js'
import { handler as PushHandler } from './handlers/Push.js'
import { handler as PushCommentHandler } from './handlers/PushComment.js'
import { handler as ReleaseHandler } from './handlers/Release.js'
import { handler as StarHandler } from './handlers/Star.js'

export const handlers: EmbedHandlers = {
    branch: BranchHandler,
    commit_comment: PushCommentHandler,
    discussion: DiscussionHandler,
    discussionComment: DiscussionCommentHandler,
    discussion_comment: DiscussionCommentHandler,
    fork: ForkHandler,
    issues: IssueHandler,
    ping: PingHandler,
    pullRequest: PullRequestHandler,
    pull_request: PullRequestHandler,
    push: PushHandler,
    pushComment: PushCommentHandler,
    release: ReleaseHandler,
    star: StarHandler
}
