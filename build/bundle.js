
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Node.svelte generated by Svelte v3.46.3 */
    const file$3 = "src\\components\\Node.svelte";

    function create_fragment$3(ctx) {
    	let div;

    	let t_value = (/*node*/ ctx[0].solutionOrder
    	? /*node*/ ctx[0].solutionOrder
    	: /*node*/ ctx[0].edges.size) + "";

    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "node svelte-182922q");
    			set_style(div, "left", /*node*/ ctx[0].x + "px");
    			set_style(div, "top", /*node*/ ctx[0].y + "px");

    			set_style(div, "background-color", /*node*/ ctx[0].isSelected
    			? 'red'
    			: /*node*/ ctx[0].edges.size % 2 == 0
    				? 'chartreuse'
    				: 'yellow');

    			set_style(div, "outline-color", /*node*/ ctx[0].isSelected
    			? 'darkred'
    			: /*node*/ ctx[0].edges.size % 2 == 0
    				? 'forestgreen'
    				: 'darkgoldenrod');

    			add_location(div, file$3, 11, 0, 276);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*onSelect*/ ctx[1], false, false, false),
    					listen_dev(div, "contextmenu", prevent_default(/*onDelete*/ ctx[2]), false, true, false),
    					listen_dev(div, "dblclick", /*onDelete*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*node*/ 1 && t_value !== (t_value = (/*node*/ ctx[0].solutionOrder
    			? /*node*/ ctx[0].solutionOrder
    			: /*node*/ ctx[0].edges.size) + "")) set_data_dev(t, t_value);

    			if (dirty & /*node*/ 1) {
    				set_style(div, "left", /*node*/ ctx[0].x + "px");
    			}

    			if (dirty & /*node*/ 1) {
    				set_style(div, "top", /*node*/ ctx[0].y + "px");
    			}

    			if (dirty & /*node*/ 1) {
    				set_style(div, "background-color", /*node*/ ctx[0].isSelected
    				? 'red'
    				: /*node*/ ctx[0].edges.size % 2 == 0
    					? 'chartreuse'
    					: 'yellow');
    			}

    			if (dirty & /*node*/ 1) {
    				set_style(div, "outline-color", /*node*/ ctx[0].isSelected
    				? 'darkred'
    				: /*node*/ ctx[0].edges.size % 2 == 0
    					? 'forestgreen'
    					: 'darkgoldenrod');
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Node', slots, []);
    	let { node } = $$props;
    	const dispatch = createEventDispatcher();

    	const onSelect = () => {
    		dispatch("node_selected", node);
    	};

    	const onDelete = () => {
    		dispatch("node_deleted", node);
    	};

    	const writable_props = ['node'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Node> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		node,
    		dispatch,
    		onSelect,
    		onDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [node, onSelect, onDelete];
    }

    class Node extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { node: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Node",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*node*/ ctx[0] === undefined && !('node' in props)) {
    			console.warn("<Node> was created without expected prop 'node'");
    		}
    	}

    	get node() {
    		throw new Error("<Node>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<Node>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Edge.svelte generated by Svelte v3.46.3 */
    const file$2 = "src\\components\\Edge.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "edge svelte-54e2i6");
    			add_location(div0, file$2, 13, 2, 396);
    			attr_dev(div1, "class", "edge-area svelte-54e2i6");
    			set_style(div1, "left", /*edge*/ ctx[0].x + "px");
    			set_style(div1, "top", /*edge*/ ctx[0].y + "px");
    			set_style(div1, "width", /*edge*/ ctx[0].width + "px");
    			set_style(div1, "height", /*edge*/ ctx[0].height + "px");
    			set_style(div1, "transform", "rotate(" + /*edge*/ ctx[0].angleDeg + "deg)");
    			add_location(div1, file$2, 8, 0, 208);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*onDelete*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*edge*/ 1) {
    				set_style(div1, "left", /*edge*/ ctx[0].x + "px");
    			}

    			if (dirty & /*edge*/ 1) {
    				set_style(div1, "top", /*edge*/ ctx[0].y + "px");
    			}

    			if (dirty & /*edge*/ 1) {
    				set_style(div1, "width", /*edge*/ ctx[0].width + "px");
    			}

    			if (dirty & /*edge*/ 1) {
    				set_style(div1, "height", /*edge*/ ctx[0].height + "px");
    			}

    			if (dirty & /*edge*/ 1) {
    				set_style(div1, "transform", "rotate(" + /*edge*/ ctx[0].angleDeg + "deg)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Edge', slots, []);
    	let { edge } = $$props;
    	const dispatch = createEventDispatcher();

    	const onDelete = () => {
    		dispatch("edge_deleted", edge);
    	};

    	const writable_props = ['edge'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Edge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('edge' in $$props) $$invalidate(0, edge = $$props.edge);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		edge,
    		dispatch,
    		onDelete
    	});

    	$$self.$inject_state = $$props => {
    		if ('edge' in $$props) $$invalidate(0, edge = $$props.edge);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [edge, onDelete];
    }

    class Edge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { edge: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Edge",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*edge*/ ctx[0] === undefined && !('edge' in props)) {
    			console.warn("<Edge> was created without expected prop 'edge'");
    		}
    	}

    	get edge() {
    		throw new Error("<Edge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edge(value) {
    		throw new Error("<Edge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Tutorial.svelte generated by Svelte v3.46.3 */
    const file$1 = "src\\components\\Tutorial.svelte";

    function create_fragment$1(ctx) {
    	let div9;
    	let div8;
    	let button;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let t3;
    	let div4;
    	let t4;
    	let div2;
    	let t5;
    	let div3;
    	let t6;
    	let t7;
    	let div5;
    	let t9;
    	let div6;
    	let t11;
    	let div7;
    	let t13;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			button = element("button");
    			button.textContent = "[ESC]";
    			t1 = text("\r\n    Each node shows its degree (the number of edges connecting it to other nodes)\r\n    ");
    			div1 = element("div");
    			div0 = element("div");
    			t2 = text("\r\n      Marks and odd node");
    			t3 = space();
    			div4 = element("div");
    			t4 = text("Click on a node to select it ");
    			div2 = element("div");
    			t5 = text("\r\n      , then click on another node to connect\r\n      ");
    			div3 = element("div");
    			t6 = text("\r\n      .");
    			t7 = space();
    			div5 = element("div");
    			div5.textContent = "Click on connection to remove it.";
    			t9 = space();
    			div6 = element("div");
    			div6.textContent = "Double click or right click a node to remove it.";
    			t11 = space();
    			div7 = element("div");
    			div7.textContent = "You can always show this menu by pressing any key.w";
    			t13 = space();
    			a = element("a");
    			a.textContent = "Source code";
    			attr_dev(button, "class", "close svelte-fv6p5k");
    			add_location(button, file$1, 9, 4, 239);
    			attr_dev(div0, "class", "node svelte-fv6p5k");
    			set_style(div0, "background-color", "yellow");
    			add_location(div0, file$1, 12, 6, 409);
    			attr_dev(div1, "class", "line svelte-fv6p5k");
    			add_location(div1, file$1, 11, 4, 383);
    			attr_dev(div2, "class", "node svelte-fv6p5k");
    			set_style(div2, "background-color", "red");
    			add_location(div2, file$1, 16, 35, 561);
    			attr_dev(div3, "class", "node svelte-fv6p5k");
    			set_style(div3, "background-color", "chartreuse");
    			add_location(div3, file$1, 21, 6, 691);
    			attr_dev(div4, "class", "line svelte-fv6p5k");
    			add_location(div4, file$1, 15, 4, 506);
    			add_location(div5, file$1, 24, 4, 775);
    			add_location(div6, file$1, 25, 4, 825);
    			add_location(div7, file$1, 26, 4, 890);
    			attr_dev(a, "href", "https://github.com/zyxwars/eulerian-path-finder");
    			attr_dev(a, "class", "source svelte-fv6p5k");
    			add_location(a, file$1, 28, 4, 960);
    			attr_dev(div8, "class", "tutorial svelte-fv6p5k");
    			add_location(div8, file$1, 8, 2, 211);
    			attr_dev(div9, "class", "wrapper svelte-fv6p5k");
    			add_location(div9, file$1, 7, 0, 186);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, button);
    			append_dev(div8, t1);
    			append_dev(div8, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t2);
    			append_dev(div8, t3);
    			append_dev(div8, div4);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div4, t6);
    			append_dev(div8, t7);
    			append_dev(div8, div5);
    			append_dev(div8, t9);
    			append_dev(div8, div6);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div8, t13);
    			append_dev(div8, a);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onClose*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tutorial', slots, []);
    	const dispatch = createEventDispatcher();

    	const onClose = () => {
    		dispatch("tutorial_closed");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tutorial> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch, onClose });
    	return [onClose];
    }

    class Tutorial extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tutorial",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.3 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (214:2) {#if isTutorialVisible}
    function create_if_block(ctx) {
    	let tutorial;
    	let current;
    	tutorial = new Tutorial({ $$inline: true });
    	tutorial.$on("tutorial_closed", /*tutorial_closed_handler*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(tutorial.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tutorial, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tutorial.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tutorial.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tutorial, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(214:2) {#if isTutorialVisible}",
    		ctx
    	});

    	return block;
    }

    // (222:2) {#each edges as edge}
    function create_each_block_1(ctx) {
    	let edge;
    	let current;

    	edge = new Edge({
    			props: { edge: /*edge*/ ctx[22] },
    			$$inline: true
    		});

    	edge.$on("edge_deleted", /*handleDeleteEdge*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(edge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(edge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const edge_changes = {};
    			if (dirty & /*edges*/ 2) edge_changes.edge = /*edge*/ ctx[22];
    			edge.$set(edge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(edge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(edge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(edge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(222:2) {#each edges as edge}",
    		ctx
    	});

    	return block;
    }

    // (226:2) {#each Object.values(nodes) as node}
    function create_each_block(ctx) {
    	let node;
    	let current;

    	node = new Node({
    			props: { node: /*node*/ ctx[19] },
    			$$inline: true
    		});

    	node.$on("node_selected", /*handleSelectNode*/ ctx[6]);
    	node.$on("node_deleted", /*handleDeleteNode*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(node.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(node, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const node_changes = {};
    			if (dirty & /*nodes*/ 1) node_changes.node = /*node*/ ctx[19];
    			node.$set(node_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(node.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(node.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(node, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(226:2) {#each Object.values(nodes) as node}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t0;
    	let div;
    	let h4;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isTutorialVisible*/ ctx[2] && create_if_block(ctx);
    	let each_value_1 = /*edges*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = Object.values(/*nodes*/ ctx[0]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			div = element("div");
    			h4 = element("h4");
    			t1 = text("Is solvable: ");
    			t2 = text(/*isSolvableVar*/ ctx[3]);
    			t3 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			button = element("button");
    			button.textContent = "Calculate Path";
    			attr_dev(h4, "class", "is-solvable svelte-e0ce7l");
    			add_location(h4, file, 218, 4, 7416);
    			attr_dev(div, "class", "background svelte-e0ce7l");
    			add_location(div, file, 217, 2, 7359);
    			attr_dev(button, "class", "action-btn svelte-e0ce7l");
    			add_location(button, file, 233, 2, 7739);
    			attr_dev(main, "class", "svelte-e0ce7l");
    			add_location(main, file, 212, 0, 7243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, div);
    			append_dev(div, h4);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(main, t3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(main, null);
    			}

    			append_dev(main, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			append_dev(main, t5);
    			append_dev(main, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*handleCreateNode*/ ctx[5], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isTutorialVisible*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isTutorialVisible*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*isSolvableVar*/ 8) set_data_dev(t2, /*isSolvableVar*/ ctx[3]);

    			if (dirty & /*edges, handleDeleteEdge*/ 258) {
    				each_value_1 = /*edges*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(main, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*Object, nodes, handleSelectNode, handleDeleteNode*/ 193) {
    				each_value = Object.values(/*nodes*/ ctx[0]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(main, t5);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let nodes = [];
    	let nodeId = 0;
    	let selectedNode = null;

    	// Edges aren't used for any logic and are just visual
    	// Use node.edges for any logic
    	let edges = [];

    	let isTutorialVisible = true;
    	let isShowingResult = false;
    	let preResultNodes = [];

    	onMount(() => {
    		window.addEventListener("keypress", e => {
    			$$invalidate(2, isTutorialVisible = !isTutorialVisible);
    		});

    		window.addEventListener("keydown", e => {
    			if (e.key === "Escape") {
    				$$invalidate(2, isTutorialVisible = !isTutorialVisible);
    			}
    		});

    		window.addEventListener("mouseup", () => {
    			if (!isShowingResult) return;
    			isShowingResult = false;
    			$$invalidate(0, nodes = Object.assign({}, preResultNodes));
    		});
    	});

    	// Var is used for gui so that it doesn't need to be updated on every refresh
    	let isSolvableVar = false;

    	const isSolvable = () => {
    		let odd = 0;

    		for (let node of Object.values(nodes)) {
    			if (node.edges.size === 0) return "circuit not closed";

    			if (node.edges.size % 2 === 1) {
    				odd++;
    			}
    		}

    		return odd === 2
    		? "Eulerian path"
    		: odd === 0 ? "Eulerian cycle" : false;
    	};

    	const dfsCount = (v, visited) => {
    		let count = 1;
    		visited[v] = true;

    		for (let node of nodes[v].edges) {
    			if (visited[node] === false) count += dfsCount(node, visited);
    		}

    		return count;
    	};

    	const isBridge = (v, u) => {
    		let visited = {};

    		for (let nodeId of Object.keys(nodes)) {
    			visited[nodeId] = false;
    		}

    		const c1 = dfsCount(v, visited);
    		nodes[v].edges.delete(u);
    		nodes[u].edges.delete(v);
    		visited = {};

    		for (let nodeId of Object.keys(nodes)) {
    			visited[nodeId] = false;
    		}

    		const c2 = dfsCount(v, visited);
    		nodes[v].edges.add(u);
    		nodes[u].edges.add(v);
    		return c1 > c2;
    	};

    	const getPath = () => {
    		const solutionType = isSolvable();
    		if (!solutionType) return;
    		const nodesArray = Object.values(nodes);

    		// Cache nodes by value
    		preResultNodes = {};

    		for (let node of nodesArray) {
    			preResultNodes[node.id] = Object.assign(Object.assign({}, node), { edges: new Set([...node.edges]) });
    		}

    		let currentNode = null;

    		findStartNode: {
    			for (let node of nodesArray) {
    				// Use odd node as the start point
    				if (node.edges.size % 2 === 1) {
    					currentNode = node;
    					break findStartNode;
    				}
    			}

    			// If no odd nodes exist choose arbitrary node
    			currentNode = nodesArray[0];
    		}

    		nodesArray.forEach(node => node.solutionOrder = "");
    		let orderIndex = 1;
    		currentNode.solutionOrder = 1;

    		while (true) {
    			// If all goes to plan the path is finished
    			if (currentNode.edges.size === 0) break;

    			// Find next node
    			let nextNode = null;

    			findNextNode: {
    				// Nodes are edited during dfs count, causes infinite loop if copy is not made
    				const edges = [...currentNode.edges];

    				for (let nodeId of edges) {
    					// Find node that is not a bridge to move to
    					if (!isBridge(currentNode.id, nodeId)) {
    						nextNode = nodes[nodeId];
    						break findNextNode;
    					}
    				}

    				// If only bridges are available, choose the first one
    				const [nextNodeId] = currentNode.edges;

    				nextNode = nodes[nextNodeId];
    			}

    			currentNode.edges.delete(nextNode.id);
    			nextNode.edges.delete(currentNode.id);
    			console.log(`${currentNode.id} -> ${nextNode.id}`);

    			// Visually change names to the order in which the graph can be drawn
    			nextNode.solutionOrder = nextNode.solutionOrder === ""
    			? ++orderIndex
    			: `${nextNode.solutionOrder},${++orderIndex}`;

    			currentNode = nextNode;
    		}

    		$$invalidate(0, nodes = Object.assign({}, nodes)); // Refresh state
    		isShowingResult = true;
    	};

    	const handleCreateNode = e => {
    		const id = ++nodeId;

    		$$invalidate(
    			0,
    			nodes[id] = {
    				id,
    				solutionOrder: "",
    				x: e.clientX,
    				y: e.clientY,
    				isSelected: false,
    				edges: new Set()
    			},
    			nodes
    		);

    		$$invalidate(3, isSolvableVar = isSolvable());
    	};

    	const connectNodes = newSelectedNode => {
    		if (newSelectedNode.edges.has(selectedNode.id) && selectedNode.edges.has(newSelectedNode.id)) return;
    		newSelectedNode.isSelected = false;
    		selectedNode.isSelected = false;
    		newSelectedNode.edges.add(selectedNode.id);
    		selectedNode.edges.add(newSelectedNode.id);

    		// In radians, use * 180 / Math.PI to get degrees
    		const angle = Math.atan2(selectedNode.y - newSelectedNode.y, selectedNode.x - newSelectedNode.x);

    		$$invalidate(1, edges = [
    			...edges,
    			{
    				x: selectedNode.x + 30,
    				// The css centers the edge even without adding 30
    				y: selectedNode.y + 5,
    				width: (Math.abs(selectedNode.x - newSelectedNode.x) ** 2 + Math.abs(selectedNode.y - newSelectedNode.y) ** 2) ** 0.5,
    				height: 50,
    				angleDeg: 180 + angle * 180 / Math.PI,
    				node1Id: selectedNode.id,
    				node2Id: newSelectedNode.id
    			}
    		]);

    		$$invalidate(0, nodes = Object.assign({}, nodes)); // Refresh state
    		selectedNode = null;
    		$$invalidate(3, isSolvableVar = isSolvable());
    	};

    	const handleSelectNode = e => {
    		const newSelectedNode = e.detail;

    		// Deselect node
    		if (newSelectedNode === selectedNode) {
    			newSelectedNode.isSelected = false;
    			$$invalidate(0, nodes = Object.assign({}, nodes)); // Refresh state
    			selectedNode = null;
    			return;
    		}

    		// Connect nodes
    		if (selectedNode) return connectNodes(newSelectedNode);

    		// Select node
    		newSelectedNode.isSelected = true;

    		$$invalidate(0, nodes = Object.assign({}, nodes)); // Refresh state
    		selectedNode = newSelectedNode;
    	};

    	const handleDeleteNode = e => {
    		// Delete the connection from nodes
    		for (let node of Object.values(nodes)) {
    			node.edges.delete(e.detail.id);
    		}

    		// Delete edges connecting the deleted node
    		$$invalidate(1, edges = edges.filter(edge => edge.node1Id !== e.detail.id && edge.node2Id !== e.detail.id));

    		// Delete the node
    		delete nodes[e.detail.id];

    		selectedNode = null;
    		$$invalidate(0, nodes = Object.assign({}, nodes));
    		$$invalidate(3, isSolvableVar = isSolvable());
    	};

    	const handleDeleteEdge = e => {
    		// Delete the connection from nodes
    		for (let node of Object.values(nodes)) {
    			if (node.id === e.detail.node1Id) node.edges.delete(e.detail.node2Id); else if (node.id === e.detail.node2Id) node.edges.delete(e.detail.node1Id);
    		}

    		$$invalidate(0, nodes = Object.assign({}, nodes));

    		// Delete the edge
    		$$invalidate(1, edges = edges.filter(edge => edge !== e.detail));

    		$$invalidate(3, isSolvableVar = isSolvable());
    	};

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const tutorial_closed_handler = () => $$invalidate(2, isTutorialVisible = false);
    	const click_handler = () => getPath();

    	$$self.$capture_state = () => ({
    		onMount,
    		Node,
    		Edge,
    		Tutorial,
    		nodes,
    		nodeId,
    		selectedNode,
    		edges,
    		isTutorialVisible,
    		isShowingResult,
    		preResultNodes,
    		isSolvableVar,
    		isSolvable,
    		dfsCount,
    		isBridge,
    		getPath,
    		handleCreateNode,
    		connectNodes,
    		handleSelectNode,
    		handleDeleteNode,
    		handleDeleteEdge
    	});

    	$$self.$inject_state = $$props => {
    		if ('nodes' in $$props) $$invalidate(0, nodes = $$props.nodes);
    		if ('nodeId' in $$props) nodeId = $$props.nodeId;
    		if ('selectedNode' in $$props) selectedNode = $$props.selectedNode;
    		if ('edges' in $$props) $$invalidate(1, edges = $$props.edges);
    		if ('isTutorialVisible' in $$props) $$invalidate(2, isTutorialVisible = $$props.isTutorialVisible);
    		if ('isShowingResult' in $$props) isShowingResult = $$props.isShowingResult;
    		if ('preResultNodes' in $$props) preResultNodes = $$props.preResultNodes;
    		if ('isSolvableVar' in $$props) $$invalidate(3, isSolvableVar = $$props.isSolvableVar);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nodes,
    		edges,
    		isTutorialVisible,
    		isSolvableVar,
    		getPath,
    		handleCreateNode,
    		handleSelectNode,
    		handleDeleteNode,
    		handleDeleteEdge,
    		tutorial_closed_handler,
    		click_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
