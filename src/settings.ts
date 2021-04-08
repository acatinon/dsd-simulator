import { writable } from "svelte/store";
import BigNumber from "bignumber.js";


export const supplyChangeLimit = writable(new BigNumber("0.02")); // 2%
export const supplyChangeDivisor = writable(new BigNumber("25"));

export const oraclePoolRatio = writable(new BigNumber("0.40")) // 40%
export const treasuryRatio = writable(new BigNumber("0.03")) // 3%
export const cdsdRedemptionRatio = writable(new BigNumber("0.50")) // 50%