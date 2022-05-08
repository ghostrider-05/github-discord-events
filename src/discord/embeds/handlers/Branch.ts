import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    EmbedTitle
} from "../handler.js";

export const handler: EmbedHandlers['branch'] = (event, options) => {
    const { sender, repository, ref, ref_type } = event

    const embed: APIEmbed = {
        ...embedData(undefined, sender),
        title: EmbedTitle.branch(repository.full_name, {
            name: EmbedTitle.formatRef(ref),
            action: options.name,
            type: ref_type
        })
    }

    return [embed]
}
