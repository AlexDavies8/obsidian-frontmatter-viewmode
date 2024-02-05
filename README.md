# Obsidian Set View Mode per Note

This plugin allows you to set a view mode when opening specific notes. No configuration needed, just a single property at the top of any note.

This can be done via the `prefer-view` property, which can have the values `read`, `edit`, `edit-source`, or `edit-preview`.

## Examples

```yaml
---
prefer-view: read
---
This note will open in reading mode.
```

```yaml
---
prefer-view: edit
---
This note will open in the preferred editing mode specified in 'Settings > Editor > Default editing mode'.
```

```yaml
---
prefer-view: edit-source
---
This note will open in Source mode for editing.
```

```yaml
---
prefer-view: edit-preview
---
This note will open in Live Preview mode for editing.
```