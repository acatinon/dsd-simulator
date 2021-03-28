<script lang="typescript">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import BigNumber from "bignumber.js";
  import {
    supplyChangeLimit,
    supplyChangeDivisor,
    oraclePoolRatio,
  } from "../settings";
  import type { DecimalStore } from "../utils";

  import FormattedDecimal from "./FormattedDecimal.svelte";

  export let twap: DecimalStore;
  export let totalSupply: DecimalStore;
  export let bondedDao: DecimalStore;
  export let bondedLp: DecimalStore;

  const delta = derived(
    [twap.asBig(), supplyChangeDivisor.asBig(), supplyChangeLimit.asBig()],
    ([$twap, $supplyChangeDivisor, $supplyChangeLimit]) =>
      BigNumber.min(
        $twap.minus("1").div($supplyChangeDivisor),
        $supplyChangeLimit
      )
  );

  const newSupply = derived(
    [delta, totalSupply.asBig()],
    ([$delta, $totalSupply]) => $delta.multipliedBy($totalSupply)
  );

  const lpRewardRatio = derived(
    [newSupply, oraclePoolRatio.asBig(), totalSupply.asBig(), bondedLp.asBig()],
    ([$newSupply, $oraclePoolRatio, $totalSupply, $bondedLp]) =>
      $newSupply
        .multipliedBy($oraclePoolRatio)
        .dividedBy($bondedLp)
  );
</script>

<p>
  The supply will be increased by <FormattedDecimal value={$newSupply} /> DSD.
</p>
<p>
  Returning <FormattedDecimal value={$lpRewardRatio.multipliedBy(100)} />% for bonded LP, and xx% for
  bonded DAO per epoch.
</p>
