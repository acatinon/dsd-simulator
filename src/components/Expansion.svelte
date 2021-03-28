<script lang="typescript">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import BigNumber from "bignumber.js";
  import { supplyChangeLimit, supplyChangeDivisor } from "../settings";
  import type { DecimalStore } from "../utils";

  export let twap: DecimalStore;
  export let totalSupply: DecimalStore;

  
  const delta = derived(
    [twap.asBig(), supplyChangeDivisor.asBig(), supplyChangeLimit.asBig()],
    ([$twap, $supplyChangeDivisor, $supplyChangeLimit]) => BigNumber.min($twap.minus("1").div($supplyChangeDivisor), $supplyChangeLimit)
  );
  
</script>

<p>{$delta}</p>
