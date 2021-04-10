import { Writable, writable } from "svelte/store";
import type BigNumber from "bignumber.js";
import type { DaoContract, TokenContract, LiquidityPoolContract, PoolIncentivationContract } from "./contracts";

export interface Token {
  totalSupply: Writable<BigNumber>;
  totalBonded: Writable<BigNumber>;
}

export interface LpToken extends Token {
}

export async function buildToken(dao: DaoContract, token: TokenContract): Promise<Token> {
  return {
    totalSupply: writable(await token.getTotalSupply()),
    totalBonded: writable(await token.getTotalBonded(dao))
  }
}

export async function buildLpToken(lpToken: LiquidityPoolContract, incentivePool: PoolIncentivationContract): Promise<LpToken> {
  return Promise.all([
    incentivePool.getTotalBonded(),
    lpToken.getTotalSupply(),
    lpToken.getReserves(),
  ]).then(([totalBondedLpNumber, totalPoolSupplyNumber, reservesNumber]) => {
    return {
      totalSupply: writable(reservesNumber[1]),
      totalBonded: writable(totalBondedLpNumber.multipliedBy(reservesNumber[1]).dividedBy(totalPoolSupplyNumber))
    }
  });
}