---
name: migrate-varnish-ui
description: Migrate a file from @allenai/varnish-ui (React Aria) to @allenai/varnish2 / @mui/material (MUI). Use when replacing varnish-ui imports with MUI equivalents.
argument-hint: <file-path>
---

# Migrate varnish-ui to varnish-mui/MUI

Migrate the file at `$ARGUMENTS` from `@allenai/varnish-ui` to `@allenai/varnish2` (varnish-mui) and `@mui/material`.

## Instructions

1. Make a new branch if not already on a feature branch.
2. **Read the file** and identify all `@allenai/varnish-ui` imports.
3. **If possible, find a page that renders this component** by tracing imports: grep for files that import the component, follow the chain up to a a storybook or a route/page, then determine the URL to that storybook or page. Use Playwright MCP to navigate to that storybook or page and take a screenshot of the before state.
4. **Apply the migration rules below** to replace each import and update component usage.
5. **Edit the file** with the changes.
6. **Run `npx tsc --noEmit $ARGUMENTS`** to verify the file compiles. Fix any type errors.
7. Do NOT change anything unrelated to the varnish-ui migration.
8. Use Playwright MCP to navigate to the same page and take a screenshot of the after state.
9. Warn the user if you encounter a varnish-ui import not covered by the rules, or if you see react-aria-components imports that may need to be removed.
10. Warn the user if a MUI component does not support a feature that was used from varnish-ui (e.g., `errorMessage` on Switch). In that case, remove the unsupported prop and suggest an alternative approach if possible (e.g., use `FormHelperText` for error messages). Or if a variant or prop value is not supported in MUI, suggest the closest alternative or a custom style override.
11. Commit the changes as long as you are not on the main branch, and include a detailed commit message.
12. Make a pull request including the before/after screenshots, a good description of the changes, and point out any issues that may require specific attention.

## Varnish-mui theme extensions

varnish-mui (`@allenai/varnish2`) extends MUI's type system. Do NOT remove or downgrade these props — they are valid:

- **Extra colors on most components**: `"tertiary"`, `"default"` (in addition to MUI's primary/secondary/error/etc.)
- **`"large"` size** on: Checkbox, Radio, Switch, Slider, IconButton, TextField, Select, FormControl, InputLabel, InputBase, Link
- **`shape` prop** (`"rounded"` | `"box"`) on: Button, IconButton, Chip, TextField, Select, Tooltip, SnackbarContent
- **`variant` prop on IconButton**: `"contained"` | `"outlined"` | `"text"` (standard MUI IconButton doesn't have this)
- **`size` prop on Link**: `"small"` | `"medium"` | `"large"`
- **`"xsmall"` and `"large"` size on Chip**

When migrating, keep these prop values as-is. They will work because the project uses the varnish-mui theme.

## Migration rules

### `cx` utility

```
// BEFORE
import { cx } from '@allenai/varnish-ui';

// AFTER
import { cx } from '@allenai/varnish-panda-runtime/css';
```

If the file already imports from `@allenai/varnish-panda-runtime/css`, merge `cx` into the existing import.

### Button

```
// BEFORE
import { Button } from '@allenai/varnish-ui';
<Button variant="contained" color="primary" onClick={fn} isDisabled={x} startIcon={<Icon />}>Label</Button>

// AFTER
import { Button } from '@mui/material';
<Button variant="contained" color="primary" onClick={fn} disabled={x} startIcon={<Icon />}>Label</Button>
```

Prop changes:

- `isDisabled` -> `disabled`
- `onPress` -> `onClick` (if used instead of onClick)
- `shape` -> keep as-is (varnish-mui adds `shape: 'rounded' | 'box'` to MUI Button)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors beyond standard MUI)
- Variant values `"contained"`, `"outlined"`, `"text"` are the same in MUI.

If importing `ButtonProps`, change to: `import { ButtonProps } from '@mui/material';`

### IconButton

```
// BEFORE
import { IconButton, IconButtonProps } from '@allenai/varnish-ui';
<IconButton onClick={fn} color="primary" variant="text" aria-label="Close"><CloseIcon /></IconButton>

// AFTER
import { IconButton, IconButtonProps } from '@mui/material';
<IconButton onClick={fn} color="primary" aria-label="Close"><CloseIcon /></IconButton>
```

Prop changes:

- `variant` -> keep as-is (varnish-mui adds `variant: 'contained' | 'outlined' | 'text'` to MUI IconButton)
- `shape` -> keep as-is (varnish-mui adds `shape: 'rounded' | 'box'` to MUI IconButton)
- `size="large"` -> keep as-is (varnish-mui adds `large` size to MUI IconButton)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors)
- `isDisabled` -> `disabled`

