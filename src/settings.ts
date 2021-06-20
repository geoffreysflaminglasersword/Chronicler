import { App, PluginSettingTab, Setting, SliderComponent } from "obsidian";
import { RRule, Weekday } from 'rrule';

import Chronicler from './main';
import { writable } from "svelte/store";

export interface ChroniclerSettings {
    fallbackLastBound: boolean;
    weekStarts: string,
    weekStart: Weekday;
    defaultMaxEvents: number;
    autocompleteTriggerPhrase: string;
}

export const DEFAULT_SETTINGS: ChroniclerSettings = {
    fallbackLastBound: true,
    weekStarts: 'Sunday',
    weekStart: RRule.SU,
    defaultMaxEvents: 8,
    autocompleteTriggerPhrase: '@'
};

export const settings = writable(DEFAULT_SETTINGS);

export class ChroniclerSettingTab extends PluginSettingTab {
    plugin: Chronicler;

    constructor(app: App, plugin: Chronicler) {
        super(app, plugin);
        this.plugin = plugin;
        this.app = app;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Chronicler Settings' });


        new Setting(containerEl)
            .setName('Fallback to Last Parsed Bound')
            .setDesc('When enabled, date recurrance will use the last parsed bound (start or end date) when one isn\'t found. When disabled it wil use right now as the start date and no end date. For example, "every tuesday starting yesterday except every month on the first tuesday" would have yesterday as the start date for both recurrances when this is enabled, even though no start date was specified for the second recurrance.')
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.fallbackLastBound)
                    .onChange(async (value) => {
                        this.plugin.settings.fallbackLastBound = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("First Day of the Week")
            .addDropdown((day) =>
                day
                    .addOption(String(RRule.SU.n), "Sunday")
                    .addOption(String(RRule.MO.n), "Monday")
                    .addOption(String(RRule.TU.n), "Tuesday")
                    .addOption(String(RRule.WE.n), "Wednesday")
                    .addOption(String(RRule.TH.n), "Thursday")
                    .addOption(String(RRule.FR.n), "Friday")
                    .addOption(String(RRule.SA.n), "Saturday")
                    .setValue(this.plugin.settings.weekStarts)
                    .onChange(async (value) => {
                        this.plugin.settings.weekStarts = value;
                        this.plugin.settings.weekStart = new Weekday(Number(value));
                        await this.plugin.saveSettings();
                    })
            );
        new Setting(containerEl) // TODO: use number input rather than slider
            .setName('Default Number of Events for Recurrances')
            .setDesc('If you don\'t include "for n times" in your recurrance, this is is how many events will be produced by default. Reminder: if you\'d like a recurreance to run indefinitely, add the keyword \'forever\', e.g. \'every week forever\'')
            .addSlider((sc) =>
                sc
                    .setLimits(3, 100, 1)
                    .setValue(this.plugin.settings.defaultMaxEvents)
                    .onChange(async (value) => {
                        this.plugin.settings.defaultMaxEvents = value;
                        await this.plugin.saveSettings();

                    }).setDynamicTooltip()

            );

    }
}
