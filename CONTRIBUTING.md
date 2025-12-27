# Contributing to MAITRI AI Assistant

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what is best for the community

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Please include:

- **Clear use case**
- **Benefit to users**
- **Possible implementation approach**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow code style** guidelines below
3. **Write tests** for new features
4. **Update documentation** as needed
5. **Ensure tests pass**: `npm test`
6. **Ensure linting passes**: `npm run lint`
7. **Write clear commit messages**

## Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** rules
- Use **Prettier** for formatting
- Write **JSDoc comments** for public APIs
- Use **meaningful variable names**

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add voice command feature
fix: resolve camera permission issue
docs: update README installation steps
test: add tests for emotion detector
refactor: simplify health monitoring logic
```

### Testing

- Write unit tests for utilities (`__tests__/lib/`)
- Write component tests for UI (`__tests__/components/`)
- Aim for 70%+ coverage
- Test edge cases and error states

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` or `*.test.tsx`
- Types: `*.d.ts`

### Component Guidelines

```typescript
/**
 * ComponentName - Brief description
 * 
 * @param {Props} props - Component props
 * @returns {JSX.Element}
 */
export default function ComponentName({ prop1, prop2 }: Props) {
  // Component logic
  return (
    // JSX
  )
}
```

### TypeScript Guidelines

- Avoid `any` types
- Define interfaces for props
- Use type inference when obvious
- Export types that may be reused

## Project Structure

- `app/` - Next.js pages
- `components/` - Reusable React components
- `lib/` - Utility functions and helpers
- `hooks/` - Custom React hooks
- `types/` - TypeScript type definitions
- `__tests__/` - Test files

## Getting Help

- Join discussions in GitHub Issues
- Check existing documentation
- Ask questions in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MAITRI! 🚀
