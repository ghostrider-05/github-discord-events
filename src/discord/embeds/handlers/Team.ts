import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['team'] = (event, options) => {
    const { sender, team } = event
    const action = 'action' in event ? event.action : 'created'

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setActionTitle(action, {
            type: 'team',
            append: `: ${team.name}`,
            repo: action.includes('repository') || options.name === 'team_add' 
                ? event.repository?.full_name 
                : undefined
        })

    return [embed]
}