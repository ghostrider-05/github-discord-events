import type { EventPayloadMap } from "@octokit/webhooks-types";

import type { GitHubEventActions } from "../github.js";

export type EmittedEvents = {
    [x in keyof EventPayloadMap]?: GitHubEventActions<x>[];
};

//TODO: make list complete
/**
 * Default events that are sent to Discord.
 * When a key has no actions, all actions are sent.
 */
export const emittedEvents: EmittedEvents = {
    commit_comment: [],
    create: [],
    delete: [],
    discussion: ['answered', 'created'],
    discussion_comment: ['created'],
    fork: [],
    issues: ['reopened', 'opened', 'closed'],
    issue_comment: ['created'],
    pull_request: ['opened', 'closed', 'reopened'],
    pull_request_review: ['submitted', 'dismissed'],
    pull_request_review_comment: ['created'],
    push: [],
    release: ['published'],
    star: ['created']
}

/**
 * Check if the event should be sent by default
 * @param event 
 * @returns Whether the event should be blocked
 */
export function stopFilter(event: { name: keyof EmittedEvents, action: string, filterEvents: boolean }) {
    if (!event.filterEvents) return false

    const actions = emittedEvents[event.name]
    if (actions != undefined) {
        return actions.length > 0
            ? !actions.includes(<never>event.action)
            : false
    } else return true
}