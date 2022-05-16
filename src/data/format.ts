/**
 * Format default strings from the payload to readable outputs.
 * Also includes util methods for string formatting
 */
export class Formatters {
    // Utils

    public capitalize(input: string) {
        return input[0].toUpperCase() + input.slice(1)
    }

    // Payloads

    public action(action: string) {
        return action.includes('_') ? action.split('_').join(' ') : action
    }

    public commitId(id: string) {
        return id.slice(0, 7)
    }

    public commitUrl(repoUrl: string, id: string) {
        return `${repoUrl}/commits/${this.commitId(id)}`
    }

    public ref(ref: string) {
        return ref.slice(ref.lastIndexOf('/') + 1)
    }
}
