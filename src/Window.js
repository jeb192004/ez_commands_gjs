import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

//<a href="https://www.flaticon.com/free-icons/command" title="command icons">Command icons created by Flat Icons - Flaticon</a>
export const Window = GObject.registerClass({
	GTypeName: 'FbrWindow',
	Template: 'resource:///org/example/filebrowser/ui/Window.ui',
    InternalChildren: ['viewStack'],

}, class extends Gtk.ApplicationWindow {
    constructor(params={}) {
		super(params);
		this.#setupActions();
	}
    #setupActions() {
		// Create the action
		const changeViewAction = new Gio.SimpleAction({
			name: 'change-view',
			parameterType: GLib.VariantType.new('s'),
		});

		// Connect to the activate signal to run the callback
		changeViewAction.connect('activate', (_action, params) => {
			this._viewStack.visibleChildName = params.unpack();
		});

		// Add the action to the window
		this.add_action(changeViewAction);

        const addCommand = new Gio.SimpleAction({
			name: 'add-command',
            //REMOVE BELOW LINE IF BUTTON DOESN'T WORK
            parameterType: GLib.VariantType.new('s'),

		});

		// Connect to the activate signal to run the callback
		addCommand.connect('activate', (_action, params) => {
			console.log('add commmand button clicked!')
		});

		// Add the action to the window
		this.add_action(addCommand);
	}

    
});
