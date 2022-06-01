import {
    EmbedHandlers,
    Embed
} from "../handler.js";

export const handler: EmbedHandlers['pull_request'] = (event, options) => {
    const { action, pull_request, sender, repository } = event

    const title = Embed.Title.pullRequest(repository.full_name, {
        number: 'number' in event ? event.number : pull_request.number,
        action,
        title: pull_request.title,
        name: options.name
    })

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setDescription(pull_request.body)
        .setUrl(pull_request.html_url)
        .setTitle(title)

    return [embed]
}
