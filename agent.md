# AI-Guardrails Mandatory Instructions

You are interacting with a codebase protected by `eslint-plugin-ai-guardrails`. To avoid causing build failures, you MUST strictly adhere to the following rules:

1. **STRICT COMMENT LIMITS**:
   - **Density**: Comments must not exceed 20% of the file's total lines (30% for files under 50 lines).
   - **Vertical**: Max 10 consecutive comment lines for function docstrings. Max 3 consecutive comment lines for inline logic.
   - **Horizontal**: No comment line can exceed 80 characters.
   - **Quality**: Explain "Why", not "What". Never state the obvious. Never leave commented-out code.
2. **NO ORPHAN TODOS**: If you must add a TODO, it MUST include a valid issue tracker link (e.g., `// TODO: https://github.com/user/repo/issues/123`).
3. **KEEP IT CONCISE**:
   - Files must not exceed 300 lines.
   - Functions must not exceed 50 lines.
     Do not generate massive monolithic blocks of code. Break down your logic into smaller, modular helpers.

Violating these constraints will break the CI/CD pipeline.