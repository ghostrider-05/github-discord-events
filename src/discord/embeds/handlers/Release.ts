import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    stopFilter
} from "../handler.js";

export const handler: EmbedHandlers['release'] = (event, options) => {
    const { action, sender, release } = event

    if (stopFilter({ action, ...options })) return

    const prefix = (action === 'published' ? 'New ' : '') + (release.prerelease ? `pre` : '')

    const embed: APIEmbed = {
        ...embedData(undefined, sender),
        title: `${prefix}release ${action}: ${release.name}`,
        url: release.html_url
    }

    return [embed]
}