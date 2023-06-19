// Functions for handling JSX

const namespaceMap = {
	svg: "http://www.w3.org/2000/svg",
	path: "http://www.w3.org/2000/svg",
}

export function createElement(tag: (string | ((props:Record<string, string | unknown>, ...children: (HTMLElement | string)[]) => HTMLElement)), props: Record<string, string | unknown>, ...children: (HTMLElement | string)[]): HTMLElement {
	if (typeof tag === "function") {
		return tag(props, ...children)
	}
	const namespace = props.xmlns || namespaceMap[tag] || "http://www.w3.org/1999/xhtml"
	const element = document.createElementNS(namespace, tag)
	//const element = document.createElement(tag)
    
	Object.entries(props || {}).forEach(([name, value]) => {
		if (name === "className") { name = "class" }
		if (name.startsWith("on") && name.toLowerCase() in window) {
			element.addEventListener(name.toLowerCase().substring(2), value)
		} else {
			//console.log(name, value)
			element.setAttribute(name, String(value))
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
		parent.append(child)
	}
}

export function createFragment(props: unknown, ...children: HTMLElement[]) : HTMLElement[] {
	return children
}