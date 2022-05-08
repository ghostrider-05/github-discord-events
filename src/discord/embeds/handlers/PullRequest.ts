import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    DiscordEmbedColors,
    stopFilter,
    EmbedTitle
} from "../handler.js";

export const handler: EmbedHandlers['pullRequest'] = (event, options) => {
    const { action, pull_request, sender, repository } = event

    if (stopFilter({ ...options, action })) return

    const title = EmbedTitle.pullRequest(repository.full_name, {
        number: 'number' in event ? event.number : pull_request.number,
        action,
        title: pull_request.title,
        name: options.name
    })

    const embed: APIEmbed = {
        title,
        color: DiscordEmbedColors.resolveColor(action, options),
        ...embedData(pull_request.body, sender),
        url: pull_request.html_url
    }

    return [embed]
}
