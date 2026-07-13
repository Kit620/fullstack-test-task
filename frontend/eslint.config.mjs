import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ["node_modules/**", ".next/**"],
  },
  {
    // react-hooks/set-state-in-effect (react-hooks v7) flags the standard
    // "fetch on mount" pattern (useEffect(() => { void reload(); }, [reload]))
    // used in useFiles/useAlerts — this project has no React Compiler, so the
    // concurrent-rendering concern the rule targets doesn't apply here, and
    // the pattern matches the original page.tsx behaviour exactly.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
