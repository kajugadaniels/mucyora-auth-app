# MUCYORA Authentication Visual System

## Direction

The UI is calm, precise, and trustworthy. It uses solid colors, subtle borders, measured shadows,
and generous whitespace. Gradients are forbidden.

## Brand

- Primary: `#1B4EF5`
- Primary hover: `#1542D8`
- Primary active: `#1037B8`
- Typeface: Outfit
- Control text: 12px
- Minimum control height: 44px

## Accessibility

- Focus-visible uses a high-contrast primary outline and soft ring.
- Error, success, warning, and information states combine color with icons and text.
- Touch targets are at least 44px even where labels use 12px.
- Motion is reduced when the user requests reduced motion.

## Assets

The brand SVGs are authored locally. They use no scripts, event handlers, embedded HTML, external
resources, raster images, or gradients.

## Component discipline

- Page-specific styles must not enter `globals.css`.
- Every component owns a CSS Module.
- Pages must reuse controls from `src/components/ui`.
- Icons are imported by name from Lucide React.