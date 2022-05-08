import {
    APIEmbed,
    EmbedHandlers,
    DiscordEmbedColors
} from "../handler.js";

export const handler: EmbedHandlers['ping'] = (event, options) => {
    const { zen, hook_id } = event

    const embed: APIEmbed = {
        title: `[${hook_id}] Ping`,
        color: DiscordEmbedColors.toHex(DiscordEmbedColors.green),
        description: zen
    }

    return [embed]
}