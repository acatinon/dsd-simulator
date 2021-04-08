import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const lpAddr = "0xf929fc6eC25850ce00e457c4F28cDE88A94415D8";

const lpAbi = [
    "function totalBonded() public view returns (uint256)"
];

export async function getTotalBonded(ethersProvider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const dsdContract = new ethers.Contract(lpAddr, lpAbi, ethersProvider);
    const totalSupply = await dsdContract.totalBonded();

    return new BigNumber(totalSupply.toString()).dividedBy(new BigNumber(10).pow(18));
}