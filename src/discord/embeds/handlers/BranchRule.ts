import {
    EmbedHandlers,
    Embed
} from "../handler.js";

export const handler: EmbedHandlers['branch_protection_rule'] = (event, options) => {
    const { sender, repository, action, rule } = event

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setActionTitle(action, {
            type: Embed.Title.formatters.action(options.name),
            repo: repository.full_name,
            append: `: ${rule.name}`
        })

    return [embed]
}