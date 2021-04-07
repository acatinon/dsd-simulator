import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const uniswapPoolAddr = "0x66e33d2605c5fb25ebb7cd7528e7997b0afa55e8";

const uniswapPoolAbi = [
    "function price0CumulativeLast() external view returns (uint)",
    "function price1CumulativeLast() external view returns (uint)",
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
];

export async function getTwap(ethersProvider: ethers.providers.Web3Provider): Promise<BigNumber> {

    const epochStartResponse = await fetch("/epoch.json");
    const epochStart = await epochStartResponse.json();

    const uniContract = new ethers.Contract(uniswapPoolAddr, uniswapPoolAbi, ethersProvider);

    const epochStartCumulativePrice = new BigNumber(epochStart.priceCumulative);
    const reserves = await uniContract.getReserves();

    const timeElapsed = new BigNumber(reserves[2].toString()).minus(epochStart.timestamp);

    if (timeElapsed.eq(0))
    {
        let reserve0 = new BigNumber(reserves[0].toString()).multipliedBy(new BigNumber(10).pow(12));
        let reserve1 = new BigNumber(reserves[1].toString());
        let spotPrice = reserve0.div(reserve1);

        return spotPrice;
    }

    const currentCumulativePrice: ethers.BigNumber = await uniContract.price1CumulativeLast();

    const priceAverage = new BigNumber(currentCumulativePrice.toString())
        .minus(epochStartCumulativePrice)
        .dividedBy(timeElapsed);

    return priceAverage
        .multipliedBy(1000000000000)
        .div(new BigNumber(2).pow(112))
}