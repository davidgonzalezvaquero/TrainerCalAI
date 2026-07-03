# Task: Refactor PolarAdapter - SOLID Compliance

## Objective
Refactor `polar-adapter.ts` to follow SOLID principles by separating concerns into distinct components.

## Current Problems
- **SRP Violation**: Single class handles OAuth, HTTP, data transformation, config validation
- **DIP Violation**: Direct dependencies on `process.env`, `fetch`, `Buffer`, `crypto`
- **Testability**: Hard to unit test due to concrete dependencies

## Architecture

### New Components

**1. PolarConfig (Value Object)**
- Holds configuration: clientId, clientSecret, redirectUri
- Injected via constructor, validates at creation

**2. PolarOAuthClient**
- Responsibility: OAuth2 flow management
- Methods: `getAuthorizationUrl()`, `exchangeCodeForToken(code)`
- Dependencies: PolarConfig, HttpClient (abstracted)

**3. PolarHttpClient**
- Responsibility: HTTP communication with Polar API
- Methods: `get(path, token)`, `post(path, body, token)`
- Dependencies: Base URL, fetch abstraction

**4. PolarDataMapper**
- Responsibility: Transform API responses → domain entities
- Methods: `toActivity(response)`, `toSleep(response)`, `toDailyActivity(response)`
- Dependencies: None (pure functions)

**5. PolarAdapter (Orchestrator)**
- Responsibility: Coordinate components, implement PolarPort interface
- Dependencies: PolarOAuthClient, PolarHttpClient, PolarDataMapper
- Delegates to appropriate component

## Files to Create/Modify
- `src/infrastructure/api/polar/config.ts` - PolarConfig
- `src/infrastructure/api/polar/oauth-client.ts` - PolarOAuthClient
- `src/infrastructure/api/polar/http-client.ts` - PolarHttpClient
- `src/infrastructure/api/polar/data-mapper.ts` - PolarDataMapper
- `src/infrastructure/api/polar-adapter.ts` - Refactored adapter

## Acceptance Criteria
- [ ] Each class has single responsibility
- [ ] Dependencies are injected (no direct process.env/fetch in business logic)
- [ ] PolarPort interface still implemented
- [ ] TypeScript compiles without errors
- [ ] Lint passes
- [ ] Existing functionality preserved

## Git Branch
- Branch name: `refactor/polar-adapter-solid`
- Commit message: `refactor: split PolarAdapter into SRP-compliant components`