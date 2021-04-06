<script lang="typescript">
  import type BigNumber from "bignumber.js";

  export let value: BigNumber;
  export let decimals = 2;

</script>

<span>{value.toFormat(decimals)}</span>