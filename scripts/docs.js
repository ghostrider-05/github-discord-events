import * as fs from 'fs'
import { resolve, join } from 'path'

import source from '../dist/docs.json'
import { DiscordWebhookEmbed } from '../dist/discord/embed.js'

const { formatters } = DiscordWebhookEmbed.defaultTitles

const dir = resolve('.', './docs/reference/')
const writeOptions = { encoding: 'utf8' }

if (!fs.existsSync(dir)) fs.mkdirSync(dir)

const indents = (i) => `    `.repeat(i || 1)
const fileName = (title) => formatters.snakeCase(title.replace(/ /g, ''))

const prefix = `${indents()}- text: Reference\n${indents()}  link: /reference/\n`
const sidebar = prefix + source.groups.map(group => {
    return [
        `${indents()}- text: ${group.title}`, 
        `${indents()}  collapsible: true`,
        `${indents()}  children:`,
        ...group.children.map(id => {
            const child = source.children.find(c => c.id === id)

            const childMethods = child.groups?.map(g => {
                return [1024, 2048].includes(g.kind) && g.children.length > 0 ? g.title : undefined
            }).filter(n => n) ?? []
            
            return [
                `${indents(2)}- text: ${child.name}`,
                `${indents(2)}  link: /reference/${fileName(group.title)}/${child.name.toLowerCase()}`,
            ].join('\n')
        })
    ].join('\n')
}).join('\n')

const fileConfig = `---
sidebarDepth: 4
editLink: false
sidebar:
${sidebar}
---`

function findPath (id) {
    const groupName = source.groups.find(g => g.children.find(c => c === id))?.title
    if (!groupName) return undefined
    const child = source.children.find(c => c.id === id)

    return `/reference/${fileName(groupName)}/${child.name.toLowerCase()}`
}

source.groups.forEach(group => {
    const groupDir = resolve('.', `./docs/reference/${fileName(group.title)}/`)
    const publicDir = resolve('.', `./docs/.vuepress/public/reference/${fileName(group.title)}/`)
    if (!fs.existsSync(groupDir)) fs.mkdirSync(groupDir)
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir)
    
    group.children.forEach(id => {
        const child = source.children.find(c => c.id === id)
        const childName = child.name.toLowerCase()

        const childComponent = `${fileConfig}\n\n<Suspense>\n\t<ReferenceItemComponent path="/reference/${fileName(group.title)}/${childName}.json" />\n</Suspense>`

        fs.writeFileSync(join(publicDir, childName + '.json'), JSON.stringify(child), writeOptions)
        fs.writeFileSync(join(groupDir, childName + '.md'), childComponent, writeOptions)
    })
})

fs.writeFileSync(
    resolve('.', `./docs/.vuepress/public/reference/paths.json`), 
    JSON.stringify(source.groups.flatMap(g => g.children.map(c => ({ id: c, path: findPath(c) })))),
    writeOptions
)

const content = `${fileConfig}
# Reference <Badge text="not completed" type="warning" />

## Structure

The reference documentation can be viewed on this site in:
- normal view: \`/reference/{group}/{variable}\`
- json: \`/reference/{group}/{variable}.json\`

Relative paths will be linked together using \`/reference/paths.json\`

## Contributing

:::warning Automatic updates
Please save yourself time and effort: do not modify the reference files manually or push them to your contribution
:::

The reference guide is generated using typedoc and \`/scripts/docs.js\`. 
Then the \`ReferenceItem*\` Vue components are being used to display the reference

The following types of contributings can be made:
- if something is incorrectly displayed, only then the components and / or scripts needs to be touched.
- if an item is not properly documented, update the corresponding jsdoc on the item

After applying your contributions, the documentation will be built and the reference will be updated reflecting the changes.
`

fs.writeFileSync(resolve('.', './docs/reference/README.md'), content, writeOptions)