import { defineClientConfig } from '@vuepress/client'
import { defineAsyncComponent } from 'vue'

import * as Discord from '@discord-message-components/vue'

export default defineClientConfig({
    enhance({ app }) {
        //@ts-ignore
        app.component('WebhookDashboardComponent', defineAsyncComponent(async () => await import('./components/WebhookDashboard.vue')))
        //@ts-ignore
        app.component('ReferenceItemComponent', defineAsyncComponent(async () => await import('./components/ReferenceItem.vue')))

        Object.keys(Discord).forEach(component => {
            app.component(component, Discord[component])
        })
    },
})