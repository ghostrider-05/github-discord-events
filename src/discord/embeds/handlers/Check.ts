import {
    EmbedHandlers,
    Embed
} from "../handler.js";

export const handler: EmbedHandlers['check'] = (event, options) => {
    const { sender, repository, action } = event
    const check = 'check_suite' in event ? event.check_suite : event.check_run

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setUrl('html_url' in check ? check.html_url : undefined)
        .setActionTitle(action, {
            type: Embed.Title.formatters.action(options.name),
            repo: repository.full_name,
            append: check.conclusion ? `: ${check.conclusion}` : undefined
        })

    return [embed]
}