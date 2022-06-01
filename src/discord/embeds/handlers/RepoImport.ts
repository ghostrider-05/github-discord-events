import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['repository_import'] = (event, options) => {
    const { status, sender, repository } = event

    const { embed } = new Embed(sender)
        .setUrl(repository.html_url)
        .setColor(status, options)
        .setTitle(`[${repository.full_name}] Repository imported: ${status}`)

    return [embed]
}