### ButtonLink

```
// BEFORE
import { ButtonLink } from '@allenai/varnish-ui';
<ButtonLink href="/path" size="small">Text</ButtonLink>

// AFTER
import { Button } from '@mui/material';
<Button href="/path" size="small" component="a">Text</Button>
```

Or if using react-router Links, use the existing `LinkButton` component from this codebase if appropriate.

### Checkbox

```
// BEFORE
import { Checkbox } from '@allenai/varnish-ui';
<Checkbox isSelected={value} onChange={onChange} color="default" size="large">Label text</Checkbox>

// AFTER
import { Checkbox, FormControlLabel } from '@mui/material';
<FormControlLabel
    control={<Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} color="default" size="large" />}
    label="Label text"
/>
```

Prop changes:

- `isSelected` -> `checked`
- `onChange` callback signature changes: varnish-ui passes `(isSelected: boolean)`, MUI passes `(event, checked)`.
- `size` -> keep as-is (varnish-mui adds `"large"` size: small, medium, large all supported)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors)
- Children become the `label` prop on `FormControlLabel`.

### Switch

```
// BEFORE
import { Switch, SwitchProps } from '@allenai/varnish-ui';
<Switch isSelected={value} onChange={onChange} size="large" errorMessage={msg} />

// AFTER
import { Switch, SwitchProps } from '@mui/material';
<Switch checked={value} onChange={(e) => onChange(e.target.checked)} size="large" />
```

Prop changes:

- `isSelected` -> `checked`
- `onChange` callback signature changes (same as Checkbox).
- `size` -> keep as-is (varnish-mui adds `"large"` size: small, medium, large all supported)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors)
- `errorMessage` -> remove (handle error display separately with `FormHelperText`)
- `inputRef` -> `inputRef` (same)

If `SwitchProps` is imported, change to `import { SwitchProps } from '@mui/material';`

### Radio / RadioGroup

```
// BEFORE
import { RadioGroup, RadioGroupProps } from '@allenai/varnish-ui';
import { Radio } from '@allenai/varnish-ui';

// AFTER
import { RadioGroup, RadioGroupProps, Radio, FormControlLabel } from '@mui/material';
```

MUI Radio needs to be wrapped in FormControlLabel:

```
// BEFORE
<Radio value="opt1">Option 1</Radio>

// AFTER
<FormControlLabel value="opt1" control={<Radio />} label="Option 1" />
```

Prop notes:

- `size` -> keep as-is (varnish-mui adds `"large"` size: small, medium, large all supported)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors)

### Input

```
// BEFORE
import { Input, InputProps } from '@allenai/varnish-ui';
<Input label="Name" value={v} onChange={onChange} isInvalid={invalid} errorMessage={err} isRequired={req} />

// AFTER
import { TextField, TextFieldProps } from '@mui/material';
<TextField label="Name" value={v} onChange={(e) => onChange(e.target.value)} error={invalid} helperText={err} required={req} />
```

Prop changes:

- Component name: `Input` -> `TextField`
- Type name: `InputProps` -> `TextFieldProps`
- `isInvalid` -> `error`
- `errorMessage` -> `helperText` (only shown when `error` is true)
- `isRequired` -> `required`
- `onChange` callback: varnish-ui passes the value directly, MUI passes the event.
- `validationBehavior` -> remove (not needed in MUI)
- `size` -> keep as-is (varnish-mui adds `"large"` size: small, medium, large all supported)
- `shape` -> keep as-is (varnish-mui adds `shape: 'rounded' | 'box'` to TextField)

