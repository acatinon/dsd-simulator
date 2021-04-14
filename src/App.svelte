<script lang="typescript">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { ethers } from "ethers";
  import BigNumber from "bignumber.js";

  import { web3 } from "./utils/web3";
  import { darkTheme } from "./utils/theme";
  import { getEpoch } from "./utils/epoch";
  import {
    DaoContract,
    DsdTokenContract,
    CdsdTokenContract,
    DsdLiquidityPoolContract,
    CdsdLiquidityPoolContract,
    DsdPoolIncentivationContract,
    CdsdPoolIncentivationContract
  } from "./utils/contracts";
  import type {
    DSD,
    CDSD,
    LpToken,
  } from "./utils/tokens"

  import {
    buildDsdToken,
    buildCdsdToken,
    buildLpToken
  } from "./utils/tokens"
 

  import Expansion from "./components/Expansion.svelte";
  import Contraction from "./components/Contraction.svelte";
  import FormattedDecimal from "./components/FormattedDecimal.svelte";

  const twap = writable(new BigNumber(0));
  const epochNumber = writable("N/A");
  let dsd: DSD;
  let cdsd: CDSD;
  let dsdLp: LpToken;
  let cdsdLp: LpToken;
  let isLoaded = false;

  const web3Provider = web3();
  const isDark = darkTheme();

  let account = "";

  onMount(async () => {
    web3Provider.connectIfCachedProvider().then(onConnected);
  });

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    let dao = new DaoContract(ethersProvider);
    let dsdContract = new DsdTokenContract(ethersProvider);
    let cdsdContract = new CdsdTokenContract(ethersProvider);
    let dsdLpContract = new DsdLiquidityPoolContract(ethersProvider);
    let cdsdLpContract = new CdsdLiquidityPoolContract(ethersProvider);
    let dsdncentivationContract = new DsdPoolIncentivationContract(ethersProvider);
    let cdsdIncentivationContract = new CdsdPoolIncentivationContract(ethersProvider);

    ethersProvider.listAccounts().then(async (accounts: string[]) => {
      const epoch = await getEpoch();

      epochNumber.set(epoch.number);

      if (accounts.length > 0) {
        account = accounts[0];
      }

      dsdLpContract.getTwap(epoch).then((twapNumber) => {
        twap.set(twapNumber);
      });

      dsd = await buildDsdToken(dao, dsdContract);
      cdsd = await buildCdsdToken(dao, cdsdContract);
      dsdLp = await buildLpToken(dsdLpContract, dsdncentivationContract);
      cdsdLp = await buildLpToken(cdsdLpContract, cdsdIncentivationContract);
      isLoaded = true;
    });
  };
</script>

<div class="container">
  <nav class="flex">
    <div>
      <p class="text-xl">DSD Simulator</p>
    </div>
    <div class="flex-grow">
    </div>
    <div class="p-1">
      <button on:click={isDark.toggle}>
        {#if $isDark}
          <ion-icon name="sunny-outline" />
        {:else}
          <ion-icon name="moon-outline" />
        {/if}
      </button>
    </div>
    {#if $web3Provider.isConnected}
      <div class="p-1">
        <span class="tag">{account}</span>
      </div>
      <div class="p-1">
      <button  on:click={web3Provider.disconnect}>
        <ion-icon name="log-out-outline" />
      </button>
      </div>
    {:else}
      <button class="p-1" on:click={connect}>Connect</button>
    {/if}
  </nav>

  {#if isLoaded}
  <section class="grid gap-4 lg:gap-8 grid-cols-3 lg:grid-cols-6">
    <div class="tile">
      <h1>Epoch</h1>
      <span>{$epochNumber}</span>
    </div>
    <div class="tile">
      <h1>Spot price</h1>
      <FormattedDecimal store={dsdLp.price} decimals={4} />
    </div>
    <div class="tile">
      <h1>TWAP</h1>
      <FormattedDecimal store={twap} decimals={4} />
    </div>
    <div class="large-tile col-span-3">
      <h1>
        Next epoch
        {#if $twap.gt(1)}
          <span class="tag tag-green relative -top-0.5">Expansion</span>
        {/if}
        {#if $twap.lt(1)}
          <span class="tag tag-red relative -top-0.5">Contraction</span>
        {/if}
      </h1>
  
      {#if $twap.gt(1)}
        <Expansion
          {twap}
          totalSupplyDsd={dsd.totalSupply}
          totalBondedDsd={dsd.totalBonded}
          totalBondedDsdLp={dsdLp.totalBonded}
          totalBondedCdsd={cdsd.totalBonded}
        />
      {:else if $twap.lt(1)}
        <Contraction {twap} totalSupplyCdsd={cdsd.totalSupply} />
      {:else}
        <p>Status quo</p>
      {/if}
    </div>
  </section>

  <section class="grid gap-4 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <!-- DSD -->
    <div>
      <h3 class="subtitle">DSD</h3>
      <table class="token-summary">
        <tbody>
          <tr>
            <th>Total supply</th>
            <td class="has-text-right"><FormattedDecimal store={dsd.totalSupply} /></td>
          </tr>
          <tr>
            <th>Total bonded</th>
            <td class="has-text-right"><FormattedDecimal store={dsd.totalBonded} /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DSD LP -->
    <div>
      <h3 class="subtitle">DSD LP</h3>
      <table class="token-summary">
        <tbody>
          <tr>
            <th>Total supply</th>
            <td class="has-text-right"><FormattedDecimal store={dsdLp.totalSupply} /></td>
          </tr>
          <tr>
            <th>Total bonded</th>
            <td class="has-text-right"><FormattedDecimal store={dsdLp.totalBonded} /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CDSD -->
    <div>
      <h3 class="subtitle">CDSD</h3>
      <table class="token-summary">
        <tbody>
          <tr>
            <th>Total supply</th>
            <td class="has-text-right"><FormattedDecimal store={cdsd.totalSupply} /></td>
          </tr>
          <tr>
            <th>Total bonded</th>
            <td class="has-text-right"><FormattedDecimal store={cdsd.totalBonded} /></td>
          </tr>
          <tr>
            <th>Spot price</th>
            <td class="has-text-right"><FormattedDecimal store={cdsdLp.price} decimals={4} /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CDSD LP -->
    <div>
      <h3 class="subtitle">CDSD LP</h3>
      <table class="token-summary">
        <tbody>
          <tr>
            <th>Total supply</th>
            <td class="has-text-right"><FormattedDecimal store={cdsdLp.totalSupply} /></td>
          </tr>
          <tr>
            <th>Total bonded</th>
            <td class="has-text-right"><FormattedDecimal store={cdsdLp.totalBonded} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  {:else}
  <p>Loading</p>
  {/if}
</div>
