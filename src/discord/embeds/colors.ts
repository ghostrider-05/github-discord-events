import type { WebhookEventName } from "@octokit/webhooks-types";

import { formatters } from "../../data/format.js";

import type { GitHubEventActions, GitHubEventMap } from "../../github.js";

function hslToHex(h: number, s: number, l: number) {
    l /= 100;

    const a = s * Math.min(l, 1 - l) / 100;

    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

        return Math.round(255 * color).toString(16).padStart(2, '0')
    }

    return Number(`0x${f(0)}${f(8)}${f(4)}`)
}

export type HSLColor = [number, number, number]

type HSLColorValue<
    T extends keyof typeof DiscordEmbedColors
    > = (typeof DiscordEmbedColors[T]) extends ((...args: any) => any) ? ReturnType<(typeof DiscordEmbedColors[T])> extends HSLColor | undefined ? T : never : never

type ColorKeys = {
    [x in keyof typeof DiscordEmbedColors]: HSLColorValue<x>
}

type ColorValue = Exclude<ColorKeys[keyof ColorKeys], 'resolveColor'>

type _HSLColorValue<
    T extends keyof typeof DiscordEmbedColors
    > = (typeof DiscordEmbedColors[T]) extends HSLColor | undefined ? T : never

type _ColorKeys = {
    [x in keyof typeof DiscordEmbedColors]: _HSLColorValue<x>
}

type ColorValues = _ColorKeys[keyof _ColorKeys]

class DiscordEmbedSaturationColors {
    public saturation: number;
    public action: string;

    constructor(options: { saturation: number, action: string }) {
        const { action, saturation } = options

        this.saturation = saturation
        this.action = action
    }

    public ColorActionMap: GitHubEventMap<ColorValue> = {
        issues: 'issueColor',
        issue_comment: 'issueColor',
        discussion_comment: 'discussionColor',
    }

    private getColorkey (name: WebhookEventName) {
        const eventName = `${formatters.camelCase(name)}Color` as const
        return this.ColorActionMap[name] 
            ?? (eventName in DiscordEmbedColors 
                ? eventName 
                : undefined
            ) as ColorValue | undefined
    }

    public saturationColorKey(key: ColorValue, name: WebhookEventName) {
        const color = DiscordEmbedColors[key](<never>this.action, name)

        return DiscordEmbedColors.applySaturation(color, this.saturation)
    }

    public saturationColorValue (value: ColorValues) {
        return DiscordEmbedColors.applySaturation(DiscordEmbedColors[value], this.saturation)
    }

    public resolveKey(name: WebhookEventName) {
        const key = this.getColorkey(name)

        if (key) {
            return this.saturationColorKey(key, name)
        } else {
            switch (this.action) {
                case 'created':
                case 'create':
                case 'completed':
                case 'success':
                    return this.saturationColorValue('green')
                case 'deleted':
                case 'cancelled':
                case 'failure':
                case 'error':
                    return this.saturationColorValue('red')
                case 'pending':
                    return this.saturationColorValue('issueCreated')
            }
        }
    }

}

export class DiscordEmbedColors {
    static issueCreated: HSLColor = [20, 83.5, 52.4]
    static issueComment: HSLColor = [20, 72.8, 63.9]

    static green: HSLColor = [120, 100, 29.8]
    static blurple: HSLColor = [227, 58.4, 65.1]
    static red: HSLColor = [0, 97.2, 57.5]
    static fringyFlower: HSLColor = [120, 42.2, 82.4]

    static toHex(color: HSLColor) {
        return hslToHex(...color)
    }

    static applySaturation(color: HSLColor | undefined, saturation: number) {
        if (!color) return undefined
        const [h, s, l] = color

        return DiscordEmbedColors.toHex([h, s * saturation, l])
    }

    static issueColor(action: GitHubEventActions<'issues' | 'issue_comment'>) {
        const { issueCreated, issueComment } = DiscordEmbedColors

        if (action === 'opened') return issueCreated
        else if (action === 'created') return issueComment
    }

    static discussionColor(action: GitHubEventActions<'discussion' | 'discussion_comment'>) {
        if (action === 'answered') return DiscordEmbedColors.green
        else if (action === 'created') return DiscordEmbedColors.issueComment
    }

    static pullRequestColor(
        action: GitHubEventActions<
            | 'pull_request'
            | 'pull_request_review'
            | 'pull_request_review_comment'
            | 'pull_request_review_thread'
        >, 
        name: WebhookEventName
    ) {
        if (action === 'opened' && name === 'pull_request') return DiscordEmbedColors.green
        else if (name === 'pull_request_review_comment') return DiscordEmbedColors.fringyFlower
        // TODO: add pull_request_review:submit colors
    }

    static publicColor (action: string) {
        return DiscordEmbedColors.green
    }

    /**
     * Color for a commit
     * @param {'force'} action
     */
    static pushColor(action: 'force' | string) {
        if (action === 'force') return DiscordEmbedColors.red
        else return DiscordEmbedColors.blurple
    }

    public static resolveColor(action: string | null, options: { saturation: number, name: string }): number | undefined {
        const { name, saturation } = options
        if (!action) return undefined

        const colors = new DiscordEmbedSaturationColors({
            action,
            saturation
        })

        return colors.resolveKey(name as WebhookEventName)
    }
}