### TextArea

```
// BEFORE
import { TextArea, TextAreaProps } from '@allenai/varnish-ui';
<TextArea label="Notes" value={v} onChange={onChange} />

// AFTER
import { TextField, TextFieldProps } from '@mui/material';
<TextField label="Notes" value={v} onChange={(e) => onChange(e.target.value)} multiline />
```

Same prop changes as Input, plus add `multiline` prop.

### Select / SelectListBoxItem / SelectListBoxSection

```
// BEFORE
import { Select, SelectProps, SelectListBoxItem, SelectListBoxSection } from '@allenai/varnish-ui';
<Select label="Unit" selectedKey={value} onSelectionChange={onChange}>
    <SelectListBoxSection header="Group">
        <SelectListBoxItem id="opt1" text="Option 1" textValue="Option 1" />
    </SelectListBoxSection>
</Select>

// AFTER
import { TextField, MenuItem, ListSubheader } from '@mui/material';
<TextField select label="Unit" value={value} onChange={(e) => onChange(e.target.value)}>
    <ListSubheader>Group</ListSubheader>
    <MenuItem value="opt1">Option 1</MenuItem>
</TextField>
```

Prop changes:

- `Select` -> `TextField` with `select` prop (or `import { Select } from '@mui/material'` with different children pattern)
- `SelectProps` -> `TextFieldProps`
- `selectedKey` -> `value`
- `onSelectionChange` -> `onChange` (MUI passes event, extract `e.target.value`)
- `SelectListBoxItem` -> `MenuItem` with `value` instead of `id`, children instead of `text`
- `SelectListBoxSection` -> `ListSubheader`
- Remove `textValue` prop
- `size` -> keep as-is (varnish-mui adds `"large"` size: small, medium, large all supported)
- `shape` -> keep as-is (varnish-mui adds `shape: 'rounded' | 'box'` to Select)

### Label

```
// BEFORE
import { Label } from '@allenai/varnish-ui';

// AFTER
import { InputLabel } from '@mui/material';
```

Or remove if the label is now handled by `TextField`'s `label` prop.

### FieldError

```
// BEFORE
import { FieldError } from '@allenai/varnish-ui';
<FieldError>{message}</FieldError>

// AFTER
import { FormHelperText } from '@mui/material';
<FormHelperText error>{message}</FormHelperText>
```

### Modal / ModalTrigger / ModalActions

```
// BEFORE
import { Modal, ModalTrigger, ModalActions } from '@allenai/varnish-ui';
<ModalTrigger>
    <Button>Open</Button>
    <Modal heading="Title" isDismissable size="large" buttons={<ModalActions>...</ModalActions>}>
        Content
    </Modal>
</ModalTrigger>

// AFTER
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// Add state: const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
    <DialogTitle>Title</DialogTitle>
    <DialogContent>Content</DialogContent>
    <DialogActions>...</DialogActions>
</Dialog>
```

Key changes:

- `ModalTrigger` pattern is replaced with controlled `open` state + `useState`.
- `Modal` -> `Dialog`
- `heading` prop -> `<DialogTitle>` child component
- `isDismissable` -> handled by default `onClose` behavior
- `size="large"` -> `maxWidth="lg"`
- `fullWidth` -> `fullWidth` (same)
- `buttons` prop -> `<DialogActions>` child component
- `ModalActions` -> `DialogActions`
- `closeButton` prop -> render your own IconButton inside DialogTitle
- `isOpen` -> `open`

For Modal without ModalTrigger (controlled):

```
// BEFORE
<Modal isOpen={isOpen} heading="Title" isDismissable closeButton={<IconButton>...</IconButton>} buttons={<ModalActions>...</ModalActions>}>

// AFTER
<Dialog open={isOpen} onClose={onClose} ...>
    <DialogTitle>Title <IconButton onClick={onClose}>...</IconButton></DialogTitle>
    <DialogContent>...</DialogContent>
    <DialogActions>...</DialogActions>
</Dialog>
```

### Dialog (varnish-ui) / DialogCloseButton

