import {
    Embed,
    EmbedHandlers,
} from "../handler.js";

type GollumPage = Parameters<EmbedHandlers['gollum']>[0]['pages'][number]

function formatPage (page: GollumPage) {
    return `${page.action === 'created' ? '+' : '•'} [${page.page_name}](${page.html_url}): ${page.title}`
}

export const handler: EmbedHandlers['gollum'] = (event, options) => {
    const { pages, repository, sender } = event

    const { embed } = new Embed(sender)
        .setTitle(`[${repository.full_name}] ${pages.length} updated wiki page${pages.length > 1 ? 's' : ''}`)
        .setDescription(`\`\`\`diff\n${pages.map(formatPage).join('\n')}\n\`\`\``)

    return [embed]
}