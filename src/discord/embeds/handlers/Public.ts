import {
    EmbedHandlers,
    Embed
} from "../handler.js";

export const handler: EmbedHandlers['public'] = (event, options) => {
    const { sender, repository } = event

    const { embed } = new Embed(sender)
        .setColor('', options)
        .setUrl(repository.html_url)
        .setTitle(`[${repository.full_name}] Made public`)

    return [embed]
}