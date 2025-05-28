# Contributing to IsThisRealJob

We love your input! We want to make contributing to IsThisRealJob as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. Update the documentation with details of any new environment variables, exposed ports, etc.
3. The PR will be merged once you have the sign-off of at least one other developer.

## Any Contributions You Make Will Be Under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report Bugs Using GitHub's [Issue Tracker](https://github.com/yourusername/IsThisRealJob/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/IsThisRealJob/issues/new); it's that easy!

## Write Bug Reports With Detail, Background, and Sample Code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Coding Style

* 2 spaces for indentation rather than tabs
* 80 character line length
* Run `npm run lint` to conform to our lint rules

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md).

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

### Environment Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment template:
```bash
cp .env.example .env
```

3. Set up your environment variables:
```env
VITE_PERPLEXITY_API_KEY=your_api_key
VITE_API_URL=http://localhost:3000
```

### Running Tests

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run linting
npm run lint
```

### Code Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API and business logic
│   ├── api/           # API clients
│   ├── analysis/      # Analysis logic
│   └── validation/    # Data validation
├── types/             # TypeScript interfaces
└── utils/             # Helper functions
```

### Component Guidelines

1. Use functional components with hooks
2. Keep components small and focused
3. Use TypeScript interfaces for props
4. Document complex logic with comments
5. Use the glass-card design system

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Example:
```
feat(analysis): add job reposting detection

- Implements algorithm to track job reposts
- Adds tests for repost detection
- Updates documentation
```

### Review Process

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Create a pull request
6. Get code review
7. Make requested changes
8. Get approval
9. Merge to main

### Need Help?

Feel free to ask for help in:
- GitHub issues
- Pull request comments
- Project Discord server 