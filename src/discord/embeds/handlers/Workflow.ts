import {
    Embed,
    EmbedHandlers
} from "../handler.js";

export const handler: EmbedHandlers['workflow_job'] = (event, options) => {
    const { sender, workflow_job, action, repository } = event

    const { embed } = new Embed(sender)
        .setColor(action, options)
        .setUrl(workflow_job.html_url)
        .setActionTitle(action, {
            type: Embed.Title.formatters.action(options.name),
            repo: repository.full_name,
            append: `: ${workflow_job.name} ${workflow_job.runner_name}`
        })


    return [embed]
}