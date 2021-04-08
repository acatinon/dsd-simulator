
import BigNumber from "bignumber.js";


export const supplyChangeLimit = new BigNumber("0.02"); // 2%
export const supplyChangeDivisor = new BigNumber("25");

export const oraclePoolRatio = new BigNumber("0.40") // 40%
export const treasuryRatio = new BigNumber("0.03") // 3%
export const cdsdRedemptionRatio = new BigNumber("0.50") // 50%

export const contractionPoolTargetSupply = new BigNumber("0.10") // 10%
export const contractionPoolTargetReward = new BigNumber("0.00029") // 0.029% per epoch ~ 250% APY