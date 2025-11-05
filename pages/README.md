# Pages Directory

This directory contains all HTML pages for the report.

## File Structure

- All pages are named `pageX.html` where X is the page number
- Pages are accessed via relative paths from the root directory

## Adding New Pages

1. Create a new `pageX.html` file in this directory
2. Use the following structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    
    <!-- Link to common CSS -->
    <link rel="stylesheet" href="../assets/css/styles.css">
    
    <!-- Page-specific CSS (if any) -->
    <style>
        /* Only page-specific styles here */
    </style>
</head>
<body>
    <!-- Sidebar container - loaded dynamically -->
    <div id="sidebar-container"></div>
    
    <!-- Main content -->
    <div class="main-content">
        <!-- Your page content here -->
    </div>
    
    <!-- Load sidebar -->
    <script src="../assets/js/sidebar-loader.js"></script>
    
    <!-- PDF export libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" referrerpolicy="no-referrer"></script>
    <script src="../assets/js/pdf-export.js"></script>
</body>
</html>
```

3. Update `partials/sidebar.html` to add navigation link to your new page

## Path Conventions

- CSS: `../assets/css/styles.css`
- JavaScript: `../assets/js/filename.js`
- Images: `../assets/images/[logos|screenshots|content]/filename.ext`
- Other pages: `pageX.html` (same directory) or `../pages/pageX.html` (from other locations)

## Notes

- The sidebar is loaded automatically via JavaScript
- Common styles are in `../assets/css/styles.css`
- Each page can have its own inline styles for page-specific styling

