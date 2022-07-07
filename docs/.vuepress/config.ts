import { defineUserConfig, viteBundler } from 'vuepress'
import { localTheme } from './theme/index.cjs'

export default defineUserConfig({
    lang: 'en-US',
    title: 'GitHub-Discord events',
    description: 'Package to customize your GitHub webhook messages to Discord',
    base: '/github-discord-events/',
    bundler: viteBundler({
        viteOptions: { }
    }),
    head: [
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'}]
    ],

    theme: localTheme({
        docsBranch: 'master',
        repo: 'ghostrider-05/github-discord-events',
        contributors: false,
        navbar: [
            {
                text: 'Guide',
                link: '/guide/introduction'
            },
            {
                text: 'Reference',
                link: '/reference/'
            },
            {
                text: 'Examples',
                link: '/examples/'
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
                            text: 'Deployment',
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
                    text: 'Implementations',
                    children: [
                        {
                            text: 'Star counting',
                            link: '/examples/implementations/stars'
                        },
                        {
                            text: 'Issue image',
                            link: '/examples/implementations/image',
                        }
                    ]
                }
            ],
            // '/reference': [
            //     {
            //         text: 'Reference',
            //         collapsible: true,
            //         children: [
            //             {
            //                 t
            //             }
            //         ]
            //     }
            // ]
        }
    })
})
