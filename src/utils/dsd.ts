
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const dsdAddr = "0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3";

const dsdAbi = [
    "function totalSupply() external view returns (uint256)"
];

export async function getTotalSupply(ethersProvider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const dsdContract = new ethers.Contract(dsdAddr, dsdAbi, ethersProvider);
    const totalSupply = await dsdContract.totalSupply();

    return new BigNumber(totalSupply.toString()).dividedBy(new BigNumber(10).pow(18));
}