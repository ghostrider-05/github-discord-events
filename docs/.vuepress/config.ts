import { defineUserConfig, defaultTheme, viteBundler } from 'vuepress'

export default defineUserConfig({
    lang: 'en-US',
    title: 'GitHub-Discord events',
    description: 'Package to customize your GitHub webhook messages to Discord',
    base: '/github-discord-events/',
    bundler: viteBundler({
        viteOptions: {
            // @ts-expect-error
            ssr: {
                noExternal: ['@discord-message-components/vue']
            }
        }
    }),
    theme: defaultTheme({
        docsBranch: 'master',
        repo: 'ghostrider-05/github-discord-events',
        navbar: [
            {
                text: 'Guide',
                link: '/guide/introduction'
            },
            {
                text: 'Reference',
                link: '/reference.md'
            },
            {
                text: 'Examples',
                link: '/examples/stars'
            }
        ],
        sidebarDepth: 2,
        sidebar: {
            '/guide/': [
                {
                    text: 'Guide',
                    children: [
                        {
                            text: 'Introduction',
                            link: '/guide/introduction',
                        },
                        {
                            text: 'Getting started',
                            link: '/guide/getting-started'
                        },
                        {
                            text: 'Webhook events',
                            link: '/guide/events'
                        },
                        {
                            text: 'Hosting options',
                            link: '/guide/hosted'
                        }
                    ]
                }, {
                    text: 'Advanced',
                    children: [
                        {
                            text: 'Discord API',
                            link: '/guide/advanced/discord-api.md'
                        }
                    ]
                }],
            '/examples/': [
                {
                    text: 'Star counting',
                    link: 'stars'
                },
                {
                    text: 'Issue image',
                    link: 'image'
                }
            ]
        }
    })
})
