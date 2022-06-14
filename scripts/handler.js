import * as fs from 'fs'
import { resolve } from 'path'
import { DiscordWebhookEmbed } from '../dist/discord/embed.js'

const { formatters } = DiscordWebhookEmbed.defaultTitles

const path = resolve('.', './src/discord/embeds/export.ts')
const dir = resolve('.', './src/discord/embeds/handlers/')

const options = { encoding: 'utf8'}

const handlerName = (name) => `${name}Handler`
const handlerKeyName = (name) => formatters.snakeCase(name)
    .replace('repo', 'repository')
    .replace('workflow', 'workflow_job')

/** @param {string[]} handlers */
const content = (handlers) => `// Do not modify this file
import { EmbedHandlers } from './handler.js'

${handlers.map(name => {
    return `import { handler as ${handlerName(name)} } from './handlers/${name}.js'`
}).join('\n')}

export const handlers: EmbedHandlers = {
${handlers.map(name => `    ${handlerKeyName(name)}: ${handlerName(name)}`).join(',\n')}
}
`

/** @type {string[]} */
const handlers = fs.readdirSync(dir, options)
    .map(fileName => fileName.split('.')[0])

fs.writeFileSync(path, content(handlers), options)
