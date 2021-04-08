<script lang="typescript">
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import type { Writable } from "svelte/store";
  import BigNumber from "bignumber.js";
  import {
    supplyChangeLimit,
    supplyChangeDivisor,
    oraclePoolRatio,
    treasuryRatio,
    cdsdRedemptionRatio,
  } from "../settings";

  import FormattedDecimal from "./FormattedDecimal.svelte";

  export let twap: Writable<BigNumber>;
  export let totalSupply: Writable<BigNumber>;
  export let totalBondedDsd: Writable<BigNumber>;
  export let totalBondedLp: Writable<BigNumber>;
  export let totalBondedCdsd: Writable<BigNumber>;

  const delta = derived(
    twap,
    $twap =>
      BigNumber.min(
        $twap.minus("1").div(supplyChangeDivisor),
        supplyChangeLimit
      )
  );

  const newSupply = derived(
    [delta, totalSupply],
    ([$delta, $totalSupply]) => $delta.multipliedBy($totalSupply)
  );

  const lpRewardAmount = derived(
    newSupply,
    $newSupply =>
      $newSupply.multipliedBy(oraclePoolRatio)
  );

  const lpRewardRatio = derived(
    [lpRewardAmount, totalBondedLp],
    ([$lpRewardAmount, $totalBondedLp]) => $lpRewardAmount.dividedBy($totalBondedLp)
  );

  const treasuryAmount = derived(
    newSupply,
    $newSupply => $newSupply.multipliedBy(treasuryRatio)
  );

  const cdsdRedeemableAmount = derived(
    [newSupply, totalBondedCdsd],
    ([$newSupply, $totalBondedCdsd]) =>
      BigNumber.min($newSupply.multipliedBy(cdsdRedemptionRatio), $totalBondedCdsd)
  );

  const cdsdRedeemableRatio = derived(
    [cdsdRedeemableAmount, totalBondedCdsd],
    ([$cdsdRedeemableAmount, $totalBondedCdsd]) =>
      $cdsdRedeemableAmount.dividedBy($totalBondedCdsd)
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
    [dsdRedeemableAmount, totalBondedDsd],
    ([$dsdRedeemableAmount, $totalBondedDsd]) =>
      $dsdRedeemableAmount.dividedBy($totalBondedDsd)
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
