export default function patch(listeners) {
	const original = EventTarget.prototype.addEventListener
	EventTarget.prototype.addEventListener = function addEventListener(...args) {
		listeners.push({
			node: this,
			type: args[0],
		})
		return original.apply(this, args)
	}
}
