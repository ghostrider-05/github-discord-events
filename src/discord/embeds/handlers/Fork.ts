import {
    Embed,
    EmbedHandlers,
} from "../handler.js";

export const handler: EmbedHandlers['fork'] = (event, options) => {
    const { forkee, repository, sender } = event

    const { embed } = new Embed(sender)
        .setUrl(forkee.html_url)
        .setTitle(Embed.Title.fork(repository.full_name, forkee.full_name))

    return [embed]
}