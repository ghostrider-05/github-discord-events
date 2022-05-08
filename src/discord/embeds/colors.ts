import { WebhookEventName } from "@octokit/webhooks-types";
import { GitHubEventMap } from "../../github.js";

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

class DiscordEmbedSaturationColors {
    public saturation: number;
    public action: string;

    constructor(options: { saturation: number, action: string }) {
        const { action, saturation } = options

        this.saturation = saturation
        this.action = action
    }

    // TODO: Use camelCase converter?
    public ColorActionMap: GitHubEventMap<ColorValue> = {
        pull_request: 'pullRequestColor',
        issues: 'issueColor',
        issue_comment: 'issueColor',
        push: 'pushColor',
        discussion: 'discussionColor',
        discussion_comment: 'discussionColor',
    }

    public saturationColorKey(key: ColorValue, name: WebhookEventName) {
        const color = DiscordEmbedColors[key](this.action, name)

        return DiscordEmbedColors.applySaturation(color, this.saturation)
    }

    public resolveKey(name: WebhookEventName) {
        const key = this.ColorActionMap[name]

        if (key) {
            return this.saturationColorKey(key, name)
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

    static issueColor(action: string) {
        const { issueCreated, issueComment } = DiscordEmbedColors

        if (action === 'opened') return issueCreated
        else if (action === 'created') return issueComment
    }

    static discussionColor(action: string) {
        if (action === 'answered') return DiscordEmbedColors.green
        else if (action === 'created') return DiscordEmbedColors.issueComment
    }

    static pullRequestColor(action: string, name: WebhookEventName) {
        if (action === 'opened' && name === 'pull_request') return DiscordEmbedColors.green
        else if (name === 'pull_request_review_comment') return DiscordEmbedColors.fringyFlower
        // TODO: add pull_request_review:submit colors
    }

    /**
     * Color for a commit
     * @param {'force'} action
     */
    static pushColor(action: 'force' | string) {
        if (action === 'force') return DiscordEmbedColors.red
        else return DiscordEmbedColors.blurple
    }

    public static resolveColor(action: string, options: { saturation: number, name: string }): number | undefined {
        const { name, saturation } = options

        const colors = new DiscordEmbedSaturationColors({
            action,
            saturation
        })

        return colors.resolveKey(name as WebhookEventName)
    }
}