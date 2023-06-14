// Functions for handling JSX

export function createElement(tag: (string | ((props:Record<string, string | unknown>, ...children: (HTMLElement | string)[]) => HTMLElement)), props: Record<string, string | unknown>, ...children: (HTMLElement | string)[]): HTMLElement {
	if (typeof tag === "function") {
		return tag(props, ...children)
	}
	const element = document.createElement(tag)
    
	Object.entries(props || {}).forEach(([name, value]) => {
		if (name === "className") { name = "class" }
		if (name.startsWith("on") && name.toLowerCase() in window) {
			element.addEventListener(name.toLowerCase().substring(2), value)
		} else {
			console.log(name, value)
			element.setAttributeNS(null, name, String(value))
		}
	})
    
	children.forEach(child => {
		appendChild(element, child)
	})
    
	return element
}

export function appendChild(parent:HTMLElement, child:(HTMLElement | string)): void {
	if (Array.isArray(child)) {
		child.forEach(nestedChild => appendChild(parent, nestedChild))
	} else {
		parent.appendChild(child instanceof HTMLElement ? child : document.createTextNode(child))
	}
}

export function createFragment(props: unknown, ...children: HTMLElement[]) : HTMLElement[] {
	return children
}