import { decimal } from "./utils/decimal" 

export const usdcAddr = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const supplyChangeLimit = decimal(0.02); // 2%
export const supplyChangeDivisor = decimal(25);

export const oraclePoolRatio = decimal(0.40) // 40%
export const treasuryRatio = decimal(0.03) // 3%
export const cdsdRedemptionRatio = decimal(0.50) // 50%