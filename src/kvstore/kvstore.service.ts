import { Injectable } from '@nestjs/common';

type KvstoreOptions = {
    /**
     * Time to live in seconds, before the value is deleted
     */
    ttl?: number
};

type Value = {
    value: any,

    // An expiration timestamp
    expiry: number
};

/**
 * This class implements a Key-Value store service, that can set, get, or delete a value
 */
@Injectable()
export class KvstoreService {
    private readonly store: Map<any, Value>;

    constructor() {
        this.store = new Map()
    }

    async set(key: any, value: any, opts?: KvstoreOptions) {
        let expiry = -1
        if (opts && opts.ttl) {
            expiry = Date.now() + opts.ttl * 1000
        }
        this.store.set(key, { value: value, expiry: expiry })
    }

    async delete(key: any) {
        this.store.delete(key)
    }

    async clear() {
        this.store.clear()
    }

    /**  
     * This function implements lazy deletion to handle expiry, but there is a caveat - 
     * If multiple values are set, and they are not retrieved, it can lead to memory overflow
     * So, the map should be cleared from time to time by calling clear method
     */
    async get(key: any): Promise<any | undefined> {
        const value = this.store.get(key)
        if (!value)
            return undefined;

        if (value.expiry > 0 && Date.now() > value.expiry) {
            this.delete(key)
            return undefined
        }

        return value.value
    }
}
