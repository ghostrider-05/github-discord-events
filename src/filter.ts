import type { WebhookEvent, WebhookEventName, Label, Milestone } from "@octokit/webhooks-types";

import { emittedEvents } from "./discord/events.js";

import type { GitHubLabelData, GitHubMileStoneData } from "./github.js";
import type {
    GitHubEventRule,
    GitHubEventRulesConfig,
    GitHubCustomEventRuleFilters,
    GitHubEventPayloadFilters
} from "./rules.js";

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

interface GitHubRuleData extends BaseGitHubRuleData {
    rule: GitHubEventRule,
    isMainRule?: boolean
}

interface GitHubRulesData extends BaseGitHubRuleData {
    rules: GitHubEventRulesConfig
}

class GitHubFilters {
    static filterName(ruleData: GitHubRuleData): GitHubEventPayloadFilters | undefined {
        const { name, rule, filterEvents } = ruleData
        if (('name' in rule && rule.name !== name) || (filterEvents && !emittedEvents[name])) return 'name'
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

    static filterActions(ruleData: GitHubRuleData, actions?: string[]): GitHubEventPayloadFilters | undefined {
        const { event, name, filterEvents } = ruleData

        if ('action' in event) {
            if (filterEvents && (emittedEvents[name]?.length ?? 0) > 0
                ? !emittedEvents[name]?.includes(<never>event.action)
                : false
            ) return
            if (actions && !actions.includes(event.action)) return 'actions'
        }
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

function checkCustomFilter(
    event: WebhookEvent,
    rule: GitHubRuleData['rule'],
    key: GitHubCustomEventRuleFilters
) {
    const value = key in rule ? rule[key] : undefined
    if (value == undefined) return undefined

    const result = typeof value === 'boolean' ? value : value(event)
    return result ? key : undefined
}

function checkGitHubRule(ruleData: GitHubRuleData) {
    const { event, rule, isMainRule } = ruleData
    const { actions, branches, labels, milestone, repos, tags } = rule

    const lifecycleRule = 'name' in rule ? rule : undefined
    rule.onCheck?.(event, lifecycleRule)

    const replaceFilter = rule.addReplacingFilter?.(event)
    const failedAction =
        checkCustomFilter(event, rule, 'skip')
            ?? checkCustomFilter(event, rule, 'pass')
            ?? (typeof replaceFilter === 'boolean' ? !replaceFilter ? 'replacedFilter' : false : undefined)
            ?? GitHubFilters.filterName(ruleData)
            ?? GitHubFilters.filterRepo(event, repos)
            ?? GitHubFilters.filterLabels(event, labels)
            ?? GitHubFilters.filterMilestone(event, milestone!)
            ?? GitHubFilters.filterActions(ruleData, actions)
            ?? GitHubFilters.filterBranch(event, tags, branches)
            ?? rule.addFilter?.(event) ? <GitHubEventPayloadFilters>'filter' : undefined

    if (failedAction) {
        rule.onFailed?.(failedAction, event, lifecycleRule)
        if (failedAction === 'skip') return 'skip'
        return
    }

    // passes all filters
    rule.onTrigger?.(event, lifecycleRule)

    return !isMainRule ? rule : true
}

function checkEventRules(options: GitHubRulesData) {
    const { event, filterEvents, name, rules } = options
    let skipEvent = false

    const rule = rules.events?.find(rule => {
        const result = checkGitHubRule({
            rule,
            event,
            filterEvents,
            name
        })

        if (result === 'skip') skipEvent = true
        return result
    })

    return skipEvent ? undefined : rule
}

export function checkGitHubRules(options: GitHubRulesData) {
    const { rules } = options

    if (rules.events && rules.events.length > 0) {
        const eventRule = checkEventRules(options)

        if (eventRule) return eventRule
    }

    const ok = checkGitHubRule({
        rule: <GitHubEventRule>rules,
        ...options,
        isMainRule: true
    })

    return ok ? rules : undefined
}
