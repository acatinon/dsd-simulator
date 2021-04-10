import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const decimalDivisor = new BigNumber(10).pow(18);

const daoAddr = "0x6Bf977ED1A09214E6209F4EA5f525261f1A2690a";
const dsdTokenAddr = "0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3";
const cdsdTokenAddr = "0xDe25486CCb4588Ce5D9fB188fb6Af72E768a466a";
const dsdLpAddr = "0x26d8151e631608570F3c28bec769C3AfEE0d73a3";
const cdsdLpAddr = "0x4a4572D92Daf14D29C3b8d001A2d965c6A2b1515"
const dsdPoolIncentivationAddr = "0xf929fc6eC25850ce00e457c4F28cDE88A94415D8";
const cdsdPoolIncentivationAddr = "0x170cec2070399B85363b788Af2FB059DB8Ef8aeD";

const daoAbi = [
    "function totalBonded() public view returns (uint256)",
    "function totalCDSDBonded() public view returns (uint256)",
    "function totalCDSDEarnable() public view returns (uint256)",
    "function totalCDSDEarned() public view returns (uint256)",
    "function totalCDSDRedeemable() public view returns (uint256)"
];

const tokenAbi = [
    "function totalSupply() external view returns (uint256)"
];

const liquidityPoolAbi = [
    "function price0CumulativeLast() external view returns (uint)",
    "function price1CumulativeLast() external view returns (uint)",
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function totalSupply() external view returns (uint)"
];

const poolIncentivationAbi = [
    "function totalBonded() public view returns (uint256)"
];


class Contract {
    protected ethersContract: ethers.Contract;

    constructor(ethersProvider: ethers.providers.Web3Provider, addr: string, abi: Array<string>)
    {
        this.ethersContract = new ethers.Contract(addr, abi, ethersProvider);
    }
}

export class DaoContract extends Contract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, daoAddr, daoAbi)
    }

    public async getTotalDsdBonded(): Promise<BigNumber> {
        const totalBonded = await this.ethersContract.totalBonded();
    
        return new BigNumber(totalBonded.toString()).dividedBy(decimalDivisor);
    }
    
    public async getTotalCdsdBonded(): Promise<BigNumber> {
        const totalBonded = await this.ethersContract.totalCDSDBonded();
    
        return new BigNumber(totalBonded.toString()).dividedBy(decimalDivisor);
    }

    public async getTotalCdsdEarnable(): Promise<BigNumber> {
        const totalBonded = await this.ethersContract.totalCDSDEarnable();
    
        return new BigNumber(totalBonded.toString()).dividedBy(decimalDivisor);
    }

    public async getTotalCdsdEarned(): Promise<BigNumber> {
        const totalBonded = await this.ethersContract.totalCDSDEarned();
    
        return new BigNumber(totalBonded.toString()).dividedBy(decimalDivisor);
    }

    public async getTotalCdsdRedeemable(): Promise<BigNumber> {
        const totalBonded = await this.ethersContract.totalCDSDRedeemable();
    
        return new BigNumber(totalBonded.toString()).dividedBy(decimalDivisor);
    }
}

export abstract class TokenContract extends Contract {

    constructor(ethersProvider: ethers.providers.Web3Provider, addr: string)
    {
        super(ethersProvider, addr, tokenAbi)
    }

    public async getTotalSupply(): Promise<BigNumber> {
        const totalSupply = await this.ethersContract.totalSupply();
    
        return new BigNumber(totalSupply.toString()).dividedBy(decimalDivisor);
    }

    public abstract getTotalBonded(dao: DaoContract): Promise<BigNumber>;
}

export class DsdTokenContract extends TokenContract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, dsdTokenAddr)
    }

    public async getTotalBonded(dao: DaoContract): Promise<BigNumber> {
        return dao.getTotalDsdBonded();
    }
}

export class CdsdTokenContract extends TokenContract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, cdsdTokenAddr)
    }

    public async getTotalBonded(dao: DaoContract): Promise<BigNumber> {
        return dao.getTotalCdsdBonded();
    }
}

export class LiquidityPoolContract extends Contract {

    constructor(ethersProvider: ethers.providers.Web3Provider, addr: string)
    {
        super(ethersProvider, addr, liquidityPoolAbi)
    }

    public async getTwap(): Promise<BigNumber> {

        const epochStartResponse = await fetch("/epoch.json");
        const epochStart = await epochStartResponse.json();    
        const epochStartCumulativePrice = new BigNumber(epochStart.priceCumulative);
        const reserves = await this.getReserves();
    
        const timeElapsed = new BigNumber(reserves[2].toString()).minus(epochStart.timestamp);
    
        if (timeElapsed.eq(0))
        {
            let spotPrice = reserves[0].div(reserves[1]);
    
            return spotPrice;
        }
    
        const currentCumulativePrice: ethers.BigNumber = await this.ethersContract.price1CumulativeLast();
    
        const priceAverage = new BigNumber(currentCumulativePrice.toString())
            .minus(epochStartCumulativePrice)
            .dividedBy(timeElapsed);
    
        return priceAverage
            .multipliedBy(1000000000000)
            .div(new BigNumber(2).pow(112))
    }
    
    public async getReserves(): Promise<[BigNumber, BigNumber, BigNumber]> {
        const reserves = await this.ethersContract.getReserves();
    
        return [
            new BigNumber(reserves[0].toString()).dividedBy(new BigNumber(10).pow(6)), 
            new BigNumber(reserves[1].toString()).dividedBy(new BigNumber(10).pow(18)),
            new BigNumber(reserves[2].toString())];
    }
    
    public async getTotalSupply(): Promise<BigNumber> {
        const totalSupply = await this.ethersContract.totalSupply();
    
        return new BigNumber(totalSupply.toString()).dividedBy(new BigNumber(10).pow(18));
    }
}

export class DsdLiquidityPoolContract extends LiquidityPoolContract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, dsdLpAddr)
    }
}

export class CdsdLiquidityPoolContract extends LiquidityPoolContract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, cdsdLpAddr)
    }
}

export class PoolIncentivationContract extends Contract {

    constructor(ethersProvider: ethers.providers.Web3Provider, addr: string)
    {
        super(ethersProvider, addr, poolIncentivationAbi)
    }

    public async getTotalBonded(): Promise<BigNumber> {
        const totalSupply = await this.ethersContract.totalBonded();
    
        return new BigNumber(totalSupply.toString()).dividedBy(decimalDivisor);
    }
}

export class DsdPoolIncentivationContract extends PoolIncentivationContract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, dsdPoolIncentivationAddr)
    }
}

export class CdsdPoolIncentivationContract extends PoolIncentivationContract {

    constructor(ethersProvider: ethers.providers.Web3Provider)
    {
        super(ethersProvider, cdsdPoolIncentivationAddr)
    }
}