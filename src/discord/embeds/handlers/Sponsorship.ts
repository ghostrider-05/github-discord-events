import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['sponsorship'] = (event, options) => {
    const { action, sender, sponsorship } = event

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setActionTitle(action, {
            type: 'sponsorship',
            newActionName: '',
            append: ': ' + sponsorship.tier.name
        })

    return [embed]
}