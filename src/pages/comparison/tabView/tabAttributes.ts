// helpers for props
export const viewIdAttr = 'data-view-id';
export const viewPanelId = (id: string) => `comparison-tab-panel-${id}`;
export const viewTabId = (id: string) => `comparison-tab-${id}`;
export const dataViewId = (id: string) => `[${viewIdAttr}="${id}"]`;
