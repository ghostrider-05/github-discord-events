import {
    EmbedHandlers,
    Embed
} from "../handler.js";

export const handler: EmbedHandlers['alert'] = (event, options) => {
    const { sender, repository, action, alert } = event

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setUrl('html_url' in alert ? alert.html_url : undefined)
        .setActionTitle(action, {
            type: Embed.Title.formatters.action(options.name),
            repo: repository.full_name,
            append: `: #${alert.number} ${alert.state}`
        })

    return [embed]
}