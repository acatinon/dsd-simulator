<script lang="typescript">
  import { onMount } from "svelte";
  import type { ethers } from "ethers";

  import { decimal } from "./utils/decimal";
  import { web3 } from "./utils/web3";

  import Expansion from "./components/Expansion.svelte";
  import FormattedDecimalInput from "./components/FormattedDecimalInput.svelte";

  const twap = decimal(1);
  const totalSupply = decimal(141_593_462);
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
          <FormattedDecimalInput store={twap} />
        </div>
      </div>
      <div class="field mr-2">
        <label class="label">Total supply</label>
        <div class="control">
          <FormattedDecimalInput store={totalSupply} />
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
      {#if $twap > 1}
        <span class="tag is-light is-success">Expansion</span>
      {/if}
      {#if $twap < 1}
        <span class="tag is-light is-danger">Contraction</span>
      {/if}
    </h2>

    <Expansion {twap} {totalSupply} {bondedDsd} {bondedLp} {bondedCdsd} />
  </section>
</div>
