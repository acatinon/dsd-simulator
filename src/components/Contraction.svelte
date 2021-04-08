<script lang="typescript">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import type { Writable } from "svelte/store";
  import type BigNumber from "bignumber.js";

  export let twap: Writable<BigNumber>;
  export let totalSupply: Writable<BigNumber>;
</script>
<p>Contraction {$twap} </p>