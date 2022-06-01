import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['discussion_comment'] = (event, options) => {
    const { sender, repository, action, discussion, comment } = event

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setDescription(comment.body)
        .setUrl(comment.html_url)
        .setTitle(Embed.Title.comment(repository.name, {
            action,
            on: `discussion #${discussion.number}: ${discussion.title}`
        }))

    return [embed]
}