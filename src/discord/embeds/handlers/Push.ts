import type { Commit } from "@octokit/webhooks-types";
import {
    EmbedHandlers,
    Embed
} from "../handler.js";

const { formatters } = Embed.Title

function formatCommit(commit: Commit, url: string) {
    const description = formatters.substring(commit.message, 47)
    const link = formatters.mdLink(
        `\`${formatters.commitId(commit.id)}\``, 
        formatters.commitUrl(url, commit.id)
    )

    return `${link} ${description} - ${commit.committer.name}`
}

export const handler: EmbedHandlers['push'] = (event, options) => {
    const { commits, sender, ref, repository, forced, after, compare, head_commit } = event
    const refName = formatters.ref(ref)

    const title = forced
        ? Embed.Title.forcePush(refName, after)
        : Embed.Title.push(`${repository.name}:${refName}`, commits.length)

    const body = forced
        ? `[Compare changes](${compare})` //TODO: set to compare url
        : `${commits.map(commit => formatCommit(commit, repository.html_url)).join('\n')}`

    const { embed } = new Embed(sender)
        .setColor(forced ? 'force' : '', options)
        .setTitle(title)
        .setDescription(body)
        .setUrl(`${repository.html_url}/commits/${formatters.commitId(after)}`)

    return [embed]
}
