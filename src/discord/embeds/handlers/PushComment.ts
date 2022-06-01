import {
    Embed,
    EmbedHandlers,
    EmbedTitle
} from "../handler.js";

export const handler: EmbedHandlers['commit_comment'] = (event, options) => {
    const { comment: { body, commit_id, html_url }, repository, sender } = event

    const title = EmbedTitle.comment(repository.full_name, {
        action: 'created',
        on: `commit \`${commit_id}\``
    })

    const { embed } = new Embed(sender)
        .setDescription(body)
        .setTitle(title)
        .setUrl(html_url)

    return [embed]
}