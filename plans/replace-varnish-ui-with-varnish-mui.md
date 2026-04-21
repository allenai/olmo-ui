# Plan: Replace varnish-ui with varnish-mui

Migrate all 57 files that import from `@allenai/varnish-ui` to use `@mui/material` and `@allenai/varnish2` instead. Each file is fully migrated in one shot using `/migrate-varnish-ui <file-path>`.

The migration rules live in [.claude/skills/migrate-varnish-ui/SKILL.md](/.claude/skills/migrate-varnish-ui/SKILL.md) — review that first.

PRs are organized by feature area so you touch each file once.

---

## PR 1: thread/_ + widgets/_ + standalone (28 files)

Largest PR by file count, but most are cx-only (one-line swap) or simple Button/IconButton swaps. Low risk.

```sh
# cx-only (one-line import swap each)
/migrate-varnish-ui src/components/ContentContainer.tsx
/migrate-varnish-ui src/components/thread/Markdown/CustomComponents.tsx
/migrate-varnish-ui src/components/thread/Markdown/MarkdownRenderer.tsx
/migrate-varnish-ui src/components/thread/PointResponseMessage/CollapsibleMediaWidget.tsx
/migrate-varnish-ui src/components/thread/QueryForm/PromptButton.tsx
/migrate-varnish-ui src/components/thread/ThreadPlaceholder/LinkCard/LinkCard.tsx
/migrate-varnish-ui src/components/thread/ThreadPlaceholder/LinkCard/LinkCardList.tsx
/migrate-varnish-ui src/components/widgets/CollapsibleWidget/CollapsibleWidgetBase.tsx
/migrate-varnish-ui src/components/widgets/CollapsibleWidget/CollapsibleWidgetContent.tsx
/migrate-varnish-ui src/components/widgets/CollapsibleWidget/CollapsibleWidgetFooter.tsx
/migrate-varnish-ui src/components/widgets/CollapsibleWidget/CollapsibleWidgetHeading.tsx
/migrate-varnish-ui src/components/widgets/CollapsibleWidget/CollapsibleWidgetPanel.tsx
/migrate-varnish-ui src/components/widgets/CollapsibleWidget/CollapsibleWidgetTrigger.tsx
/migrate-varnish-ui src/components/widgets/SliderFadeOverflow.tsx
/migrate-varnish-ui src/components/widgets/ThinkingWidget.tsx
/migrate-varnish-ui src/pages/agent/AgentPage.tsx

# Simple component swaps
/migrate-varnish-ui src/components/LinkButton.tsx
/migrate-varnish-ui src/components/StyledTooltip.tsx
/migrate-varnish-ui src/components/ThemeSyntaxHighlighter.tsx
/migrate-varnish-ui src/components/svg/Thinking.tsx
/migrate-varnish-ui src/components/thread/MessageInteraction/FeatureToggleButton.tsx
/migrate-varnish-ui src/components/thread/MessageInteraction/MessageInteractionIcon.tsx
/migrate-varnish-ui src/components/thread/ScrollToBottomButton.tsx
/migrate-varnish-ui src/components/thread/PointResponseMessage/TrackingHiddenAlert.tsx
/migrate-varnish-ui src/components/thread/ThreadPlaceholder/ThreadPlaceholder.tsx
/migrate-varnish-ui src/components/thread/tools/ToolCallWidget/ToolCallResult.tsx
/migrate-varnish-ui src/components/thread/parameter/inputs/ParameterToggle.tsx
/migrate-varnish-ui src/components/thread/parameter/ExtraParametersInput.tsx
```

---

## PR 2: form/_ + admin/modelConfig/_ (20 files)

Forms and admin config. The riskiest area — `onChange` callback signatures differ between React Aria and MUI, and the Select collection API changes completely. Test form submission carefully.

```sh
# Form wrappers
/migrate-varnish-ui src/components/form/ControlledInput.tsx
/migrate-varnish-ui src/components/form/ControlledRadioGroup.tsx
/migrate-varnish-ui src/components/form/ControlledSelect.tsx
/migrate-varnish-ui src/components/form/ControlledSwitch.tsx
/migrate-varnish-ui src/components/form/SliderWithInput.tsx
/migrate-varnish-ui src/components/form/TextArea/ControlledTextArea.tsx
/migrate-varnish-ui src/components/form/TextArea/FullWidthTextArea.tsx
/migrate-varnish-ui src/components/form/TextArea/ExpandableTextArea.tsx
/migrate-varnish-ui src/components/TermsAndDataCollectionModal.tsx

# Admin model config
/migrate-varnish-ui src/pages/admin/modelConfig/ModelConfigurationListPage/ModelConfigurationListPage.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/ReorderModelsPage/ReorderModelsPage.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigForm/ModelConfigForm.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigForm/MultiModalFields.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigForm/inputs/FileSizeInput/FileSizeInput.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigForm/inputs/InfiniGramIndexInput.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigForm/inputs/ModelHostSelect.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigForm/inputs/modelHostMeta.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigurationList/DeleteModelDialog.tsx
/migrate-varnish-ui src/pages/admin/modelConfig/components/ModelConfigurationList/ModelConfigurationListItem.tsx
/migrate-varnish-ui src/components/datepicker/DatePicker.tsx
```

---

## PR 3: toolCalling/_ + video/_ (9 files)

Tool calling dialogs (modals, tabs) and video controls (slider sub-components). These need structural changes — ModalTrigger -> useState, Tabs -> controlled, SliderBase composition -> MUI Slider.

```sh
# Tool calling
/migrate-varnish-ui src/components/toolCalling/ToolCallDisplay.tsx
/migrate-varnish-ui src/components/toolCalling/ToolsDialog/ToolDeclrationDialog/ToolGroupSection.tsx
/migrate-varnish-ui src/components/toolCalling/ToolsDialog/ToolDeclrationDialog/TabbedContent.tsx
/migrate-varnish-ui src/components/toolCalling/ToolsDialog/ToolDeclrationDialog/ToolDeclarationDialog.tsx

# Video
/migrate-varnish-ui src/components/video/controls/SeekBar.tsx
/migrate-varnish-ui src/components/video/VideoPlayerContainer.tsx
/migrate-varnish-ui src/components/video/pointing/VideoDotControl.tsx
/migrate-varnish-ui src/components/video/controls/VolumeControl.tsx
/migrate-varnish-ui src/components/datepicker/Calendar.tsx
```

---

## PR 4: Cleanup

Remove `@allenai/varnish-ui` from the project. No skill needed — manual changes:

1. **`package.json`**: Remove `"@allenai/varnish-ui"` dependency. Check if `react-aria-components` and `@react-aria/utils` are still used anywhere; if not, remove them too.
2. **`panda.config.ts`**: Remove `import varnishPreset from '@allenai/varnish-ui/panda'` and the `varnish.panda.include.json` entry from `include`. Decide whether to keep `presets: [varnishPreset]` or replace with a standalone panda config.
3. **`vite.config.mts`**: Remove the `varnish-ui-sprite.svg` static copy target.
4. **Verify**: `grep -r "varnish-ui" src/` returns nothing.
5. **`yarn install`** to update lockfile.
6. **Run tests**: `yarn test`

---

## Validation after each PR

```bash
npx tsc --noEmit          # type check
yarn test                  # unit tests
yarn build                 # full build
```

Visually spot-check any components that changed (especially forms in PR2 and modals/tabs in PR3).
