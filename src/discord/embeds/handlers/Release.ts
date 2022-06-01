import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['release'] = (event, options) => {
    const { action, sender, release } = event

    const { embed } = new Embed(sender)
        .setUrl(release.html_url)
        .setActionTitle(action, {
            type: `${release.prerelease ? 'pre' : ''}release`,
            newAction: 'published'
        })

    return [embed]
}