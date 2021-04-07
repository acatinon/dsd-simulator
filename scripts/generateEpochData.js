const fs = require('fs');
const { ethers } = require("ethers");


(async function () {
    const sushiswapPoolAddr = "0x26d8151e631608570F3c28bec769C3AfEE0d73a3";
    const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);

    const sushiswapPoolAbi = [
        "function price0CumulativeLast() external view returns (uint)",
        "function price1CumulativeLast() external view returns (uint)",
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
    ];

    const uniContract = new ethers.Contract(sushiswapPoolAddr, sushiswapPoolAbi, provider);

    const reserves = await uniContract.getReserves();
    const priceCumulative = await uniContract.price1CumulativeLast();

    const json =  {
        priceCumulative: priceCumulative.toString(),
        timestamp: reserves[2]
    };

    fs.writeFile('public/epoch.json', JSON.stringify(json), function (err) {
        if (err) throw err;
    });

})();