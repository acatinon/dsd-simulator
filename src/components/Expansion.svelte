<script lang="typescript">
  import { onMount } from "svelte";
  import { writable, derived } from "svelte/store";
  import BigNumber from "bignumber.js";
  import {
    supplyChangeLimit,
    supplyChangeDivisor,
    oraclePoolRatio,
    treasuryRatio,
    cdsdRedemptionRatio,
  } from "../settings";
  import type { DecimalStore } from "../utils";

  import FormattedDecimal from "./FormattedDecimal.svelte";

  export let twap: DecimalStore;
  export let totalSupply: DecimalStore;
  export let bondedDsd: DecimalStore;
  export let bondedLp: DecimalStore;
  export let bondedCdsd: DecimalStore;

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

  const lpRewardAmount = derived(
    [newSupply, oraclePoolRatio.asBig()],
    ([$newSupply, $oraclePoolRatio]) =>
      $newSupply.multipliedBy($oraclePoolRatio)
  );

  const lpRewardRatio = derived(
    [lpRewardAmount, bondedLp.asBig()],
    ([$lpRewardAmount, $bondedLp]) => $lpRewardAmount.dividedBy($bondedLp)
  );

  const treasuryAmount = derived(
    [newSupply, treasuryRatio.asBig()],
    ([$newSupply, $treasuryRatio]) => $newSupply.multipliedBy($treasuryRatio)
  );

  const cdsdRedeemableAmount = derived(
    [newSupply, cdsdRedemptionRatio.asBig(), bondedCdsd.asBig()],
    ([$newSupply, $cdsdRedemptionRatio, $bondedCdsd]) =>
      BigNumber.min($newSupply.multipliedBy($cdsdRedemptionRatio), $bondedCdsd)
  );

  const cdsdRedeemableRatio = derived(
    [cdsdRedeemableAmount, bondedCdsd.asBig()],
    ([$cdsdRedeemableAmount, $bondedCdsd]) =>
      $cdsdRedeemableAmount.dividedBy($bondedCdsd)
  );

  const dsdRedeemableAmount = derived(
    [newSupply, lpRewardAmount, treasuryAmount, cdsdRedeemableAmount],
    ([$newSupply, $lpRewardAmount, $treasuryAmount, $cdsdRedeemableAmount]) =>
      $newSupply
        .minus($lpRewardAmount)
        .minus($treasuryAmount)
        .minus($cdsdRedeemableAmount)
  );

  const dsdRedeemableRatio = derived(
    [dsdRedeemableAmount, bondedDsd.asBig()],
    ([$dsdRedeemableAmount, $bondedCdsd]) =>
      $dsdRedeemableAmount.dividedBy($bondedCdsd)
  );
</script>

<p>
  The supply will be increased by <FormattedDecimal value={$newSupply} /> DSD.
</p>
<p>
  Returning <FormattedDecimal value={$lpRewardRatio.multipliedBy(100)} />% for
  bonded LP, and <FormattedDecimal
    value={$dsdRedeemableRatio.multipliedBy(100)}
  />% for bonded DAO per epoch.
</p>
<p>
  You will be able to redeem <FormattedDecimal
    value={$cdsdRedeemableRatio.multipliedBy(100)}
  />% of your bonded CDSD.
</p>
