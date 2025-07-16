# Image Hover Effect Component

A JavaScript component that creates an interactive image hover effect with tooltips and clickable areas.

## Features

- Hover effects with smooth opacity transitions
- Clickable areas (colliders) that can link to URLs
- Animated pointer indicators
- Tooltips with customizable text and positioning
- Debug mode for visualizing collider areas

## Installation

1. Include jQuery in your project
2. Add the SnippetImageHover.js file to your project
3. Create HTML structure as shown below

### Required Classes/IDs

- Main container: `js-image-hover`
- Default image: `id="standard"`
- Hover areas: `class="collider"`
- Pointer element: `class="pointer"`

### Attributes

Collider elements accept the following attributes:

- `image`: Path to image to display on hover
- `text`: Tooltip text content
- `rectX/Y`: Position of clickable area
- `rectWidth/Height`: Size of clickable area
- `link`: URL to open when clicked

Pointer elements accept:

- `rectx/y`: Position of the pointer indicator

### Debug Mode

Add `debug` class to main container to visualize collider areas:
