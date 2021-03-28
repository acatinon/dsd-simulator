<script lang="typescript">
  import type BigNumber from "bignumber.js";

  export let value: BigNumber;
</script>

<span>{value.toFormat(2)}</span>