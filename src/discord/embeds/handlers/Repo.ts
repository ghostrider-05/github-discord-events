import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['repository'] = (event, options) => {
    const { action, sender, repository } = event

    const { embed } = new Embed(sender)
        .setUrl(repository.html_url)
        .setColor(action, options)
        .setActionTitle(action, {
            type: options.name,
            repo: repository.full_name
        })

    return [embed]
}