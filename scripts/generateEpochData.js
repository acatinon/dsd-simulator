const fs = require('fs');
const { ethers } = require("ethers");


(async function () {
    const uniswapPoolAddr = "0x66e33d2605c5fb25ebb7cd7528e7997b0afa55e8";
    const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);

    const uniswapPoolAbi = [
        "function price0CumulativeLast() external view returns (uint)",
        "function price1CumulativeLast() external view returns (uint)",
        "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
    ];

    const uniContract = new ethers.Contract(uniswapPoolAddr, uniswapPoolAbi, provider);

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