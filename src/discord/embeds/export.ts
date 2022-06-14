// Do not modify this file
import { EmbedHandlers } from './handler.js'

import { handler as AlertHandler } from './handlers/Alert.js'
import { handler as BranchHandler } from './handlers/Branch.js'
import { handler as BranchProtectionRuleHandler } from './handlers/BranchProtectionRule.js'
import { handler as CheckHandler } from './handlers/Check.js'
import { handler as CommitCommentHandler } from './handlers/CommitComment.js'
import { handler as DeployKeyHandler } from './handlers/DeployKey.js'
import { handler as DeploymentHandler } from './handlers/Deployment.js'
import { handler as DiscussionHandler } from './handlers/Discussion.js'
import { handler as DiscussionCommentHandler } from './handlers/DiscussionComment.js'
import { handler as ForkHandler } from './handlers/Fork.js'
import { handler as GollumHandler } from './handlers/Gollum.js'
import { handler as IssuesHandler } from './handlers/Issues.js'
import { handler as PingHandler } from './handlers/Ping.js'
import { handler as ProjectHandler } from './handlers/Project.js'
import { handler as PublicHandler } from './handlers/Public.js'
import { handler as PullRequestHandler } from './handlers/PullRequest.js'
import { handler as PushHandler } from './handlers/Push.js'
import { handler as ReleaseHandler } from './handlers/Release.js'
import { handler as RepoHandler } from './handlers/Repo.js'
import { handler as RepoImportHandler } from './handlers/RepoImport.js'
import { handler as SponsorshipHandler } from './handlers/Sponsorship.js'
import { handler as StarHandler } from './handlers/Star.js'
import { handler as StatusHandler } from './handlers/Status.js'
import { handler as TeamHandler } from './handlers/Team.js'
import { handler as WorkflowHandler } from './handlers/Workflow.js'

export const handlers: EmbedHandlers = {
    alert: AlertHandler,
    branch: BranchHandler,
    branch_protection_rule: BranchProtectionRuleHandler,
    check: CheckHandler,
    commit_comment: CommitCommentHandler,
    deploy_key: DeployKeyHandler,
    deployment: DeploymentHandler,
    discussion: DiscussionHandler,
    discussion_comment: DiscussionCommentHandler,
    fork: ForkHandler,
    gollum: GollumHandler,
    issues: IssuesHandler,
    ping: PingHandler,
    project: ProjectHandler,
    public: PublicHandler,
    pull_request: PullRequestHandler,
    push: PushHandler,
    release: ReleaseHandler,
    repository: RepoHandler,
    repository_import: RepoImportHandler,
    sponsorship: SponsorshipHandler,
    star: StarHandler,
    status: StatusHandler,
    team: TeamHandler,
    workflow_job: WorkflowHandler
}
