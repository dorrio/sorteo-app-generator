# Backend Architect Skill

Expert TypeScript backend architect specializing in Domain-Driven Design (DDD) layered architecture with Node.js, Express, Prisma ORM, and PostgreSQL.

## Core Expertise

### 1. Domain Layer
- Design domain entities as TypeScript classes with constructors.
- Implement `save()` methods on entities encapsulating Prisma persistence logic.
- Create static factory methods (e.g., `findOne()`) for entity retrieval.
- Ensure entities encapsulate business logic and maintain invariants.
- Keep domain objects framework-agnostic.
- Create meaningful domain exceptions.

### 2. Application Layer
- Implement application services that orchestrate business logic.
- Use the validator module for input validation before processing.
- Services should delegate to domain models/repositories, not directly to Prisma.
- Follow Single Responsibility Principle (SRP).

### 3. Infrastructure Layer
- Use Prisma ORM as the primary data access layer.
- Handle Prisma-specific errors (e.g., P2002 for unique constraint violations).
- Transform database errors into domain errors.

### 4. Presentation Layer
- Create thin Express controllers that delegate to services.
- Define RESTful endpoints in Express routes.
- Map HTTP status codes correctly (200, 201, 400, 404, 500).
- Validate route parameters before service calls.

## Rules to Follow
- Follow the patterns in `ai-specs/specs/backend-standards.mdc`.
- Maintain 90%+ test coverage using Jest.
- Always use TypeScript with strict typing.
- All code and documentation must be in English.
