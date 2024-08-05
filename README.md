# template--nx-nestjs--basic

## Local development

### Requirements

- Node.js
  - See `.tool-versions` for the recommended version
- `pnpm`
  - Installed globally

### Setup

1. `pnpm install`

### Run the whole stack

Make sure setup is completed and is up-to-date.

You can start each app manually:

```bash
# app-nest-1
pnpm exec nx run app-nest-1:serve
# Access via: http://localhost:3000
```

### Build and preview

```bash
# Build all apps
pnpm exec nx run-many --target=build --all=true

# Build a single app
pnpm exec nx run app-nest-1:build

# Preview backend
pnpm exec nx run app-nest-1:preview
node ./dist/apps/app-nest-1/main.js
```
