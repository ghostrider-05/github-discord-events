import type {
    EventPayloadMap,
    Label,
    Milestone,
    WebhookEvent,
    WebhookEventName
} from "@octokit/webhooks-types";

import type { NameOrIdData } from "./data/id.js";

// Data

export type GitHubLabelData = NameOrIdData<Pick<Label, 'id' | 'name'>>
export type GitHubMileStoneData = NameOrIdData<Pick<Milestone, 'id' | 'title'>>

// Actions

type GitHubEventWithAction<T> = T extends { action: any } ? T : never;

export type GitHubEventsWithAction = GitHubEventWithAction<GitHubEventWithAction<WebhookEvent>>

export type GitHubEventMap<T> = { [x in keyof EventPayloadMap]?: T }

export type GitHubEventsActionMap = {
    [x in keyof EventPayloadMap]?: GitHubEventWithAction<EventPayloadMap[x]>['action'];
}

export type GitHubEventActions<T extends WebhookEventName> = NonNullable<GitHubEventsActionMap[T]>
