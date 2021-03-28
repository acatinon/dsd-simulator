<script lang="typescript">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import { supplyChangeLimit, supplyChangeDivisor } from "../settings";
  import { DecimalStore } from "../utils";

  export let twap: DecimalStore;
  export let totalSupply: DecimalStore;

  
  const delta = derived(
    [twap.asBig(), supplyChangeDivisor.asBig()],
    ([$twap, $supplyChangeDivisor]) => $twap.sub("1").div($supplyChangeDivisor)
  );
  
</script>

<p>{$delta}</p>
