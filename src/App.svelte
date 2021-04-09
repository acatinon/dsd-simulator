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
 

  import Expansion from "./components/Expansion.svelte";
  import Contraction from "./components/Contraction.svelte";
  import FormattedDecimal from "./components/FormattedDecimal.svelte";

  const twap = writable(new BigNumber(1));
  const totalSupplyDsd = writable(new BigNumber(0));
  const totalSupplyCdsd = writable(new BigNumber(0));
  const totalBondedDsd = writable(new BigNumber(0));
  const totalBondedCdsd = writable(new BigNumber(0));
  const totalSupplyDsdLp = writable(new BigNumber(0));
  const totalSupplyCdsdLp = writable(new BigNumber(0));
  const totalBondedDsdLp = writable(new BigNumber(0));
  const totalBondedCdsdLp = writable(new BigNumber(0));

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
    let dsd = new DsdTokenContract(ethersProvider);
    let cdsd = new CdsdTokenContract(ethersProvider);
    let dsdLp = new DsdLiquidityPoolContract(ethersProvider);
    let cdsdLp = new CdsdLiquidityPoolContract(ethersProvider);
    let dsdPoolIncentivation = new DsdPoolIncentivationContract(ethersProvider);
    let cdsdPoolIncentivation = new CdsdPoolIncentivationContract(ethersProvider);

    ethersProvider.listAccounts().then((accounts: string[]) => {
      if (accounts.length > 0) {
        account = accounts[0];
      }

      dsdLp.getTwap().then((twapNumber) => {
        twap.set(twapNumber);
      });

      dsd.getTotalSupply().then((totalSupplyNumber) => {
        totalSupplyDsd.set(totalSupplyNumber);
      });

      cdsd.getTotalSupply().then((totalSupplyNumber) => {
        totalSupplyCdsd.set(totalSupplyNumber);
      });

      dao.getTotalDsdBonded().then((totalBondedNumber) => {
        totalBondedDsd.set(totalBondedNumber);
      });

      dao.getTotalCdsdBonded().then((toalBondedNumber) => {
        totalBondedCdsd.set(toalBondedNumber);
      });

      Promise.all([
        dsdPoolIncentivation.getTotalBonded(),
        dsdLp.getTotalSupply(),
        dsdLp.getReserves(),
      ]).then(
        ([totalBondedLpNumber, totalPoolSupplyNumber, reservesNumber]) => {
          totalSupplyDsdLp.set(reservesNumber[1]);

          totalBondedDsdLp.set(
            totalBondedLpNumber
              .multipliedBy(reservesNumber[1])
              .dividedBy(totalPoolSupplyNumber)
          );
        }
      );

      Promise.all([
        cdsdPoolIncentivation.getTotalBonded(),
        cdsdLp.getTotalSupply(),
        cdsdLp.getReserves(),
      ]).then(
        ([totalBondedLpNumber, totalPoolSupplyNumber, reservesNumber]) => {
          totalSupplyCdsdLp.set(reservesNumber[1]);

          totalBondedCdsdLp.set(
            totalBondedLpNumber
              .multipliedBy(reservesNumber[1])
              .dividedBy(totalPoolSupplyNumber)
          );
        }
      );
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

  <section class="section columns">
    <!-- DSD -->
    <div class="column">
      <h3 class="subtitle">DSD</h3>
      <table class="table is-narrow is-fullwidth">
        <tbody>
          <tr>
            <th>Total supply</th>
            <td class="has-text-right"><FormattedDecimal value={$totalSupplyDsd} /></td>
          </tr>
          <tr>
            <th>Bonded</th>
            <td class="has-text-right"><FormattedDecimal value={$totalBondedDsd} /></td>
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
            <td class="has-text-right"><FormattedDecimal value={$totalSupplyDsdLp} /></td>
          </tr>
          <tr>
            <th>Bonded</th>
            <td class="has-text-right"><FormattedDecimal value={$totalBondedDsdLp} /></td>
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
            <td class="has-text-right"><FormattedDecimal value={$totalSupplyCdsd} /></td>
          </tr>
          <tr>
            <th>Bonded</th>
            <td class="has-text-right"><FormattedDecimal value={$totalBondedCdsd} /></td>
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
            <td class="has-text-right"><FormattedDecimal value={$totalSupplyCdsdLp} /></td>
          </tr>
          <tr>
            <th>Bonded</th>
            <td class="has-text-right"><FormattedDecimal value={$totalBondedCdsdLp} /></td>
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
          <FormattedDecimal value={$twap} decimals={4} />
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
        {totalSupplyDsd}
        {totalBondedDsd}
        {totalBondedDsdLp}
        {totalBondedCdsd}
      />
    {:else if $twap.lt(1)}
      <Contraction {twap} {totalSupplyCdsd} />
    {:else}
      <p>Status quo</p>
    {/if}
  </section>
</div>
