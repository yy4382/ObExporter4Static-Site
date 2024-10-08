import { App, PluginSettingTab, Setting } from "obsidian";
import Ob2StaticPlugin from "@/main";
import { clearIndexedDB } from "@/upload/git";

type UploadGitSettings = {
	// repo info
	repo: string;
	branch: string;
	targetPath: string;

	// use info
	username: string;
	pat: string;

	// commit info
	author: {
		name: string;
		email: string;
	};
	commit_message: string;
};

type UploaderSettings = {
	type: "git";
	git: UploadGitSettings;
};

type TransformSettings = {
	post_prefix: string;
	imageTransformer: "base64";
};

export type SSSettings = {
	transformer: TransformSettings;
	uploader: UploaderSettings;
};

export const DEFAULT_SETTINGS: SSSettings = {
	transformer: {
		post_prefix: "post/",
		imageTransformer: "base64",
	},
	uploader: {
		type: "git",
		git: {
			repo: "",
			branch: "",
			username: "",
			targetPath: "/",
			pat: "",
			author: {
				name: "Obsidian Exporter",
				email: "",
			},
			commit_message: "upd",
		},
	},
};

export class Ob2StaticSettingTab extends PluginSettingTab {
	plugin: Ob2StaticPlugin;
	settings: SSSettings;

	constructor(app: App, plugin: Ob2StaticPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	display(): void {
		const settings = this.plugin.settings;
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl).setHeading().setName("Post Uploader");

		// new Setting(containerEl)
		// 	.setName("Uploader type")
		// 	.addDropdown((dropdown) => {
		// 		dropdown
		// 			.addOption("git", "Git")
		// 			.setValue(settings.uploader.type)
		// 			.onChange(async (value) => {
		// 				settings.uploader.type = value;
		// 				await this.plugin.saveSettings();
		// 				this.display();
		// 			});
		// 	});

		if (settings.uploader.type === "git") {
			new Setting(containerEl)
				.setName("Repo link")
				.setDesc("Full URL of the git repository")
				.addText((text) =>
					text.setValue(settings.uploader.git.repo).onChange(async (value) => {
						settings.uploader.git.repo = value;
						await this.plugin.saveSettings();
					}),
				);

			new Setting(containerEl)
				.setName("Branch")
				.setDesc("Branch name")
				.addText((text) =>
					text
						.setValue(settings.uploader.git.branch)
						.onChange(async (value) => {
							settings.uploader.git.branch = value;
							await this.plugin.saveSettings();
						}),
				);

			new Setting(containerEl).setName("GitHub username").addText((text) =>
				text
					.setValue(settings.uploader.git.username)
					.onChange(async (value) => {
						settings.uploader.git.username = value;
						await this.plugin.saveSettings();
					}),
			);
			new Setting(containerEl)
				.setName("GitHub personal access token")
				.setDesc("Password when 'git login'")
				.addText((text) =>
					text.setValue(settings.uploader.git.pat).onChange(async (value) => {
						settings.uploader.git.pat = value;
						await this.plugin.saveSettings();
					}),
				);
			new Setting(containerEl).setName("Git commit message").addText((text) =>
				text
					.setValue(settings.uploader.git.commit_message)
					.onChange(async (value) => {
						settings.uploader.git.commit_message = value;
						await this.plugin.saveSettings();
					}),
			);
			new Setting(containerEl)
				.setName("Author name")
				.setDesc("Used as 'git config user.name'")
				.addText((text) =>
					text
						.setValue(settings.uploader.git.author.name)
						.onChange(async (value) => {
							settings.uploader.git.author.name = value;
							await this.plugin.saveSettings();
						}),
				);
			new Setting(containerEl)
				.setName("Author email")
				.setDesc("Used as 'git config user.email'")
				.addText((text) =>
					text
						.setValue(settings.uploader.git.author.email)
						.onChange(async (value) => {
							settings.uploader.git.author.email = value;
							await this.plugin.saveSettings();
						}),
				);

			new Setting(containerEl)
				.setName("Delete cache")
				.setDesc("Delete the local cache database used by git")
				.addButton((button) => {
					button.setButtonText("Delete").onClick(() => {
						clearIndexedDB();
					});
				});
		}

		new Setting(containerEl).setHeading().setName("Post settings");
		new Setting(containerEl)
			.setName("Post prefix")
			.setDesc(
				`The prefix of the post URL with trailing slash. Default to 'post/'.
				e.g. A link to a note with slug 'abc' will be rendered as '/post/abc'.`,
			)
			.addText((text) =>
				text
					.setPlaceholder("post/")
					.setValue(settings.transformer.post_prefix)
					.onChange(async (value) => {
						settings.transformer.post_prefix = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
