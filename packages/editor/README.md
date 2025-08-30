# @optima/editor

A rich text editor package with slash command functionality built on top of TipTap and using components from @optima/ui.

## Features

- **Slash Commands**: Type "/" to open a command palette with various text formatting options
- **UI Components**: Uses @optima/ui components for consistent styling
- **TypeScript**: Fully typed for better development experience
- **Extensible**: Easy to add new slash command items

## Components

### SlashCommandList
A component that renders the list of available slash commands with keyboard navigation support.

### SlashCommandWrapper  
A wrapper component that manages the slash command state and integrates with the editor.

### SlashCommand Extension
A TipTap extension that provides slash command functionality with React integration.

## Usage

```tsx
import { Editor } from "@optima/editor";
import { SlashCommand } from "@optima/editor";

// Add the slash command extension to your editor
const editor = useEditor({
  extensions: [
    // ... other extensions
    SlashCommand,
  ],
  // ... other config
});
```

## Available Slash Commands

- **Text** - Plain text paragraph
- **Heading 1** - Large heading  
- **Heading 2** - Medium heading
- **Heading 3** - Small heading
- **Bullet List** - Unordered list
- **Numbered List** - Ordered list
- **Quote** - Blockquote
- **Code** - Code block
- **Divider** - Horizontal rule
- **Task List** - Checkbox list

## Customization

You can customize the available slash commands by modifying the `slashCommandItems` array in `slash-command-items.ts`.

## Dependencies

- @tiptap/core
- @tiptap/react
- @tiptap/starter-kit
- @tiptap/suggestion
- @optima/ui
- lucide-react
- tippy.js
- react
- react-dom
