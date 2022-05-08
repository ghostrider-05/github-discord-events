import {
    APIEmbed,
    DiscordEmbedColors,
    embedData,
    EmbedHandlers,
    EmbedTitle,
    stopFilter
} from "../handler.js";

export const handler: EmbedHandlers['discussionComment'] = (event, options) => {
    const { sender, repository, action, discussion, comment } = event

    if (stopFilter({ action, ...options })) return

    const embed: APIEmbed = {
        ...embedData(comment.body, sender),
        color: DiscordEmbedColors.resolveColor(action, options),
        url: comment.html_url,
        title: EmbedTitle.comment(repository.name, {
            action,
            on: `discussion #${discussion.number}: ${discussion.title}`
        })
    }

    return [embed]
}