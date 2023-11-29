import _fetch from 'node-fetch'

declare global {
    declare var fetch: typeof _fetch;
}
