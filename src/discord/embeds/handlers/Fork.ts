import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    EmbedTitle
} from "../handler.js";

export const handler: EmbedHandlers['fork'] = (event, options) => {
    const { forkee, repository, sender } = event

    const embed: APIEmbed = {
        ...embedData(undefined, sender),
        title: EmbedTitle.fork(repository.full_name, forkee.full_name),
        url: forkee.html_url
    }

    return [embed]
}