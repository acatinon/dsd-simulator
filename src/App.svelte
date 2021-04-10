<script lang="typescript">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { ethers } from "ethers";
  import BigNumber from "bignumber.js";

  import { web3 } from "./utils/web3";
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

  const twap = writable(new BigNumber(1));
  let dsd: DSD;
  let cdsd: CDSD;
  let dsdLp: LpToken;
  let cdsdLp: LpToken;
  let isLoaded = false;

  const web3Provider = web3();

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
      if (accounts.length > 0) {
        account = accounts[0];
      }

      dsdLpContract.getTwap().then((twapNumber) => {
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
  <nav class="level section">
    <div class="level-left">
      <div class="level-item">
        <p class="subtitle is-5">DSD Simulator</p>
      </div>
    </div>
    <div class="level-right">
      <p class="level-item">
        {#if $web3Provider.isConnected}
          <span class="tag is-primary is-light">{account}</span>
          <span class="icon" on:click={web3Provider.disconnect}>
            <ion-icon name="log-out-outline" />
          </span>
        {:else}
          <button class="button is-primary" on:click={connect}>Connect</button>
        {/if}
      </p>
    </div>
  </nav>
  {#if isLoaded}
  <section class="section columns">
    <!-- DSD -->
    <div class="column">
      <h3 class="subtitle">DSD</h3>
      <table class="table is-narrow is-fullwidth">
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
    <div class="column">
      <h3 class="subtitle">DSD LP</h3>
      <table class="table is-narrow is-fullwidth">
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
    <div class="column">
      <h3 class="subtitle">CDSD</h3>
      <table class="table is-narrow is-fullwidth">
        <tbody>
          <tr>
            <th>Total supply</th>
            <td class="has-text-right"><FormattedDecimal store={cdsd.totalSupply} /></td>
          </tr>
          <tr>
            <th>Total bonded</th>
            <td class="has-text-right"><FormattedDecimal store={cdsd.totalBonded} /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- CDSD LP -->
    <div class="column">
      <h3 class="subtitle">CDSD LP</h3>
      <table class="table is-narrow is-fullwidth">
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

  <section class="section">
    <h2 class="subtitle">Settings</h2>
    <form
      class="is-flex is-flex-direction-row is-justify-content-space-between"
    >
      <div class="field mr-2">
        <label class="label">TWAP</label>
        <div class="control">
          <FormattedDecimal store={twap} decimals={4} />
        </div>
      </div>
    
    </form>
  </section>

  <section class="section">
    <h2 class="subtitle">
      Next epoch
      {#if $twap.gt(1)}
        <span class="tag is-light is-success">Expansion</span>
      {/if}
      {#if $twap.lt(1)}
        <span class="tag is-light is-danger">Contraction</span>
      {/if}
    </h2>

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
  </section>
  {:else}
  <p>Loading</p>
  {/if}
</div>
