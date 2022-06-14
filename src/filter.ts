import type { WebhookEvent, WebhookEventName } from "@octokit/webhooks-types";

import { stopFilter } from "./discord/events.js";
import { 
    GitHubFilters, 
    type GitHubRuleData, 
    type GitHubRulesData 
} from "./data/filters.js";

import type {
    GitHubEventRule,
    GitHubCustomEventRuleFilters,
    GitHubEventPayloadFilters,
    GitHubEventFilterValueOrCallback
} from "./rules.js";

function getValueOrCallback <S>(
    filter: GitHubEventFilterValueOrCallback<S, WebhookEventName>, 
    event: WebhookEvent
): S {
    if (typeof filter === 'function') {
        const filterFunction = filter as ((event: WebhookEvent) => S)

        return filterFunction(event)
    } else return filter
}

function checkCustomFilter(
    event: WebhookEvent,
    rule: GitHubRuleData['rule'],
    key: GitHubCustomEventRuleFilters
) {
    const value = key in rule ? rule[key] : undefined
    if (value == undefined) return undefined

    const result = getValueOrCallback<boolean>(value, event)
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
            ?? GitHubFilters.filterName(ruleData.name, rule)
            ?? GitHubFilters.filterRepo(event, repos)
            ?? GitHubFilters.filterLabels(event, labels)
            ?? GitHubFilters.filterMilestone(event, milestone!)
            ?? GitHubFilters.filterActions(event, actions)
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
    const { rules, filterEvents, name } = options

    if (stopFilter({ 
        filterEvents,
        action: (options.event as { action: string })['action'],
        name
    })) return undefined

    if (rules.events && rules.events.length > 0) {
        const eventRule = checkEventRules(options)

        if (eventRule) return eventRule

        const stopMainRule = rules.events.some(event => {
            return event.main === false && event.name === name
        })
        if (stopMainRule) return undefined
    }

    const ok = checkGitHubRule({
        rule: <GitHubEventRule>rules,
        ...options,
        isMainRule: true
    })

    return ok ? rules : undefined
}
