<script lang="typescript">
  import { onMount } from "svelte";
  import { decimal } from "./utils" 

  import Expansion from './components/Expansion.svelte';
  import FormattedDecimalInput from './components/FormattedDecimalInput.svelte';

  const twap = decimal(1);
  const totalSupply = decimal(141_593_462);
  const bondedDao = decimal(17_835_130);
  const bondedLp = decimal(3_578_883);

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
      <label class="label">Bonded DAO</label>
      <div class="control">
        <FormattedDecimalInput store={bondedDao} />
      </div>
    </div>
    <div class="field mr-2">
      <label class="label">Bonded LP</label>
      <div class="control">
        <FormattedDecimalInput store={bondedLp} />
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

  <Expansion twap={twap} totalSupply={totalSupply} bondedDao={bondedDao} bondedLp={bondedLp} />
</section>
