import { defineClientConfig } from '@vuepress/client'

import * as Discord from '@discord-message-components/vue'

export default defineClientConfig({
    enhance({ app }) {
        Object.keys(Discord).forEach(component => {
            app.component(component, Discord[component])
        })
    },
})