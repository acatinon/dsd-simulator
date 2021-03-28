import { writable, derived, Readable, Writable } from "svelte/store";
import BigNumber from "bignumber.js";

export interface DecimalStore extends Writable<number> {
    asBig(): Readable<BigNumber>
}


export function decimal(init: number): DecimalStore {
	const store = writable(init);
    const bigStore = derived(store, $store => new BigNumber($store))

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