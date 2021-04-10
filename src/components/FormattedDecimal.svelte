<script lang="typescript">
  import type BigNumber from "bignumber.js";
  import type { Readable } from "svelte/store";

  export let store: Readable<BigNumber> | undefined = undefined;
  export let value: BigNumber | undefined = undefined;
  export let decimals = 2;

  if (store) {
    value = $store;
  }

</script>

<span>{value?.toFormat(decimals)}</span>