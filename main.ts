import { MarkdownView, Plugin } from 'obsidian';
import * as path from 'path';

enum Modes {
	Reading = 'read',
	Editing = 'edit',
	Source = 'edit-source',
	Preview = 'edit-preview'
}

export default class ViewmodeFrontmatterPlugin extends Plugin {

	livePreviewConfig = true;

	async refreshEditConfig() {
		const prev = this.livePreviewConfig;
		this.livePreviewConfig = JSON.parse(
			await this.app.vault.adapter.read(
				path.join(this.app.vault.configDir, 'app.json')
			)
		).livePreview ?? true; // Default value for editing style is Preview
		return prev !== this.livePreviewConfig;
	}

	async setViewMode(view: MarkdownView, viewmode: string) {
		let state = view.getState();

		switch (viewmode) {
			case Modes.Reading:
				state.mode = 'preview';
				break;
			case Modes.Editing: // Use the cached preferred editing style and update the cached value in the background
				this.refreshEditConfig().then(async changed => changed 
					&& await this.setViewMode(view, this.livePreviewConfig 
						? Modes.Preview 
						: Modes.Source)
					);
			case Modes.Source:
			case Modes.Preview:
				state.mode = 'source';
				state.source = viewmode === Modes.Source || viewmode === Modes.Editing && !this.livePreviewConfig;
				break;
			default: // Ignore invalid modes
				return;
		}
		if (viewmode === Modes.Reading) {
			state.mode = 'preview';
		}

		await view.setState(state, { history: false });
	}

	async onload() {
		await this.refreshEditConfig();
		this.registerEvent(this.app.workspace.on('file-open', async file => {
			if (!file) return;

			const fileCache = this.app.metadataCache.getFileCache(file);
			if (!fileCache || !fileCache.frontmatter) return;

			const { 'force-view': viewmode } = fileCache.frontmatter;
			if (!viewmode) return;

			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) return;

			await this.setViewMode(view, viewmode);
		}));
	}

	onunload() {

	}
}