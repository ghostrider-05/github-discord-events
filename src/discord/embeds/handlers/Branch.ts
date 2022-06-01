import {
    EmbedHandlers,
    Embed
} from "../handler.js";

export const handler: EmbedHandlers['branch'] = (event, options) => {
    const { sender, repository, ref, ref_type } = event

    const title = Embed.Title.branch(repository.full_name, {
        name: Embed.Title.formatters.ref(ref),
        action: options.name,
        type: ref_type
    })

    const { embed } = new Embed(sender)
        .setTitle(title)

    return [embed]
}
