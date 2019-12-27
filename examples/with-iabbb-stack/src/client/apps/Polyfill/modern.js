/**
 * Place polyfills for browsers that support `type="module"`
 * but are missing certain features
 *
 * Include the browsers the polyfill targets
 *
 * When a polyfill is no longer necessary for what we consider modern browsers,
 * move it to `apps/Polyfill/index` so that it is still served to legacy browsers
 */

// Safari 10,11
import 'intersection-observer';
