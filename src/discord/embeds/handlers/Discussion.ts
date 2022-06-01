import {
    Embed,
    EmbedHandlers,
    EmbedTitle
} from "../handler.js";

export const handler: EmbedHandlers['discussion'] = (event, options) => {
    const { sender, repository, action, discussion } = event

    const title = EmbedTitle.discussion(repository.name, {
        action,
        number: discussion.number,
        title: discussion.title
    })

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setDescription(discussion.body)
        .setTitle(title)
        .setUrl((action === 'answered' ? discussion.answer_html_url : discussion.html_url) ?? undefined)

    return [embed]
}