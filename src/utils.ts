import { writable, derived, Readable, Writable } from "svelte/store";
import Big from "big.js";

export interface DecimalStore extends Writable<number> {
    asBig(): Readable<Big>
}


export function decimal(init: number): DecimalStore {
	const store = writable(init);
    const bigStore = derived(store, $store => new Big($store))

	return {
		subscribe: store.subscribe,
		set: (newValue: number) => {
			if (newValue != null)
			{
				store.set(newValue);
			}
		},
		update: store.update,
        asBig: () => bigStore
	};
}