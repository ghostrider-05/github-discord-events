import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['status'] = (event, options) => {
    const { sender, repository, state, description, target_url, id } = event

    const { embed } = new Embed(sender)
        .setColor(state, options)
        .setUrl(target_url)
        .setDescription(description)
        .setTitle(`[${repository.full_name}] New commit status: #${id} ${state}`)

    return [embed]
}