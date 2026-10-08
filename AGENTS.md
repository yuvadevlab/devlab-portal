# DevLab Portal Agent Guidelines

Master guidelines for AI agents developing on **DevLab Portal (Control Plane, IAM & App Store Platform)**.

All agents must adhere to:

1. **Hard 250-Line Maximum Rule**: No file in `apps/api/` or `apps/web/` may exceed 250 lines. Decompose early at 200 lines.
2. **Detailed JSDoc & Explanatory Comments**: Every service, controller, and resolver method must have comprehensive documentation.
3. **Database Casing**: All tables, models, and DB enums must strictly use lowercase `snake_case`.
4. **Zero Magic Strings & Strict Typing**: Use canonical enums and strict Zod/DTO validation.
5. **Quality Gates & Conventional Commits**: Commits must pass husky commitlint (`feat(scope): ...`).
