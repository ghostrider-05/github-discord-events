<template>
    <div>
        <h1>
            {{ file.name }} 
            <Badge :text="file.kindString" />
            <a :href="sourceLink(file.sources[0])" class="source-link">
                <ExternalLinkIcon />
            </a>
        </h1>

        <p v-if="file.comment">{{ file.comment.shortText }}</p>

        <div v-if="constructor && constructor.signatures">
            <div class="language-js extra-class ext-js">
                <pre>{{constructor.signatures[0].name }}({{ 
                    (constructor.signatures[0].parameters ? constructor.signatures[0].parameters.map(param => {
                        return `${param.name}${(param.flags.isOptional ? '?' : '')}`
                    }) : []).join(',')
                }})</pre>
            </div>

            <div v-if="constructor.signatures?.[0].parameters?.length > 0">
                <h2>Options</h2>
                <ReferenceItemProperty v-for="property in constructor.signatures[0].parameters" :key="property.id" :property="property" />
            </div>
        </div>
        
        <div v-if="properties.length > 0">
            <h2>Properties</h2>
            <ReferenceItemProperty v-for="property in properties" :key="property.id" :property="property" />
        </div>

        <div v-if="methods.length > 0">
            <h2>Methods</h2>
            <ReferenceItemProperty v-for="method in methods" :key="method.id" :property="method" />
        </div>

        <!-- Functions -->
        <div v-if="file.kind === 64">
            <ReferenceItemProperty :property="file" :hideName="true" />
        </div>

        <!-- Type Alias -->
        <div v-if="file.kind === 4194304 || file.kind === 32">
            <ReferenceItemProperty :property="file" :hasMainType="true" />
        </div>
    </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import * as shiki from 'shiki'
import ReferenceItemProperty from './ReferenceItemProperty.vue'

const md = new MarkdownIt()
export default {
    props: ['path'],
    components: {
        ReferenceItemProperty
    },

    async setup (props) {
        const data = await fetch(document.location.origin + props.path).then(res => res.json())
        return {
            file: data,
            showPrivate: localStorage.getItem('docs-private') === 'true'
        }
    },

    created() {
        window.addEventListener('docs-private-localstorage-changed', (event) => {
            console.log('New event', event.detail.storage, this.showPrivate)
            this.showPrivate = event.detail.storage === 'true';
        });
    },
    
    data () {
        const { sources, children, ...item } = this.file

        const searchChildren = (kind, filterPrivates) => {
            const ids = this.file.groups?.find(g => g.kind === kind)?.children
            if (!ids || ids.length === 0) return []

            return children.filter(child => ids.includes(child.id) && (filterPrivates ? !child.flags.isPrivate : true))
        }

        return {
            source: sources[0],
            constructor: children?.find(c => c.kindString === 'Constructor' && (!this.showPrivate ? !c.flags?.isPrivate : true)),
            properties: searchChildren(1024, !this.showPrivate),
            methods: searchChildren(2048, !this.showPrivate),
            item,
            children
        }
    },
    methods: {
        sourceLink (source) {
            return ReferenceItemProperty.methods.sourceLink(source)
        },
    },
    watch: {
        showPrivate(newValue) {
            this.showPrivate = newValue
        }
    }
}
</script>

<style scoped>
.source-link {
    float: right;
}

.source-link span {
    transform: scale(1.5);
}

.property-type:nth-child() {
    display: contents !important;
}
</style>