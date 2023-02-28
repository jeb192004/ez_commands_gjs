import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';


const { Gio, GLib, Gdk } = imports.gi;

var commandJsonArray = [];

export const WelcomeWidget = GObject.registerClass({
	GTypeName: 'FbrWelcomeWidget',
	CssName: 'welcome',
	Template: 'resource:///org/example/filebrowser/ui/WelcomeWidget1.ui',
	InternalChildren: ['command_entry', 'command_name', 'git_info', 'commmand_list_container'],
	Properties: {
		WelcomeText: GObject.ParamSpec.string(
			'welcome-text', // name
			'Welcome Text', // nick
			'The text displayed by the widget', // blurb
			GObject.ParamFlags.READWRITE, // flags
			'' // default value
		),

	},

	Signals: {
		'button-clicked': {},
	},
}, class extends Gtk.Widget {

	get welcomeText() {
		// Return a default value if the text hasn't been set yet
		return this._welcomeText || '';
	}
	set welcomeText(value) {

		var commmand_list_container = this._commmand_list_container;
		try{
			var display = Gdk.Display.get_default();
			var clipboard = display.get_clipboard();
			log('clipboard: '+ display.toString())
			clipboard.set('hello');//NO ERROR BUT DOESNT SET TEXT TO CLIPBOARD.  DONT KNOW WHAT ITS DOING.
			//var cb_display = Gdk.Clipboard.gdk_clipboard_set_text('display');
			//Gdk.Clipboard.set('hello');
			//log(cb_display)
			//var cb = window.navigator.clipboard.writeTe
		}catch(err){log(err)}

		this.read_json().then((res) => {

			//console.log(res)
			JSON.parse(res).forEach((item) => {
				var json = {};
				json['id'] = item.id;
				json['name'] = item.name;
				json['command'] = item.command;
				commandJsonArray.push(json)
				//console.log(item)
				const box = new Gtk.Box({
					orientation: Gtk.Orientation.HORIZONTAL,
					marginTop: 10,
					marginBottom: 10,
					marginStart: 10,
					marginEnd: 10,
					spacing: 10
				});
				const label = new Gtk.Label({
					label: item.name,
					wrap: true,

				});
				box.append(label)
				if (item.command.includes('clone') || item.command.includes('push') || item.command.includes('pull')) {
					const cloneButton = new Gtk.Button({ label: 'Clone' });
					cloneButton.connect('clicked', () => {
						var command = item.command.replace('push', 'clone').replace('pull', 'clone');
						log(command)
					});
					box.append(cloneButton);
					const pushButton = new Gtk.Button({ label: 'Push' });
					pushButton.connect('clicked', () => {
						var command = item.command.replace('clone', 'push').replace('pull', 'push');
						log(command)
					});
					box.append(pushButton);
					const pullButton = new Gtk.Button({ label: 'Pull' });
					pullButton.connect('clicked', () => {
						var command = item.command.replace('push', 'pull').replace('clone', 'pull');
						log(command)
					});
					box.append(pullButton);
				} else {
					const button = new Gtk.Button({ label: 'Copy' });
					button.connect('clicked', () => {
						log(item.command);
					});
					box.append(button);
				}
				commmand_list_container.append(box);


			})
			//log(commandJsonArray)

		}).catch((err) => { console.log(err) })

		this._command_name.set_placeholder_text('Name');
		this._command_entry.set_placeholder_text('Command');
		//NOT NEEDED
		// Do nothing if the new value is the same as the old one
		if (this._welcomeText === value)
			return;
		// Store the value in an internal property
		this._welcomeText = value;
		// Hide the label if no text is set
		//this._welcomeLabel.visible = !!value;
		// Notify that the value has changed
		this.notify('welcome-text');
	}

	onButtonClicked(_button) {
		var name = this._command_name.get_buffer().text;
		var command = this._command_entry.get_buffer().text;
		var newId = commandJsonArray.length;
		var json = {};
		json['id'] = newId;
		json['name'] = name;
		json['command'] = command;
		commandJsonArray.push(json)
		console.log('Button clicked: ' + JSON.stringify(commandJsonArray));
		this._command_name.get_buffer().text = '';
		this._command_entry.get_buffer().text = '';
		this.write_json_to_file(commandJsonArray).then((res) => { console.log("contents: " + res) }).catch((err) => { console.log("err: " + err) })

	}


	async write_json_to_file(json) {
		const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'ez_commands/commands.txt']);
		const file = Gio.File.new_for_path(filepath);

		// Asynchronous, non-blocking method
		return await new Promise((resolve, reject) => {
			file.replace_contents_bytes_async(
				new GLib.Bytes(JSON.stringify(json)),
				null,
				false,
				Gio.FileCreateFlags.REPLACE_DESTINATION,
				null,
				(file_, result) => {
					try {
						resolve(file.replace_contents_finish(result));
					} catch (e) {
						reject(e);
					}
				}
			);
		});
	}

	async read_json() {
		await this.create_dir().then((res) => { console.log(res) }).catch((err) => { /*console.error(err)*/ })
	await this.create_file().then((res) => { console.log(res) }).catch((err) => { /*console.error(err)*/ })

		const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'ez_commands/commands.txt']);
		const file = Gio.File.new_for_path(filepath);
		//console.log(filepath)
		return await new Promise((resolve, reject) => {
			file.load_contents_async(
				null,
				(file_, result) => {
					try {
						const decoder = new TextDecoder('utf-8');
						const contentsString = decoder.decode(new Uint8Array(file.load_contents_finish(result)[1]));
						resolve(contentsString);
					} catch (e) {
						reject(e);
					}
				}
			);
		});
	}

	async create_dir() {
		const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'ez_commands/']);
		const file = Gio.File.new_for_path(filepath);
		return await new Promise((resolve, reject) => {
			file.make_directory_async(
				GLib.PRIORITY_DEFAULT,
				null,
				(file_, result) => {
					try {
						resolve('Created Directory Succesfully: ' + file.make_directory_finish(result));
					} catch (e) {
						reject('error: ' + e);
					}
				}
			);
		});
		//console.log(mkdir_res);
	}


	async create_file() {
		const filepath = GLib.build_filenamev([GLib.get_home_dir(), 'ez_commands/commands.txt']);
		const file = Gio.File.new_for_path(filepath);

		// Asynchronous, non-blocking method
		return await new Promise((resolve, reject) => {
			file.create_async(
				Gio.FileCreateFlags.NONE,
				GLib.PRIORITY_DEFAULT,
				null,
				(file_, result) => {
					try {
						resolve(file.create_finish(result));
					} catch (e) {
						reject('error: ' + e);
					}
				}
			);
		});

	}

});
