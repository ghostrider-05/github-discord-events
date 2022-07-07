<template>
    <div>
        <div class="flex">
            <h1>Rules</h1>
            <div class="action-buttons">
                <button 
                    class="action-button new-webhook secondary" 
                    @click="saveRules" 
                    :disabled="rules.some(r => !isSynced(r))"
                >Save rules</button>

                <button 
                    class="action-button new-webhook primary" 
                    @click="addRule"
                >New rule</button>
            </div>
        </div>

        <div class="rules" v-for="(rule, i) in rules" :key="i">
            <div>
                <div class="rule visible" @click="open = i === open ? -1 : i">
                    <p>{{ rule.tag !== '' ? rule.tag : `Rule ${i}` }}</p>
                    <p v-if="!isSynced(rule)">Not saved</p>
                </div>

                <div class="rule-content" v-if="open === i">
                    <input type="text" v-model="rules[i].tag">
                    <p>Discord Webhook</p>
                    <input type="text" v-model="rules[i].webhook.url">

                    <p>Events</p>
                    <div @click="rules[i].events = addItem(rules[i].events, { name: ''})">
                        Add
                    </div>

                    <div v-for="(event, j) in rules[i].events" :key="j">
                        <select v-model="event.name">
                            <option v-for="webhookEvent in events" :key="webhookEvent.name" :value="webhookEvent.rawName">
                                {{ webhookEvent.rawName }}
                            </option>
                        </select>
                        <div v-if="event.name !== ''">
                            <p>Required action:</p>
                            <select multiple v-model="rules[i].events[j].actions">
                                <option :value="undefined" selected>None</option>
                                <option v-for="action in events.find(e => e.rawName === event.name).actions" :key="action" :value="action">{{ action }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SCHEMA from "../../../node_modules/@octokit/webhooks-schemas/schema.json";
import { RuleBuilder } from '../../../dist/index.js'

const events = SCHEMA.oneOf.map(({ $ref: ref }) => {
    const $ref = ref.substring('#/definitions/'.length)

    const actions = SCHEMA.definitions[$ref] && 'oneOf' in SCHEMA.definitions[$ref] 
        ? SCHEMA.definitions[$ref].oneOf.map(({ $ref: _ref }) => _ref.split('$')[1]) 
        : []

    return {
        rawName: ref.substring('#/definitions/'.length, ref.length - '$event'.length),
        actions,
        ref,
        $ref
    }
})

console.log(events, SCHEMA)

console.log(new RuleBuilder({ url: 'test' }).rules)
export default {
    data() {
        return {
            open: -1,
            keys: ['tag', 'events'],
            events,
            rules: [
                {
                    tag: 'Test',
                    webhook: {
                        url: ''
                    },
                    events: []
                }
            ]
        }
    },

    watch: {
        rules(newRules, oldRules) {
            console.log(newRules)
        }
    },
    beforeCreate() {
        const webhooks = localStorage.getItem('stored-webhooks')
        this.rules = webhooks ? JSON.parse(webhooks) : [
                {
                    tag: 'Test'
                }
            ]
    },
    methods: {
        addItem (list, item) {
            return [
                item,
                ...list
            ]
        },
        addRule () {
            console.log('Add rule')
        },
        saveRules () {
            localStorage.setItem('stored-webhooks', JSON.stringify(this.rules))
        },
        isSynced (rule) {
            const rules = localStorage.getItem('stored-webhooks')
            return rules ? JSON.parse(rules).find(r => JSON.stringify(r) === JSON.stringify(rule)) : false
        }
    }
}
</script>

<style scoped>
.new-webhook {
    /* background-color: var(--c-brand); */
    padding: 6px 16px;
    max-height: 45px;
    border-radius: 4px;
    border: none;
    font-size: 20px;
    font-weight: 500;
    margin: 6px;
}

.primary {
    padding: 8px 16px;
    background-color: var(--c-brand);
}

.secondary {
    background-color: var(--c-bg);
    color: var(--c-text);
    border: 2px solid var(--c-brand);
}

.new-webhook:hover {
    cursor: pointer;
}

.rule {
    background-color: var(--c-details-bg);
    padding: 6px 26px;
    margin-top: 20px;
    border-radius: 6px;
}

.rule-content {
    background-color: var(--c-bg-light);
    margin-top: 3px;
    margin-bottom: 20px;
    padding: 6px 26px;
    border-radius: 6px;
}

.flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    align-items: center;
}
</style>