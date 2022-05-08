import {
    APIEmbed,
    DiscordEmbedColors,
    embedData,
    EmbedHandlers,
    EmbedTitle,
    stopFilter
} from "../handler.js";

export const handler: EmbedHandlers['discussion'] = (event, options) => {
    const { sender, repository, action, discussion } = event

    if (stopFilter({ action, ...options })) return

    const embed: APIEmbed = {
        ...embedData(discussion.body, sender),
        color: DiscordEmbedColors.resolveColor(action, options),
        url: (action === 'answered' ? discussion.answer_html_url : discussion.html_url) ?? undefined,
        title: EmbedTitle.discussion(repository.name, {
            action,
            number: discussion.number,
            title: discussion.title
        })
    }

    return [embed]
}