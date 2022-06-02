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
      sidebar: {
          '/guide/': [
              {
                  text: 'Introduction',
                  link: 'introduction'
              },
              {
                  text: 'Getting started',
                  link: 'getting-started'
              },
              {
                  text: 'Webhook events',
                  link: 'events'
              },
              {
                  text: 'Hosting options',
                  link: 'hosted'
              }
          ],
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
