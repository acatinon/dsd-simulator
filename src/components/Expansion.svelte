<script lang="typescript">
  import Big from "big.js";
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { supplyChangeLimit, supplyChangeDivisor } from "../settings";

  export let twap: any;
  export let totalSupply: any;

  
  const delta = derived(
    [twap.asBig(), supplyChangeDivisor.asBig()],
    ([$twap, $supplyChangeDivisor]) =>
    $twap.sub("1").div($supplyChangeDivisor)
  );
  
</script>

<p>{$delta}</p>
