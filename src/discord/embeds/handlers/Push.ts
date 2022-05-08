import { Commit, User } from "@octokit/webhooks-types";
import {
    APIEmbed,
    embedData,
    EmbedHandlers,
    EmbedTitle,
    DiscordEmbedColors
} from "../handler.js";

function formatCommit(commit: Commit, sender: User, url: string) {
    const description = embedData(commit.message, sender, 47).description!

    //TODO: format commit url
    return `[\`${commit.id}\`](${url}/commits/${commit.id.slice(0, 7)}) ${description} - ${commit.committer.name}`
}

export const handler: EmbedHandlers['push'] = (event, options) => {
    const { commits, sender, ref, repository, forced, after, compare, head_commit } = event
    const refName = ref.slice(ref.lastIndexOf('/') + 1)

    const title = forced
        ? EmbedTitle.forcePush(refName, after)
        : EmbedTitle.push(`${repository.name}:${refName}`, commits.length)

    const body = forced
        ? `[Compare changes](${compare})`
        : `${commits.map(commit => formatCommit(commit, sender, repository.html_url)).join('\n')}`

    const embed: APIEmbed = {
        ...embedData(body, sender),
        color: DiscordEmbedColors.resolveColor(forced ? 'force' : '', options),
        title,
        url: `${repository.html_url}/commits/${after.slice(0, 7)}`
    }

    return [embed]
}
