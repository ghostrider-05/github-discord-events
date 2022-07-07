<script setup>
import ParentLayout from '@vuepress/theme-default/lib/client/layouts/Layout.vue'

</script>

<template>
  <ParentLayout>
    <template #sidebar-top>
        <div class="sidebar-settings" v-if="isReferencePage()">
            <div class="sidebar-settings-visible" @click="isOpen = !isOpen">
                <i class="fa-solid fa-square-minus" v-if="isOpen"></i>
                <i class="fa-solid fa-square-plus" v-else></i>
                <p style="margin-left: 10px">{{ settings.title }}</p>
            </div>

            <div class="sidebar-settings-values" v-if="isOpen">
                <div class="sidebar-settings-value" v-for="setting in settings.values" :key="setting.name">
                    <p>{{ setting.title }}</p><input :type="setting.type" v-model="this[setting.key]" >
                </div>
            </div>
        </div>
    </template>
  </ParentLayout>
</template>

<script>
export default {
    data () {
        return {
            showPrivates: false,
            isOpen: false,
            path: window.location.pathname,
            settings: {
                title: 'Reference settings',
                values: [
                    {
                        title: 'Show privates',
                        type: 'checkbox',
                        key: 'showPrivates'
                    }
                ]
            }
        }
    },

    onMounted(){
        const showPrivates = localStorage.getItem('docs-private') === 'false'

        if (showPrivates) this.showPrivates = true
    },

    watch: {
        showPrivates(newValue, oldValue) {
            if (oldValue !== newValue) {
                localStorage.setItem('docs-private', newValue.toString())

                // https://stackoverflow.com/a/61178486/12840177
                window.dispatchEvent(new CustomEvent('docs-private-localstorage-changed', {
                    detail: {
                        storage: newValue.toString()
                    }
                }));
            }
        },
        
        $route (oldPath, newPath) {
            console.log(newPath)

            this.path = newPath.href
        }
    },

    methods: {
        isReferencePage () {
            return this.path.startsWith(`/github-discord-events/reference`)
        }
    }
}
</script>

<style lang="css">
.sidebar-settings {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: var(--c-bg-light);
}

.sidebar-settings-visible, .sidebar-settings-value {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
}

/* .sidebar-settings-value {
    display: flex;
    flex-direction: row;
    align-items: center;
} */

.sidebar-settings-value p {
    margin-right: 10px;
}

</style>