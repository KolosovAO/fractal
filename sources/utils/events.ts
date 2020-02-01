interface Event {
	callback: any;
	context: any;
	once?: boolean;
}
interface Events {
	[key: string]: Event[];
}


export class EventSystem<E extends string> {
	public events: Events;
	public context: any;

	constructor(context?: any) {
		this.events = {};
		this.context = context || this;
	}
	public on(name: E, callback: any, context?: any, once?: boolean) {
		this.events[name] = this.events[name] || [];
		this.events[name].push({
			callback,
			context: context || this.context,
			once
		});
	}
	public detach(name: E, context?: any) {
		if (!this.events[name]) {
			return;
		}
		if (context) {
			this.events[name] = this.events[name].filter(ev => ev.context !== context);
		} else {
			this.events[name] = [];
		}
	}
	public fire(name: E, args?: any[]): boolean {
		if (typeof args === "undefined") {
			args = [];
		}

		if (this.events[name]) {
			const toDelete: Array<{ name: E; context: any }> = [];
			const res = this.events[name].map(
				e => {
					if (e.once) {
						toDelete.push({ name, context: e.context });
					}
					return e.callback.apply(e.context, args);
				}
			);
			toDelete.forEach(({ name, context }) => this.detach(name, context));
			return res.indexOf(false) < 0;
		}
		return true;
	}
}