import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['deploy_key'] = (event, options) => {
    const { action, sender, repository, key } = event

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setUrl(key.url)
        .setActionTitle(action, {
            type: 'key',
            append: `: ${key.title}`,
            repo: repository.full_name,

        })

    return [embed]
}