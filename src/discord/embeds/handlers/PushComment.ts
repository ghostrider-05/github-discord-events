import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    EmbedTitle
} from "../handler.js";

export const handler: EmbedHandlers['pushComment'] = (event, options) => {
    const { comment: { body, commit_id, html_url }, repository, sender } = event

    const title = EmbedTitle.comment(repository.full_name, {
        action: 'created',
        on: `commit \`${commit_id}\``
    })

    const embed: APIEmbed = {
        ...embedData(body, sender),
        title,
        url: html_url
    }

    return [embed]
}