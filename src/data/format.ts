import { Resolvers } from "./resolve.js"

type Split<S extends string, D extends string> =
    string extends S ? string[] :
    S extends '' ? [] :
    S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] :
    [S];

type SplitOnWordSeparator<T extends string> = Split<T, "-"|"_"|" ">;
type UndefinedToEmptyString<T extends string> = T extends undefined ? "" : T;
type CamelCaseStringArray<K extends string[]> = `${K[0]}${Capitalize<UndefinedToEmptyString<K[1]>>}`;

type CamelCase<K> = K extends string ? CamelCaseStringArray<SplitOnWordSeparator<K>> : K;

/**
 * Format default strings from the payload to readable outputs.
 * Also includes util methods for string formatting
 */
export class Formatters {
    // Utils

    public capitalize (input: string) {
        return input[0].toUpperCase() + input.slice(1)
    }

    public camelCase <T extends string>(string: T): CamelCase<T> {
        return string
            .toLowerCase()
            .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase()) as CamelCase<T>;
    }

    public mdLink (name: string, url: string) {
        return `[${name}](${url})`
    }

    public substring (string: string, limit: number) {
        return Resolvers.body(string, limit)!
    }

    // Payloads

    public action (action: string) {
        return action.includes('_') ? action.split('_').join(' ') : action
    }

    public actionTitle (
        action: 'created' | string, 
        options?: { 
            type?: string
            newAction?: string
            newActionName?: string
            append?: string
            repo?: string
        }
    ) {
        const { type, newAction, newActionName, repo } = options ?? {}
    
        const isCreated = action === (newAction ?? 'created')
        const prefix = isCreated ? 'New ' : ''

        const displayAction = this.action(isCreated ? newActionName ?? action : action)
        const output = (repo ? `[${repo}]` : '')
            + prefix 
            + (type ? type + displayAction : '')
            + (options?.append ? options.append : '')

        return this.capitalize(output)
    }

    public commitId (id: string) {
        return id.slice(0, 7)
    }

    public commitUrl (repoUrl: string, id: string) {
        return `${repoUrl}/commits/${this.commitId(id)}`
    }

    public ref (ref: string) {
        return ref.slice(ref.lastIndexOf('/') + 1)
    }
}
