import Gio from 'gi://Gio';
import GObject from 'gi://GObject';


export const File = GObject.registerClass({
	GTypeName: 'FbrFile',
	Properties: {
		name: GObject.ParamSpec.string('name', 'Name', 'Name of the file', GObject.ParamFlags.READWRITE, ''),
		icon: GObject.ParamSpec.object('icon', 'Icon', 'Icon for the file', GObject.ParamFlags.READWRITE, Gio.Icon),
		type: GObject.ParamSpec.enum('type', 'Type', 'File type', GObject.ParamFlags.READWRITE, Gio.FileType, Gio.FileType.UNKNOWN),
	}
}, class extends GObject.Object {});
