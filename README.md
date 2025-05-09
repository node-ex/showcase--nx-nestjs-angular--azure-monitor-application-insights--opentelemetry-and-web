# showcase--nx-nestjs--azure-monitor-application-insights--opentelemetry

## Showcase

1. Setup Azure account
2. Setup Application Insights service
3. Run `pnpm install`
4. Copy `.env.template` as `.env` and add/change values if needed
5. Run the app using `pnpm exec nx run app-nest-1:serve`
6. Enable "REST Client" extension in VSCode and run the requests in `./api/requests.http` file
7. Inspect the Application Insights Failures and Logs sections

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

# app-angular-1
pnpm exec nx run app-angular-1:serve
# Access via: http://localhost:4200
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

# Preview frontend
pnpx serve --single ./dist/apps/app-angular-1/browser
```

### Formatting

We use Prettier to format the code. To run it, use `format*` commands from `package.json` or Nx commands. Put file paths and patterns to ignore into `.prettierignore`.

```bash
# Run format checking for a single project
pnpm exec nx format:check --projects app-nest-1

# Run format fixing for a single project
pnpm exec nx format:write --projects app-nest-1

# Run format checking for all non-ignored files in the repository
pnpm exec nx format:check --all

# Run format checking for all project files only (inside of `./apps` and `./libs`)
pnpm exec nx format:check --libs-and-apps

# Run format checking for files outside of Nx projects (outside of `./apps` and `./libs`)
pnpm exec prettier --check . '!./apps' '!./libs'

# Run format fixing for files outside of Nx projects (outside of `./apps` and `./libs`)
pnpm exec prettier --write . '!./apps' '!./libs'

# Run format checking only for affected projects (useful for CI)
pnpm exec nx format:check --base=main
pnpm exec nx format:check --base=main --head=HEAD
pnpm exec nx format:check --base=HEAD
```

VSCode "Prettier" extension is recommended to format files on save. See example `.vscode/settings.template.json` for recommended settings.

### Type checking

We use `tsc` for type checking. To run it, use `type-check*` commands from `package.json` or Nx commands. Put file paths and patterns to ignore into an appropriate `tsconfig*.json` file.

```bash
# Use type-checking (side-effect of the composite build) for a single project (recommended)
# https://github.com/nrwl/nx/issues/3664#issuecomment-731918931
pnpm exec nx run app-nest-1:type-check
# For prettier output
pnpm exec tsc --build --incremental ./apps/app-nest-1/tsconfig.json

# Type check a single project (does not work well)
pnpm exec tsc -p ./apps/app-nest-1/tsconfig.json

# Use type-checking (side-effect of the composite build) for all projects
pnpm exec nx run-many --target=type-check

# Use type-checking (side-effect of the composite build) for files outside of Nx projects (outside of `./apps` and `./libs`)
pnpm exec tsc --build --incremental ./tsconfig.root.json

# Use type-checking (side-effect of the composite build) only for affected projects (useful for CI)
pnpm exec nx affected -t type-check --base=main
pnpm exec nx affected -t type-check --base=main --head=HEAD
pnpm exec nx affected -t type-check --base=HEAD
```

### Linting

We use ESLint to lint the code. To run it, use `lint*` commands from `package.json` or Nx commands. Put file paths and patterns to ignore into `.eslintignore`.

```bash
# Run lint checking for a single project
pnpm exec nx run app-nest-1:lint

# Fix auto-fixable lint errors for a single project
pnpm exec nx run app-nest-1:lint --fix=true

# Run lint checking for all project files only (inside of `./apps` and `./libs`)
pnpm exec nx run-many --target=lint --all=true

# Fix auto-fixable lint errors in files of all projects only (inside of `./apps` and `./libs`)
pnpm exec nx run-many --target=lint --all=true --fix=true

# Run lint checking for specific projects
pnpm exec nx run-many --target=lint --projects=app-nest-1,app-angular-1

# Run lint checking in specific folder only (does not work in @nx/eslint v19.5.1)
pnpm exec nx run app-nest-1:lint --lintFilePatterns 'apps/app-nest-1/src/**/*'

# Run lint checking for files outside of Nx projects (outside of `./apps` and `./libs`)
pnpm exec eslint --config .eslintrc.root.js --ext .js,.cjs,.mjs,.ts --max-warnings 0 .

# Fix linting errors in files outside of Nx projects (outside of `./apps` and `./libs`)
pnpm exec eslint --config .eslintrc.root.js --ext .js,.cjs,.mjs,.ts --max-warnings 0 --fix .

# Run lint checking only for affected projects (useful for CI)
pnpm exec nx affected -t lint --base=main
pnpm exec nx affected -t lint --base=main --head=HEAD
pnpm exec nx affected -t lint --base=HEAD
```

VSCode "ESLint" extension is recommended to lint files. See example `.vscode/settings.template.json` for recommended settings.

### Testing

#### Unit tests

Unit tests are run using Jest. To run them, either use commands from `package.json` or Nx commands.

```bash
# Run tests for a single app
pnpm exec nx test app-nest-1

# Run tests for all apps
pnpm exec nx run-many -t test

# Run tests for multiple apps
pnpm exec nx run-many -t test -p app-nest-1 app-angular-1

# Run unit tests only for affected projects (useful for CI)
pnpm exec nx affected -t test --base=main
pnpm exec nx affected -t test --base=main --head=HEAD
pnpm exec nx affected -t test --base=HEAD
```

VSCode "Jest" and/or "Jest Runner" extensions are recommended to run the tests. See example `.vscode/settings.template.json` for recommended settings.

### Monorepo tooling

This project uses Nx as a monorepo tool. If you want to run Nx commands, either use CLI `nx` command or VScode "Nx console" extension (highly recommended).

```bash
# Show Nx project/task graphs via web UI
pnpm exec nx graph

# Show affected projects for a specific target via web UI
pnpm exec nx affected -t build --graph --base=HEAD
# Or use Nx Console extension -> "affected --graph" command

# Show all projects in the current Nx workspace
pnpm exec nx show projects

# Show details about a specific project and its targets
pnpm exec nx show project app-nest-1
pnpm exec nx show --json project app-nest-1
pnpm exec nx show --json project app-nest-1 | jq
```

### Environment variables

Copy `.env.template` as `.env` and change variable values as needed. Only variables with a `PUBLIC_` prefix are available in `app-angular-1`.
