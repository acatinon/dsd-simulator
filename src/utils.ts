import { writable, derived } from "svelte/store";
import Big from "big.js";

export function decimal(init: number) {
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
        asBig: () => bigStore
	};
}