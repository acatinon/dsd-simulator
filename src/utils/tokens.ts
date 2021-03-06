import { Writable, writable } from "svelte/store";
import type BigNumber from "bignumber.js";
import type { DaoContract, TokenContract, LiquidityPoolContract, PoolIncentivationContract } from "./contracts";

export interface Token {
  totalSupply: Writable<BigNumber>;
  totalBonded: Writable<BigNumber>;
  wallet: Writable<BigNumber>;
}

export interface DSD extends Token {
  totalSupply: Writable<BigNumber>;
  totalBonded: Writable<BigNumber>;
}

export interface CDSD extends Token {
  totalEarnable: Writable<BigNumber>;
  totalEarned: Writable<BigNumber>;
  totalRedeemable: Writable<BigNumber>;
}

export interface LpToken extends Token {
  price: Writable<BigNumber>;
}

export async function buildDsdToken(dao: DaoContract, dsdContract: TokenContract, account: string): Promise<DSD> {
  return {
    totalSupply: writable(await dsdContract.getTotalSupply()),
    totalBonded: writable(await dao.getTotalDsdBonded()),
    wallet: writable(await dsdContract.getBalance(account)),
  }
}

export async function buildCdsdToken(dao: DaoContract, cdsdContract: TokenContract, account: string): Promise<CDSD> {
  return {
    totalSupply: writable(await cdsdContract.getTotalSupply()),
    totalBonded: writable(await dao.getTotalCdsdBonded()),
    totalEarnable: writable(await dao.getTotalCdsdEarnable()),
    totalEarned: writable(await dao.getTotalCdsdEarned()),
    totalRedeemable: writable(await dao.getTotalCdsdRedeemable()),
    wallet: writable(await cdsdContract.getBalance(account)),
  }
}


export async function buildLpToken(lpToken: LiquidityPoolContract, incentivePool: PoolIncentivationContract, account: string): Promise<LpToken> {
  return Promise.all([
    incentivePool.getTotalBonded(),
    lpToken.getTotalSupply(),
    lpToken.getReserves(),
    lpToken.getBalance(account)
  ]).then(([totalBondedLpNumber, totalPoolSupplyNumber, reservesNumber, balance]) => {
    return {
      totalSupply: writable(reservesNumber[1]),
      totalBonded: writable(totalBondedLpNumber.multipliedBy(reservesNumber[1]).dividedBy(totalPoolSupplyNumber)),
      price: writable(reservesNumber[0].dividedBy(reservesNumber[1])),
      wallet:  writable(balance)
    }
  });
}