varnish-ui's Dialog is similar to Modal. Migrate to MUI Dialog same as above.
`DialogCloseButton` -> `<IconButton onClick={onClose}><CloseIcon /></IconButton>`

### Popover

```
// BEFORE
import { Popover } from '@allenai/varnish-ui';

// AFTER
import { Popover } from '@mui/material';
```

MUI Popover uses `anchorEl`/`open` pattern instead of React Aria's trigger pattern. Add state management:

```
const [anchorEl, setAnchorEl] = useState(null);
<Button onClick={(e) => setAnchorEl(e.currentTarget)}>Open</Button>
<Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
    Content
</Popover>
```

### Tooltip

```
// BEFORE
import { Tooltip, TooltipProps } from '@allenai/varnish-ui';
<Tooltip placement="bottom" delay={50} arrow>...</Tooltip>

// AFTER
import { Tooltip, TooltipProps } from '@mui/material';
<Tooltip placement="bottom" enterDelay={50} arrow>...</Tooltip>
```

Prop changes:

- `delay` -> `enterDelay`
- `shape` -> keep as-is (varnish-mui adds `shape: 'rounded' | 'box'` to Tooltip)
- If children is not a native element or forwardRef component, wrap in `<span>`.
- Remove any `Focusable` wrappers from react-aria-components (no longer needed).

### Alert

```
// BEFORE
import { Alert } from '@allenai/varnish-ui';
<Alert severity="info" icon={false} action={<Button>...</Button>}>Message</Alert>

// AFTER
import { Alert } from '@mui/material';
<Alert severity="info" icon={false} action={<Button>...</Button>}>Message</Alert>
```

API is nearly identical. Should work as-is in most cases.

### Card / CardHeader / Stack

```
// BEFORE
import { Card, CardHeader, Stack } from '@allenai/varnish-ui';

// AFTER
import { Card, CardHeader, Stack } from '@mui/material';
```

Prop changes for Stack:

- `spacing={10}` (varnish-ui uses pixel values) -> `spacing={1.25}` (MUI uses theme spacing units, where 1 = 8px). Convert: `MUI spacing = pixels / 8`.
- `direction` -> `direction` (same)

### Tabs / Tab / TabPanel

```
// BEFORE
import { Tabs, Tab, TabPanel } from '@allenai/varnish-ui';
<Tabs>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
    <TabPanel id="tab1">Content 1</TabPanel>
    <TabPanel id="tab2">Content 2</TabPanel>
</Tabs>

// AFTER
import { Tabs, Tab, Box } from '@mui/material';
// Add state: const [tabValue, setTabValue] = useState(0);
<Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
    <Tab label="Tab 1" />
    <Tab label="Tab 2" />
</Tabs>
{tabValue === 0 && <Box p={2}>Content 1</Box>}
{tabValue === 1 && <Box p={2}>Content 2</Box>}
```

Key changes:

- MUI Tabs are controlled with index-based value.
- Tab children -> `label` prop.
- TabPanel -> conditional rendering or custom TabPanel component.

### LoadingSpinner

```
// BEFORE
import { LoadingSpinner } from '@allenai/varnish-ui';
<LoadingSpinner />

// AFTER
import { CircularProgress } from '@mui/material';
<CircularProgress />
```

### Slider (simple)

```
// BEFORE
import { Slider, SliderProps } from '@allenai/varnish-ui';
<Slider value={v} onChange={onChange} orientation="horizontal" />

// AFTER
import { Slider, SliderProps } from '@mui/material';
<Slider value={v} onChange={(e, val) => onChange(val)} orientation="horizontal" />
```

Prop changes:

- `onChange` callback: varnish-ui passes value directly, MUI passes `(event, value)`.
- `outputClassName` -> remove (MUI doesn't have this; hide the value label with `valueLabelDisplay="off"`)
- `size` -> keep as-is (varnish-mui adds `"large"` size: small, medium, large all supported)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors)

### Slider (compositional sub-components: SliderBase, SliderTrack, SliderThumb, SliderTrackIndicator)

This pattern is used in VolumeControl.tsx. MUI Slider is monolithic — there are no separate sub-components. Replace the entire composition with a single MUI `<Slider>`.

