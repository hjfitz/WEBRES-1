const allowDebug = true // todo: move this to env

export function h(type, content = '', classList = '') {
	const elem = document.createElement(type)
	elem.textContent = content
	elem.classList = classList
	return elem
}
// take ' 14px' and turn it in to 14
const normaliseProp = prop => +prop.replace(/[a-z]*/gi, '')

export const q = (...args) => [...document.querySelectorAll(...args)]

export function throttle(func, limit) {
	let inThrottle
	return function throttledCallback(...args) {
		const context = this
		if (!inThrottle) {
			func.apply(context, args)
			inThrottle = true
			setTimeout(() => { inThrottle = false }, limit)
		}
	}
}

export function createFloaterPositioning(orig, float, positionRight) {
	const rect = orig.getBoundingClientRect()
	const style = getComputedStyle(orig)
	const padTop = normaliseProp(style.getPropertyValue('padding-top'))
	const padLeft = normaliseProp(style.getPropertyValue('padding-left'))
	const padRight = normaliseProp(style.getPropertyValue('padding-right'))
	const left = ((rect.left - 5) - padTop) + window.scrollX
	const top = ((rect.top - 10) - padLeft) + window.scrollY
	const right = ((rect.right - 5) - padRight) + window.scrollX
	if (positionRight) return float.setAttribute('style', `left:${right}px; top:${top}px; `)
	return float.setAttribute('style', `left:${left}px; top:${top}px; `)
}

export function debug(...args) {
	if (allowDebug) console.log('[webres]', ...args)
}
