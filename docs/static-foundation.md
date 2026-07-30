# Static Foundation Boundary

The application uses `output: "export"`. Server Components execute during build and Client
Components are used only for component interaction.

Unsupported in the current scope:

- server actions;
- route handlers;
- middleware;
- runtime cookies or headers;
- authentication API calls;
- default Next.js image optimization;
- dynamic server redirects.

The foundation page is a design-system status page, not a complete authentication route.