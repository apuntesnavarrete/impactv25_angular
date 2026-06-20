# Impactv25 Angular — Agent Guide

## Stack

- **Angular 19.2 standalone** — no `NgModule`. App bootstrapped via `bootstrapApplication` in `src/main.ts`.
- **Routing** configured in `src/app/app.routes.ts`. Uses `provideRouter(routes)` in `main.ts`, NOT `appConfig`.
- **HTTP** uses `provideHttpClient(withFetch(), withInterceptorsFromDi())` (fetch API, not XHR).
- **Testing**: Karma + Jasmine, no e2e tool configured.
- **Styles**: plain CSS (`src/styles.css`, component-level `.css` files).

## Architecture

- **Standalone components** — every component has `standalone: true`.
- **Services** use `providedIn: 'root'` with constructor DI (not `inject()`).
- **Auth**: JWT token stored in `localStorage('token')`. Guard decodes JWT locally to check expiry. No refresh token flow.
- **ThrottleInterceptor** (`src/app/throttle.interceptor.ts`): blocks duplicate POST requests within 3s (prevents double-clicks). Registered via `HTTP_INTERCEPTORS` DI token in `main.ts`.
- **Dynamic routes** use path params `:liga` and `:liga/:Categoria`. Most child routes depend on these.
- **API base URL** in `src/environments/environment.ts` — local network IP (`http://192.168.0.19:8080`).

## Key files

| Purpose | Location |
|---|---|
| Bootstrap entry | `src/main.ts` |
| Routes | `src/app/app.routes.ts` (all routes, ~35 entries) |
| Auth guard | `src/app/auth.guard.ts` |
| HTTP interceptor | `src/app/throttle.interceptor.ts` |
| API services | `src/app/service/peticiones/` (per-entity) |
| Auth service | `src/app/service/auth/auth.service.ts` |
| Env config | `src/environments/environment.ts` |

## Commands

```sh
npm start        # ng serve (dev server at localhost:4200)
npm run build    # ng build (production output to dist/)
npm run watch    # ng build --watch --configuration development
npm test         # ng test (Karma, single run by default)
```

No linter or typecheck scripts configured beyond what Angular CLI provides.

## Conventions

- **2-space indent** (`.editorconfig`).
- **Single quotes** for TypeScript (`.editorconfig`).
- **Component CSS** co-located with `.ts`/`.html`.
- **No NgRx or state management** — data fetched directly in components via services.

## Testing quirks

- Tests use `TestBed.configureTestingModule({})` (no providers imported). Guards use `TestBed.runInInjectionContext`.
- Tests assume HTTP client and router are not mocked at the module level — mock at the spec level via `HttpClientTestingController`.
- No e2e or integration tests.
