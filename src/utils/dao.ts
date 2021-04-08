import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const daoAddr = "0x6Bf977ED1A09214E6209F4EA5f525261f1A2690a";

const daoAbi = [
    "function totalBonded() public view returns (uint256)"
];

export async function getTotalBonded(ethersProvider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const dsdContract = new ethers.Contract(daoAddr, daoAbi, ethersProvider);
    const totalSupply = await dsdContract.totalBonded();

    return new BigNumber(totalSupply.toString()).dividedBy(new BigNumber(10).pow(18));
}