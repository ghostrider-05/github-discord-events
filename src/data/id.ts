
type NameDataNames = 'name' | 'title'
type IdDataNames = 'id'

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>> 
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

type DataRecord<K extends string, T> = RequireAtLeastOne<Record<K, T>> 

/**
 * Represents a structure that requires a name-like or id-like field
 */
export type NameOrIdData<
    T extends DataRecord<NameDataNames, string> | DataRecord<IdDataNames, number>
> = Omit<T, IdDataNames> | Omit<T, NameDataNames>
