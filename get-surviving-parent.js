function setObservedParent(elOrSelector) {
    let el = (typeof elOrSelector === "string") ? document.querySelector(elOrSelector) : elOrSelector
    if (!el || !el.parentNode) {
        console.warn("No parent found for", el)
        return
    }

    const parents = []

    let currentParent = el.parentNode
    while (currentParent) {
        parents.push(currentParent)
        currentParent = currentParent.parentNode
    }

    return () => {
        for (const parent of parents) {
            if (document.contains(parent)) {
                return parent
            }
        }
    }
}