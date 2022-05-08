import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    DiscordEmbedColors,
    stopFilter
} from "../handler.js";

export const handler: EmbedHandlers['issues'] = (event, options) => {
    const { action, repository, issue, sender } = event

    if (stopFilter({ action, ...options })) return

    const actionTitle = options.name === 'issues' ? `Issue ${action}` : 'New comment on issue'
    const title = `[${repository.full_name}] ${actionTitle}: #${issue.number} ${issue.title}`

    const embed: APIEmbed = {
        title,
        color: DiscordEmbedColors.resolveColor(action, options),
        ...embedData(issue.body, sender),
        url: issue.html_url
    }

    return [embed]
}
