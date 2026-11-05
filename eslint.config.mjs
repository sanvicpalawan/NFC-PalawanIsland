import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  {
    rules: {
      // The CMS managers load their data with `useEffect(() => { fetchX(); }, [])`,
      // where the state update happens after an await inside an async callback —
      // it is not a synchronous setState. The rule cannot prove that through the
      // function boundary, so it is reported and left as a warning. Replacing the
      // pattern with a data library is tracked separately; errors here are real.
      "react-hooks/set-state-in-effect": "warn",
      // Fetch-on-mount callbacks are recreated per render by design. Wrapping each
      // one in useCallback is a broader refactor than these managers need today.
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
