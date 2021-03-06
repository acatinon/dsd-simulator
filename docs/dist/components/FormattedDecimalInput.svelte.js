/* src/components/FormattedDecimalInput.svelte generated by Svelte v3.35.0 */
import {
	SvelteComponent,
	action_destroyer,
	attr,
	detach,
	element,
	init,
	insert,
	listen,
	noop,
	run_all,
	safe_not_equal
} from "../pkg/svelte/internal.js";

import { tick } from "../pkg/svelte.js";
import { get } from "../pkg/svelte/store.js";
import { imask } from "../pkg/svelte-imask.js";

function create_fragment(ctx) {
	let input;
	let imask_action;
	let mounted;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "class", "input");
			input.value = /*value*/ ctx[0];
		},
		m(target, anchor) {
			insert(target, input, anchor);

			if (!mounted) {
				dispose = [
					action_destroyer(imask_action = imask.call(null, input, /*options*/ ctx[1])),
					listen(input, "complete", /*complete*/ ctx[2])
				];

				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { store } = $$props;
	let value = get(store);

	const options = {
		mask: Number,
		scale: 2,
		signed: false,
		thousandsSeparator: ",",
		radix: ".",
		padFractionalZeros: true
	};

	function complete(maskRef) {
		store.set(maskRef.detail.unmaskedValue);
	}

	$$self.$$set = $$props => {
		if ("store" in $$props) $$invalidate(3, store = $$props.store);
	};

	return [value, options, complete, store];
}

class FormattedDecimalInput extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { store: 3 });
	}
}

export default FormattedDecimalInput;