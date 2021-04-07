<script lang="typescript">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import type { ethers } from "ethers";
  import BigNumber from "bignumber.js";

  import { decimal } from "./utils/decimal";
  import { web3 } from "./utils/web3";
  import { getTwap } from "./utils/uniswapPool";
  import { getTotalSupply } from "./utils/dsd";

  import Expansion from "./components/Expansion.svelte";
  import FormattedDecimalInput from "./components/FormattedDecimalInput.svelte";
  import FormattedDecimal from "./components/FormattedDecimal.svelte";

  const twap = writable(new BigNumber(1));
  const totalSupply = writable(new BigNumber(0));
  const bondedDsd = decimal(17_835_130);
  const bondedLp = decimal(3_578_883);
  const bondedCdsd = decimal(5_000_000);
  const web3Provider = web3();

  let account = "";

  onMount(async () => {
    web3Provider.connectIfCachedProvider().then(onConnected);
  });

  const connect = () => {
    web3Provider.connect().then(onConnected);
  };

  const onConnected = async (ethersProvider: ethers.providers.Web3Provider) => {
    ethersProvider.listAccounts().then((accounts: string[]) => {
      if (accounts.length > 0) {
        account = accounts[0];
      }

      getTwap(ethersProvider).then((twapNumber) => {
        twap.set(twapNumber);
      });

      getTotalSupply(ethersProvider).then((totalSupplyNumber) => {
        totalSupply.set(totalSupplyNumber);
      });
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

  <section class="section">
    <h2 class="subtitle">Settings</h2>
    <form class="is-flex is-flex-direction-row is-justify-content-space-between">
      <div class="field mr-2">
        <label class="label">TWAP</label>
        <div class="control">
          <FormattedDecimal value={$twap} decimals={4} />
        </div>
      </div>
      <div class="field mr-2">
        <label class="label">Total supply</label>
        <div class="control">
          <FormattedDecimal value={$totalSupply} />
        </div>
      </div>
      <div class="field mr-2">
        <label class="label">Bonded DSD</label>
        <div class="control">
          <FormattedDecimalInput store={bondedDsd} />
        </div>
      </div>
      <div class="field mr-2">
        <label class="label">Bonded LP</label>
        <div class="control">
          <FormattedDecimalInput store={bondedLp} />
        </div>
      </div>
      <div class="field mr-2">
        <label class="label">Bonded CDSD</label>
        <div class="control">
          <FormattedDecimalInput store={bondedCdsd} />
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

    <Expansion {twap} {totalSupply} {bondedDsd} {bondedLp} {bondedCdsd} />
  </section>
</div>
