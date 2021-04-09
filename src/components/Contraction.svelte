<script lang="typescript">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import type { Writable } from "svelte/store";
  import type BigNumber from "bignumber.js";
  import {
    contractionPoolTargetSupply,
    contractionPoolTargetReward,
  } from "../settings";

  import FormattedDecimal from "./FormattedDecimal.svelte";

  export let twap: Writable<BigNumber>;
  export let totalSupplyCdsd: Writable<BigNumber>;

  // CPool rewards
  let cPoolRewardAmount = derived(totalSupplyCdsd, ($totalSupplyCdsd) =>
    $totalSupplyCdsd
      .multipliedBy(contractionPoolTargetSupply)
      .multipliedBy(contractionPoolTargetReward)
  );
</script>

<p>Contraction {$twap}</p>

<p>CPool rewards <FormattedDecimal value={$cPoolRewardAmount} /> CDSD</p>
