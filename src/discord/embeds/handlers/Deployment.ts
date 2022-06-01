import {
    Embed,
    EmbedHandlers
} from "../handler.js";

// TODO: check with Discord's embed
export const handler: EmbedHandlers['deployment'] = (event, options) => {
    const { sender, repository, action, deployment } = event
    const status = 'deployment_status' in event ? event.deployment_status : undefined

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setUrl(status?.log_url ?? deployment.url)
        .setDescription(status?.description ?? deployment.description)
        .setTitle(`[${repository.full_name}] New deployment ${status ? `status: ${status.state}` : 'created'}`)

    return [embed]
}