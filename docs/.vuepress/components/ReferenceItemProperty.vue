<template>
    <div>
        <!-- {{ property }} -->
        <div class="property">
            <h3 class="property-type" v-if="!hideName && !hasMainType">
                {{ property.name }}
                <span class="property-type" v-html="md.render(formatType(property))"></span>
                <Badge v-if="property.flags.isStatic" text="static" />
                <Badge v-if="property.flags.isReadonly" text="read-only" />
                <Badge v-if="property.flags.isPrivate" text="private" type="danger"/>
                <Badge v-if="comment?.tags?.find(t => t.tag === 'deprecated')" text="deprecated" type="danger"/>
            </h3>

            <a :href="sourceLink(property.sources[0])" class="source-link" v-if="property.sources && !hasMainType">
                <ExternalLinkIcon />
            </a>
        </div>

        <p v-if="hasMainType" v-html="'Type: ' + md.render(formatType(property))"></p>

        <p v-if="comment?.shortText">{{ comment.shortText }}</p>
        <p v-if="defaultValue">Default: {{ defaultValue.text }}</p>

        <div v-if="parameters?.length > 0">
            <h4>Parameters</h4>
            <!-- {{ parameters }} -->

            <p v-html="renderMdTable([['Name', 'Type', 'Description'], undefined, ...parameters.map(param => [param.name, `'${formatType(param)}'`, param.comment?.shortText])])"></p>
        </div>

        <span v-if="comment?.returns">
            <h4>Returns:</h4>
            <span>{{ comment.returns }}</span>
        </span>

        <div v-if="examples.length > 0">
            <div v-for="(example, m) in examples" :key="m">
                <div class="language-js extra-class ext-ts">
                    <pre>{{ example.text }}</pre>
                </div>
            </div>
        </div>

        <hr v-if="!hasMainType && !hideName">
    </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import paths from '../public/reference/paths.json'
const md = new MarkdownIt();

export default {
    props: ["property", "hideName", "hasMainType"],

    setup () {
        return {
            md: new MarkdownIt(),
            paths
        }
    },

    computed: {
        defaultValue() {
            return this.comment?.tags?.find(tag => tag.tag === 'default')
        },
        examples() {
            return this.comment?.tags?.filter(tag => tag.tag === 'example') ?? []
        },
        signature () {
            const signatures = this.property.signatures ?? this.property.type.declaration?.signatures

            return signatures?.[0]
        },
        comment () {
            return this.property.comment ?? 
                (this.isMethodProperty() ? this.signature.comment : undefined)
        },
        parameters () {
            return this.isMethodProperty() ? this.signature.parameters : []
        }
    },

    methods: {

        isMethodProperty () {
            return this.property.kindString === 'Method' || this.signature !== undefined
        },

        sourceLink(source) {
            return `https://github.com/ghostrider-05/github-discord-events/blob/master/${source.fileName}#L${source.line}`;
        },

        formatExternalType(Package, name) {
            return `[${name}](https://npmjs.com/package/${Package})`;
        },

        renderMdTable (values) {
            const table = values.map(row => {
                return row 
                    ? `| ${row.join(' | ')} |` 
                    : `| ${Array.from({ length: values[0].length }).map(() => '-----').join(' | ')} |`
            }).join('\n')
            console.log(table)

            return this.md.render(table)
        },

        formatType(property) {
            const { type, flags } = property;
            if (!type) return ''
            const prefix = flags?.isOptional ? "?" : ""

            if (type.package && type.package !== 'typescript')
                return this.formatExternalType(type.package, type.name);

            if (type.type === 'reference' && 'id' in type) {
                const path = paths.find(p => p.id === type.id)?.path

                if (path) return `${prefix}[${type.name}](/github-discord-events${path})`
            }

            switch (type.type) {
                case 'intersection': 
                    return type.types
                        .filter(t => !('types' in t))
                        .map(t => this.formatType({ type: t }))
                        .join(" & ");
                case 'literal':
                case 'insintric':
                    return type.value === null ? 'null' : typeof type.value === 'string' ? `"${type.value}"` : type.value 
                case 'union':
                    return type.types.map(t => this.formatType({ type: t })).join(' | ')
            }

            if (type.typeArguments) return `${type.name}<${type.typeArguments.map(t => {
                return this.formatType({ type: t })
            }).join(', ')}>`

            return (flags?.isOptional ? "?" : "") + type?.name;
        },
    },
};
</script>

<style scoped>
.source-link {
    display: grid !important;
    float: right !important;
}

.source-link span {
    transform: scale(1.5);
}

.property-type {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
}

.property-type span {
    font-size: 1.2rem;
    margin-left: 1rem;
}

.property-type .badge {
    font-size: 1rem;
    margin-left: 0.5rem;
}
</style>