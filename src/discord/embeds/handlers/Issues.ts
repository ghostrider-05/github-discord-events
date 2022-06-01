import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['issues'] = (event, options) => {
    const { action, repository, issue, sender } = event

    const actionTitle = options.name === 'issues' ? `Issue ${action}` : 'New comment on issue'
    const title = `[${repository.full_name}] ${actionTitle}: #${issue.number} ${issue.title}`

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setDescription(issue.body)
        .setUrl(issue.html_url)
        .setTitle(title)

    return [embed]
}
