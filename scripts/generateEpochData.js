const fs = require('fs');
const { ethers } = require("ethers");


(async function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
    const daoAddr = "0x6Bf977ED1A09214E6209F4EA5f525261f1A2690a";
    const sushiswapPoolAddr = "0x26d8151e631608570F3c28bec769C3AfEE0d73a3";

    const daoAbi = [
        "function epoch() public view returns (uint256)"
    ];

    const sushiswapPoolAbi = [
        "function price0CumulativeLast() external view returns (uint)",
        "function price1CumulativeLast() external view returns (uint)",
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
    ];

    const daoContract = new ethers.Contract(daoAddr, daoAbi, provider);
    const uniContract = new ethers.Contract(sushiswapPoolAddr, sushiswapPoolAbi, provider);

    const epoch = await daoContract.epoch();
    const reserves = await uniContract.getReserves();
    const priceCumulative = await uniContract.price1CumulativeLast();

    const json =  {
        number: epoch.toString(),
        priceCumulative: priceCumulative.toString(),
        timestamp: reserves[2]
    };

    fs.writeFile('public/epoch.json', JSON.stringify(json), function (err) {
        if (err) throw err;
    });

})();