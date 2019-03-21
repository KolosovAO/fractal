(function () {
    'use strict';

    (function() {
        const __exports = {};
        let wasm;

        let cachegetInt32Memory = null;
        function getInt32Memory() {
            if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
                cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
            }
            return cachegetInt32Memory;
        }

        function getArrayI32FromWasm(ptr, len) {
            return getInt32Memory().subarray(ptr / 4, ptr / 4 + len);
        }

        let cachedGlobalArgumentPtr = null;
        function globalArgumentPtr() {
            if (cachedGlobalArgumentPtr === null) {
                cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
            }
            return cachedGlobalArgumentPtr;
        }

        let cachegetUint32Memory = null;
        function getUint32Memory() {
            if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
                cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
            }
            return cachegetUint32Memory;
        }
        /**
        * @param {number} arg0
        * @param {number} arg1
        * @param {number} arg2
        * @param {number} arg3
        * @param {number} arg4
        * @param {number} arg5
        * @param {number} arg6
        * @returns {Int32Array}
        */
        __exports.render_mandelbrot = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            const retptr = globalArgumentPtr();
            wasm.render_mandelbrot(retptr, arg0, arg1, arg2, arg3, arg4, arg5, arg6);
            const mem = getUint32Memory();
            const rustptr = mem[retptr / 4];
            const rustlen = mem[retptr / 4 + 1];

            const realRet = getArrayI32FromWasm(rustptr, rustlen).slice();
            wasm.__wbindgen_free(rustptr, rustlen * 4);
            return realRet;

        };

        const heap = new Array(32);

        heap.fill(undefined);

        heap.push(undefined, null, true, false);

        let heap_next = heap.length;

        function dropObject(idx) {
            if (idx < 36) return;
            heap[idx] = heap_next;
            heap_next = idx;
        }

        __exports.__wbindgen_object_drop_ref = function(i) { dropObject(i); };

        function init(module_or_path, maybe_memory) {
            let result;
            const imports = { './mandelbrot': __exports };
            if (module_or_path instanceof WebAssembly.Module) {

                result = WebAssembly.instantiate(module_or_path, imports)
                .then(instance => {
                    return { instance, module: module_or_path };
                });
            } else {

                const response = fetch(module_or_path);
                if (typeof WebAssembly.instantiateStreaming === 'function') {
                    result = WebAssembly.instantiateStreaming(response, imports)
                    .catch(e => {
                        console.warn("`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return response
                        .then(r => r.arrayBuffer())
                        .then(bytes => WebAssembly.instantiate(bytes, imports));
                    });
                } else {
                    result = response
                    .then(r => r.arrayBuffer())
                    .then(bytes => WebAssembly.instantiate(bytes, imports));
                }
            }
            return result.then(({instance, module}) => {
                wasm = instance.exports;
                init.__wbindgen_wasm_module = module;

                return wasm;
            });
        }

        self.wasm_bindgen = Object.assign(init, __exports);

    })();

    const RUST_FN_NAME = "render_mandelbrot";


    onmessage = function(e) {
        if (e.data.type === "render"){
            doConvert(e.data);
        }
    };


    let RUST_FN = null;
    function doConvert(config){
        if (RUST_FN) {
            const {width, height, x_start, x_end, y_start, y_end, max_iterations} = config;
            const result = RUST_FN(width, height, x_start, x_end, y_start, y_end, max_iterations);

            postMessage({
                type: "ready",
                id: config.id,
                result
            });
        } else {
            const path = config.wasmPath;

            wasm_bindgen(path).then(() => {
                RUST_FN = wasm_bindgen[RUST_FN_NAME];
                doConvert(config);
            }).catch(e => console.log(e));
        }
    }

}());
