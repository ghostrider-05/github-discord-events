import type { WebhookEvent, Label, Milestone, WebhookEventName } from "@octokit/webhooks-types"

import type { GitHubLabelData, GitHubMileStoneData } from "../github.js"
import type { 
    GitHubEventRule, 
    GitHubEventRulesConfig, 
    GitHubEventPayloadFilters 
} from "../rules.js"

function isDefined(...data: (unknown | null | undefined)[]) {
    return data.every(key => key != undefined && key != null)
}

const structureKey = <T>(event: WebhookEvent, name: string): T | undefined => {
    const key = [
        'pull_request',
        'issue',
        'workflow_job'
    ].find(key => event[key as keyof typeof event][name])

    return key ? event[key as keyof typeof event][name] : undefined
}

function compareData<
    T extends Record<string, unknown>
>(data: T, compareData: T, keys: string[]): boolean {

    return keys.some(key => {
        return data[key] && data[key] === compareData[key]
    })
}

function compareLabel(data: GitHubLabelData, event: Label) {
    return compareData(data, event, ['name', 'id'])
}

function compareMilestone(data: GitHubMileStoneData, event: Milestone) {
    return compareData(data, event, ['title', 'id'])
}

interface BaseGitHubRuleData {
    event: WebhookEvent
    name: WebhookEventName
    filterEvents: boolean
}

export interface GitHubRuleData extends BaseGitHubRuleData {
    rule: GitHubEventRule,
    isMainRule?: boolean
}

export interface GitHubRulesData extends BaseGitHubRuleData {
    rules: GitHubEventRulesConfig
}

export class GitHubFilters {
    static filterName(name: string, rule: GitHubEventRule | GitHubEventRulesConfig): GitHubEventPayloadFilters | undefined {
        if (('name' in rule && rule.name !== name)) return 'name'
    }

    static filterRepo(event: WebhookEvent, repos: string[] | undefined): GitHubEventPayloadFilters | undefined {
        if ('repository' in event && isDefined(repos, event.repository)) {
            const { name, full_name } = event.repository!

            if (!repos?.includes(name) || !repos.includes(full_name)) return 'repos'
        }
    }

    static filterLabels(event: WebhookEvent, labels: GitHubLabelData[] | undefined): GitHubEventPayloadFilters | undefined {
        if (isDefined(labels)) {
            const eventLabels = structureKey<Label[]>(event, 'labels')
            if (eventLabels && !labels!.every(label => {
                return eventLabels.some(l => compareLabel(label, l))
            }) || ('label' in event && event.label && !labels?.some(label => compareLabel(label, event.label!)))) return 'labels'
        }
    }

    static filterMilestone(event: WebhookEvent, milestone: GitHubMileStoneData): GitHubEventPayloadFilters | undefined {
        if (isDefined(milestone)) {
            const eventMile = 'milestone' in event
                ? event.milestone
                : structureKey<Milestone>(event, 'milestone')
            if (eventMile && !compareMilestone(milestone!, eventMile)) return 'milestone'
        }
    }

    static filterActions(event: WebhookEvent, actions?: string[]): GitHubEventPayloadFilters | undefined {
        const hasFailedFilter = 'action' in event 
            && actions 
            && !actions.includes(event.action)

        if (hasFailedFilter) return 'actions'
    }

    static filterBranch(event: WebhookEvent, tags?: string[], branches?: string[]): GitHubEventPayloadFilters | undefined {
        if ('branch' in event) {
            if (branches && !branches.includes(event.branch)) return 'branches'
        }
        if ('ref' in event) {
            const { ref } = event
            const refName = ref.slice(ref.lastIndexOf('/') + 1)

            if (branches && !branches.some(branch => {
                return ref === branch || refName === branch
            })) return 'branches'
            if (tags && !tags.some(tag => tag === ref || refName === tag)) return 'tags'
        }
    }
}