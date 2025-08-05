# USWDS Tailwind

USWDS Tailwind is an open-source project designed to provide a modern approach to building application federal websites using Tailwind CSS and USWDS principles. This repository is actively maintained, and contributions from the community are welcome!

![hero](https://uswds-tailwind.com/og.jpg)

## Documentation

Want to use USWDS + Tailwind on your project? Visit the [documentation site](https://uswds-tailwind.com) for how to get started.

## Contributing

### Development Setup

#### Prerequisites

Ensure you have the following installed before contributing:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PNPM](https://pnpm.io/) for package management
- [TurboRepo](https://turbo.build/) (optional, for monorepo workflows)

#### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IHIutch/uswds-tailwind.git
   cd uswds-tailwind
   ```
2. Install dependencies and build packages:
   ```bash
   pnpm install
   pnpm build
   ```

> **Important**: Always run `pnpm build` after installing dependencies to ensure all packages are properly built and TypeScript declarations are generated.

#### Troubleshooting

If you encounter module import errors like `Cannot find module '@uswds-tailwind/character-count-compat'`:

1. **Make sure you're in the workspace root**: `cd /path/to/uswds-tailwind`
2. **Force rebuild**: Run `pnpm rebuild` to force rebuild all packages
3. **Check turbo cache**: Turbo may be using cached results - the `rebuild` command bypasses cache

### Astro & Storybook Integration

#### Astro

This project uses [Astro](https://astro.build/) to build the documentation site. If you’re unfamiliar with Astro, check out the [Astro documentation](https://docs.astro.build/) for more information.

To start the Astro development server:

```bash
pnpm dev
```

#### Storybook

[Storybook](https://storybook.js.org/) is used for developing and testing UI components in isolation. This helps ensure that components are reusable and function correctly across different use cases. Learn more about Storybook in the [Storybook documentation](https://storybook.js.org/docs).

To run Storybook locally:

```bash
pnpm storybook
```

## Repository Structure

- **apps/docs/**: Contains the Astro documentation site
- **apps/storybook/**: Contains the Storybook environment used to build and test components
- **packages/tailwind-config**: The main Tailwind configuration used by the docs and end-user installation
- **examples/basic**: A basic example of using this project
- **scripts/**: Used to copy the Storybook examples into the documentation site

## How to Contribute

1. **Fork the repository** and create a new branch for your feature or fix.
2. Follow the **coding standards** and ensure your changes align with project goals.
3. **Write tests** for any new functionality where applicable.
4. Submit a **pull request** with a clear explanation of your changes.

## Issues and Discussions

If you encounter bugs, have feature requests, or need help, please open an [issue](https://github.com/IHIutch/uswds-tailwind/issues) or start a discussion.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
