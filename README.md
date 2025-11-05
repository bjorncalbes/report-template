# Report Template

HLS (Hurwitz Law Group) Report Template - A structured HTML report template with dynamic navigation and PDF export capabilities.

## Project Structure

```
Report/
├── pages/              # All HTML pages
├── assets/             # Static assets
│   ├── images/        # Images (logos, screenshots, content)
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   └── data/          # Data and reference files
├── partials/           # Reusable HTML components
└── archive/            # Old/temporary files
```

## Features

- Dynamic sidebar navigation loaded via JavaScript
- Common CSS stylesheet for consistent styling
- PDF export functionality
- Organized asset structure
- Google Sheets integration support

## Development Guidelines

### Changelog Updates
- Always update `CHANGELOG.md` when making changes
- Include the "Requested" section documenting what was asked for
- Document both the request and the implementation
- Follow the format specified in `CHANGELOG.md`

### Project Rules
- See `.cursorrules` for Cursor AI project-specific instructions
- Follow the folder structure guidelines
- Use relative paths from the `pages/` directory

## Documentation

- `CHANGELOG.md` - Complete history of all changes with timestamps
- `PROJECT_STRUCTURE_RECOMMENDATIONS.md` - Original structure recommendations
- `IMPLEMENTATION_COMPLETE.md` - Implementation guide and next steps
- `assets/data/google-sheets/README.md` - Google Sheets documentation template

## Getting Started

1. Open any page in the `pages/` folder
2. The sidebar will load automatically via JavaScript
3. Use the "Export PDF" button to generate a PDF of all pages

## Notes

- Logo files should be stored in `assets/images/logos/`
- Reference screenshots go in `assets/images/screenshots/`
- Google Sheets documentation should be updated in `assets/data/google-sheets/README.md`
