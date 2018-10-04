interface Event {
	callback: any;
	context: any;
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
	on(name: E, callback: any, context?:any) {
		this.events[name] = this.events[name] || [];
		this.events[name].push({
            callback,
            context: context || this.context
        });
	}
	detach(name: E, context?: any) {
		if (!this.events[name]) {
            return;
        }
        if (context) {
            this.events[name] = this.events[name].filter(ev => ev.context !== context);
        } else {
			this.events[name] = [];
        }
	}
	fire(name: E, args?: any[]): boolean {
		if (typeof args === "undefined"){
			args = [];
		}

		if (this.events[name]) {
			const res = this.events[name].map(
				e => e.callback.apply(e.context, args)
			);
			return res.indexOf(false) < 0;
		}
		return true;
	}
}