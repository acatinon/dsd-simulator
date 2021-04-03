import { writable, derived, Readable, Writable } from "svelte/store";
import BigNumber from "bignumber.js";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

export interface DecimalStore extends Writable<number> {
	asBig(): Readable<BigNumber>;
}

export interface Web3Store extends Readable<Web3Provider> {
	connect(): void;
	connectIfCachedProvider(): void;
	disconnect(): void;
}

export interface Web3Provider {
	provider?: ethers.providers.Web3Provider;
	chainId?: number;
	isConnected: boolean;
}

export function web3(): Web3Store {
	const providerOptions = {
		/* See Provider Options Section */
	};

	const web3Modal = new Web3Modal({
		network: "mainnet",
		cacheProvider: true, // optional
		providerOptions
	});

	const init: Web3Provider = {
		provider: undefined,
		chainId: undefined,
		isConnected: false
	};

	const { subscribe, set, update } = writable(init);

	web3Modal.on("connect", (info: { chainId: number }) => {
		update(web3 => {
			web3.chainId = info.chainId;
			return web3;
		});
	});

	web3Modal.on("disconnect", (error: { code: number; message: string }) => {
		update(web3 => {
			web3.isConnected = false;
			web3.provider = undefined;
			web3.chainId = undefined;
			return web3;
		});
	});

	const onConnected = (provider: any): void => {
		update(web3 => {
			web3.provider = new ethers.providers.Web3Provider(provider);
			web3.isConnected = true;
			return web3;
		});
	}

	return {
		subscribe,
		connect: () => {
			web3Modal.connect().then(onConnected);
		},
		connectIfCachedProvider: () => {
			if (web3Modal.cachedProvider) {
				web3Modal.connect().then(onConnected);
			}
		},
		disconnect: () => {
			update(web3 => {
				web3.provider = undefined;
				web3.chainId = undefined;
				web3.isConnected = false;
				return web3;
			});
			web3Modal.clearCachedProvider();
		}
	}
}

export function decimal(init: number): DecimalStore {
	const store = writable(init);
	const bigStore = derived(store, $store => new BigNumber($store))

	return {
		subscribe: store.subscribe,
		set: (newValue: number) => {
			if (newValue != null) {
				store.set(newValue);
			}
		},
		update: store.update,
		asBig: () => bigStore
	};
}