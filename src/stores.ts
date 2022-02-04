import { writable } from "svelte/store";

export const zoom = writable(1);
zoom.subscribe((v) => zoom.set(Math.max(v, 0.1)));
