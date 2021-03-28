<script lang="typescript">
  import { onMount } from "svelte";
  import { decimal } from "./utils" 

  import Expansion from './components/Expansion.svelte';

  const twap = decimal(1);
  const totalSupply = decimal(21_300_000);
  let bondedDao: number;
  let bondedLp: number;

</script>

<section class="hero">
  <div class="hero-body">
    <h1 class="title">Welcome to DSD Simulator!</h1>
  </div>
</section>

<section class="section">
  <h2 class="subtitle">Settings</h2>
  <form class="is-flex is-flex-direction-row">
    <div class="field mr-2">
      <label class="label">Total supply</label>
      <div class="control">
        <input class="input" type="number"  bind:value={$totalSupply}/>
      </div>
    </div>
    <div class="field mr-2">
      <label class="label">TWAP</label>
      <div class="control">
        <input class="input" type="number" min="0" step="0.1" bind:value={$twap} />
      </div>
    </div>
  </form>
</section>

<section class="section">
  <h2 class="subtitle">Wallet</h2>
  <form class="is-flex is-flex-direction-row">
    <div class="field mr-2">
      <label class="label">Bonded DAO</label>
      <div class="control">
        <input class="input" type="number" bind:value={bondedDao} />
      </div>
    </div>
    <div class="field mr-2">
      <label class="label">Bonded LP</label>
      <div class="control">
        <input class="input" type="number" bind:value={bondedLp} />
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

  <Expansion twap={twap} totalSupply={totalSupply} />
</section>
