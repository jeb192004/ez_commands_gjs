import Gio from 'gi://Gio';
import GObject from 'gi://GObject';


export const CommandItem = GObject.registerClass({
	GTypeName: 'FbrCommand',
	Properties: {
		name: GObject.ParamSpec.string('name', 'Name', 'Name of the file', GObject.ParamFlags.READWRITE, ''),
		//icon: GObject.ParamSpec.object('icon', 'Icon', 'Icon for the file', GObject.ParamFlags.READWRITE, ''),
		//type: GObject.ParamSpec.enum('type', 'Type', 'File type', GObject.ParamFlags.READWRITE, '', ''),
	}
}, class extends GObject.Object {});
