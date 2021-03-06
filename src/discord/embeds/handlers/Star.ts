import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['star'] = (event, options) => {
    const { action, sender, repository } = event

    const { embed } = new Embed(sender)
        .setActionTitle(action, {
            type: 'star',
            newActionName: 'added',
            repo: repository.full_name
        })

    return [embed]
}