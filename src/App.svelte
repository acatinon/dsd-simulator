<script lang="typescript">
  import { onMount } from "svelte";
  import { decimal, web3 } from "./utils";

  import Expansion from "./components/Expansion.svelte";
  import FormattedDecimalInput from "./components/FormattedDecimalInput.svelte";

  const twap = decimal(1);
  const totalSupply = decimal(141_593_462);
  const bondedDsd = decimal(17_835_130);
  const bondedLp = decimal(3_578_883);
  const bondedCdsd = decimal(5_000_000);
  const web3Provider = web3();
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
          {#await $web3Provider.provider.listAccounts()}
            ...
          {:then accounts}
            <span class="tag is-primary is-light">{accounts[0]}</span>
          {/await}
        {:else}
          <button class="button is-primary" on:click={web3Provider.connect}>Connect</button>
        {/if}
      </p>
    </div>
  </nav>

  <section class="section">
    <h2 class="subtitle">Settings</h2>
    <form
      class="is-flex is-flex-direction-row is-justify-content-space-between"
    >
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
