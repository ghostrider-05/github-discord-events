import { EmbedHandlers } from './handler.js'

// TODO: add more events
import { handler as AlertHandler } from './handlers/Alert.js'
import { handler as BranchHandler } from './handlers/Branch.js'
import { handler as BranchRuleHandler } from './handlers/BranchRule.js'
import { handler as CheckHandler } from './handlers/Check.js'
import { handler as DeploymentHandler } from './handlers/Deployment.js'
import { handler as DiscussionHandler } from './handlers/Discussion.js'
import { handler as DiscussionCommentHandler } from './handlers/DiscussionComment.js'
import { handler as ForkHandler } from './handlers/Fork.js'
import { handler as GollumHandler } from './handlers/Gollum.js'
import { handler as IssueHandler } from './handlers/Issues.js'
import { handler as KeyHandler } from './handlers/Key.js'
import { handler as PublicHandler } from './handlers/Public.js'
import { handler as PullRequestHandler } from './handlers/PullRequest.js'
import { handler as PingHandler } from './handlers/Ping.js'
import { handler as PushHandler } from './handlers/Push.js'
import { handler as PushCommentHandler } from './handlers/PushComment.js'
import { handler as ReleaseHandler } from './handlers/Release.js'
import { handler as RepoHandler } from './handlers/Repo.js'
import { handler as RepoImportHandler } from './handlers/RepoImport.js'
import { handler as SponsorshipHandler } from './handlers/Sponsorship.js'
import { handler as StarHandler } from './handlers/Star.js'
import { handler as StatusHandler } from './handlers/Status.js'
import { handler as TeamHandler } from './handlers/Team.js'
import { handler as WorkflowJobHandler } from './handlers/Workflow.js'

export const handlers: EmbedHandlers = {
    alert: AlertHandler,
    branch: BranchHandler,
    branch_protection_rule: BranchRuleHandler,
    check: CheckHandler,
    commit_comment: PushCommentHandler,
    deploy_key: KeyHandler,
    deployment: DeploymentHandler,
    discussion: DiscussionHandler,
    discussionComment: DiscussionCommentHandler,
    discussion_comment: DiscussionCommentHandler,
    fork: ForkHandler,
    gollum: GollumHandler,
    issues: IssueHandler,
    ping: PingHandler,
    public: PublicHandler,
    pullRequest: PullRequestHandler,
    pull_request: PullRequestHandler,
    push: PushHandler,
    pushComment: PushCommentHandler,
    release: ReleaseHandler,
    repository: RepoHandler,
    repository_import: RepoImportHandler,
    sponsorship: SponsorshipHandler,
    star: StarHandler,
    status: StatusHandler,
    team: TeamHandler,
    workflow_job: WorkflowJobHandler
}
