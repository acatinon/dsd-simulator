<script lang="typescript">
  import { tick } from 'svelte';
  import { get } from "svelte/store";
  import { imask } from 'svelte-imask';

  export let store: any;

  let value: number = get(store);

  const options = {
    mask: Number,
    scale: 2,  // digits after point, 0 for integers
    signed: false,  // disallow negative
    thousandsSeparator: ',',
    radix: '.',
    padFractionalZeros: true
  }

  function complete(maskRef: any) {
    store.set(maskRef.detail.unmaskedValue);
  }

</script>

<input class="input" {value} use:imask={options} on:complete={complete} />