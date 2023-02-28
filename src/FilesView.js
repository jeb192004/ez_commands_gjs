import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

import { File } from './File.js';


export const FilesView = GObject.registerClass({
	GTypeName: 'FbrFilesView',
	Template: 'resource:///org/example/filebrowser/ui/FilesView.ui',
	Properties: {
		files: GObject.ParamSpec.object(
			'files',
			'Files',
			'The list model containing the files',
			GObject.ParamFlags.READWRITE,
			Gio.ListStore
		),
	},
	InternalChildren: ['hiddenFileFilterModel'],
}, class extends Gtk.Widget {
	#showHiddenFiles = false;

	constructor(params={}) {
		super(params);
		this.#initializeFiles();
		this.#setupHiddenFileFilterModel();
	}

	#initializeFiles() {
		// Create the Gio.ListStore that will contain File objects
		this.files = Gio.ListStore.new(File);

		// Get the current directory
		const currentDir = Gio.File.new_for_path(GLib.get_current_dir());

		// Get an enumerator of all children
		const children = currentDir.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NOFOLLOW_SYMLINKS, null);

		// Iterate over the enumerator and add each child to the list store
		let fileInfo;
		while (fileInfo = children.next_file(null)) {
			this.files.append(new File({
				name: fileInfo.get_display_name(),
				icon: Gio.content_type_get_icon(fileInfo.get_content_type()),
				type: fileInfo.get_file_type(),
			}));
		}
	}

	#setupHiddenFileFilterModel(){
		this._hiddenFileFilterModel.filter = Gtk.CustomFilter.new(item => {
			return this.#showHiddenFiles ? true : item.name.charAt(0) !== '.';
		});
	}

	onShowHiddenFilesButtonToggled(button) {
		this.#showHiddenFiles = button.active;
		this._hiddenFileFilterModel.filter.changed(
			button.active
			? Gtk.FilterChange.LESS_STRICT
			: Gtk.FilterChange.MORE_STRICT
		);
	}

	onListViewActivated(listview, position) {
		console.log('Row activated!');
		const item = listview.model.get_item(position);
		console.log(item.name);
	}

	onSelectionChanged(selectionmodel, _position, _n_items) {
		console.log('Selection changed!');
		const selection = selectionmodel.get_selection();
		for (let i = 0; i < selection.get_size(); i++) {
			const position = selection.get_nth(i);
			const item = selectionmodel.get_item(position);
			console.log(item.name);
		}
	}
});
