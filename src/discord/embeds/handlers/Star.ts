import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    stopFilter
} from "../handler.js";

export const handler: EmbedHandlers['star'] = (event, options) => {
    const { action, sender } = event

    if (stopFilter({ action, ...options })) return

    const embed: APIEmbed = {
        ...embedData(undefined, sender),
        title: action === 'created' ? 'New star added' : `Star ${action}`
    }

    return [embed]
}