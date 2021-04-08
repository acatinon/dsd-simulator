import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const sushiswapPoolAddr = "0x26d8151e631608570F3c28bec769C3AfEE0d73a3";

const sushiswapPoolAbi = [
    "function price0CumulativeLast() external view returns (uint)",
    "function price1CumulativeLast() external view returns (uint)",
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function totalSupply() external view returns (uint)"
];

export async function getTwap(ethersProvider: ethers.providers.Web3Provider): Promise<BigNumber> {

    const epochStartResponse = await fetch("/epoch.json");
    const epochStart = await epochStartResponse.json();

    const poolContract = new ethers.Contract(sushiswapPoolAddr, sushiswapPoolAbi, ethersProvider);

    const epochStartCumulativePrice = new BigNumber(epochStart.priceCumulative);
    const reserves = await getReserves(ethersProvider);

    const timeElapsed = new BigNumber(reserves[2].toString()).minus(epochStart.timestamp);

    if (timeElapsed.eq(0))
    {
        let spotPrice = reserves[0].div(reserves[1]);

        return spotPrice;
    }

    const currentCumulativePrice: ethers.BigNumber = await poolContract.price1CumulativeLast();

    const priceAverage = new BigNumber(currentCumulativePrice.toString())
        .minus(epochStartCumulativePrice)
        .dividedBy(timeElapsed);

    return priceAverage
        .multipliedBy(1000000000000)
        .div(new BigNumber(2).pow(112))
}

export async function getReserves(ethersProvider: ethers.providers.Web3Provider): Promise<[BigNumber, BigNumber, BigNumber]> {
    const poolContract = new ethers.Contract(sushiswapPoolAddr, sushiswapPoolAbi, ethersProvider);
    
    const reserves = await poolContract.getReserves();

    return [
        new BigNumber(reserves[0].toString()).dividedBy(new BigNumber(10).pow(6)), 
        new BigNumber(reserves[1].toString()).dividedBy(new BigNumber(10).pow(18)),
        new BigNumber(reserves[2].toString())];
}

export async function getTotalSupply(ethersProvider: ethers.providers.Web3Provider): Promise<BigNumber> {
    const poolContract = new ethers.Contract(sushiswapPoolAddr, sushiswapPoolAbi, ethersProvider);
    const totalSupply = await poolContract.totalSupply();

    return new BigNumber(totalSupply.toString()).dividedBy(new BigNumber(10).pow(18));
}