```
// BEFORE
import { SliderBase, type SliderProps, SliderThumb, SliderTrack, SliderTrackIndicator } from '@allenai/varnish-ui';
import { type SliderTrackRenderProps as AriaSliderTrackRenderProps } from 'react-aria-components';

const Slider = <T extends number | number[]>({
    color = 'default', size = 'medium', orientation, ...props
}: SliderProps<T>) => (
    <SliderBase color={color} size={size} orientation={orientation} {...props}>
        <SliderTrack color={color} size={size} orientation={orientation}>
            {({ orientation, state }: AriaSliderTrackRenderProps) => (
                <>
                    <SliderTrackIndicator color={color} size={size} orientation={orientation} state={state} />
                    {state.values.map((_, i) => (
                        <SliderThumb color={color} size={size} orientation={orientation} autoFocus key={i} index={i} />
                    ))}
                </>
            )}
        </SliderTrack>
    </SliderBase>
);

// AFTER
import { Slider, type SliderProps } from '@mui/material';
// Remove the AriaSliderTrackRenderProps import from react-aria-components.
// Replace the custom Slider component with direct MUI Slider usage:
<Slider
    orientation={orientation}
    value={value}
    onChange={(e, val) => onChange(val as number)}
    aria-label="..."
    size="small"
    sx={{ /* custom styling if needed */ }}
/>
```

Key changes:

- Remove ALL sub-component imports (SliderBase, SliderTrack, SliderThumb, SliderTrackIndicator).
- Remove the `AriaSliderTrackRenderProps` import from `react-aria-components`.
- Delete the custom Slider wrapper component entirely.
- Use MUI `<Slider>` directly at the call site.
- `color` / `size` map directly to MUI Slider's `color` / `size` props (varnish-mui supports `"default"`, `"tertiary"` colors and `"large"` size).
- `outputClassName={css({ display: 'none' })}` -> `valueLabelDisplay="off"` or just omit (off by default).

### CodeBlock

```
// BEFORE
import { CodeBlock, CodeBlockProps } from '@allenai/varnish-ui';

// AFTER
import { CodeBlocks } from '@allenai/varnish2/components';
```

Check varnish2's CodeBlocks API — it may differ. Read the component source if needed.

### Icon

```
// BEFORE
import { Icon, IconProps } from '@allenai/varnish-ui';

// AFTER
import { SvgIcon, SvgIconProps } from '@mui/material';
```

The API will differ. Read the specific usage to determine the right migration.

### Link

```
// BEFORE
import { Link, LinkProps } from '@allenai/varnish-ui';

// AFTER
import { Link, LinkProps } from '@mui/material';
```

Prop notes:

- MUI Link uses `href` prop. If the varnish-ui Link was wrapping react-router, use `component={RouterLink}`.
- `size` -> keep as-is (varnish-mui adds `size: 'small' | 'medium' | 'large'` to Link)
- `color` -> keep as-is (varnish-mui adds `"tertiary"` and `"default"` colors)

## Important notes

- **Do NOT remove PandaCSS usage.** `css()`, `cx()`, `cva()`, `sva()` from `@allenai/varnish-panda-runtime` stay as-is.
- **Preserve all `className` props.** PandaCSS class names are still valid on MUI components.
- **When a file imports both `cx` and components** from varnish-ui, split into two imports: `cx` from panda-runtime, components from MUI.
- **For files using react-hook-form integration**, the `onChange` callback signature change is critical. varnish-ui passes values directly; MUI passes events. Update the `useController` or `Controller` integration accordingly.
- **Do not change** any other imports or code unrelated to the migration.
- If you encounter a varnish-ui import not covered above, flag it and ask the user.
- **Some files also import from `react-aria-components`** (e.g., `DialogTrigger`, `Popover`, `Focusable`, `SliderTrackRenderProps`). If a react-aria-components import is ONLY used because of varnish-ui patterns (e.g., `Focusable` wrapping Tooltip children, `DialogTrigger` paired with varnish-ui Popover, `AriaSliderTrackRenderProps` for slider composition), remove it as part of the migration. If it's used for other purposes, leave it.
