// Type definitions for popper.js 1.10
// Project: https://github.com/FezVrasta/popper.js/
// Definitions by: edcarroll <https://github.com/edcarroll>, ggray <https://github.com/giladgray>, rhysd <https://rhysd.github.io>, joscha <https://github.com/joscha>, seckardt <https://github.com/seckardt>, marcfallows <https://github.com/marcfallows>

// This file only declares the public portions of the API.
// It should not define internal pieces such as utils or modifier details.

declare namespace Popper {
    type Position = 'top' | 'right' | 'bottom' | 'left';

    type Placement = 'auto-start'
        | 'auto'
        | 'auto-end'
        | 'top-start'
        | 'top'
        | 'top-end'
        | 'right-start'
        | 'right'
        | 'right-end'
        | 'bottom-end'
        | 'bottom'
        | 'bottom-start'
        | 'left-end'
        | 'left'
        | 'left-start';

    type Boundary = 'scrollParent' | 'viewport' | 'window';

    type ModifierFn = (data: Data, options: Object) => Data;

    interface BaseModifier {
        order?: number;
        enabled?: boolean;
        fn?: ModifierFn;
    }

    interface Modifiers {
        shift?: BaseModifier;
        offset?: BaseModifier & {
            offset?: number | string,
        };
        preventOverflow?: BaseModifier & {
            priority?: Position[],
            padding?: number,
            boundariesElement?: Boundary | Element,
            escapeWithReference?: boolean
        };
        keepTogether?: BaseModifier;
        arrow?: BaseModifier & {
            element?: string | Element,
        };
        flip?: BaseModifier & {
            behavior?: 'flip' | 'clockwise' | 'counterclockwise' | Position[],
            padding?: number,
            boundariesElement?: Boundary | Element,
        };
        inner?: BaseModifier;
        hide?: BaseModifier;
        applyStyle?: BaseModifier & {
            onLoad?: Function,
            gpuAcceleration?: boolean,
        };
        computeStyle?: BaseModifier & {
            gpuAcceleration?: boolean;
            x?: 'bottom' | 'top',
            y?: 'left' | 'right'
        };

        [name: string]: (BaseModifier & Record<string, any>) | undefined;
    }

    interface Offset {
        top: number;
        left: number;
        width: number;
        height: number;
    }

    interface Data {
        instance: Popper;
        placement: Placement;
        originalPlacement: Placement;
        flipped: boolean;
        hide: boolean;
        arrowElement: Element;
        styles: CSSStyleDeclaration;
        boundaries: Object;
        offsets: {
            popper: Offset,
            reference: Offset,
            arrow: {
                top: number,
                left: number,
            },
        };
    }

    interface Options {
        placement?: Placement;
        positionFixed: boolean;
        eventsEnabled?: boolean;
        modifiers?: Modifiers;
        removeOnDestroy?: boolean;

        onCreate?(data: Data): void;

        onUpdate?(data: Data): void;
    }

    interface ReferenceObject {
        clientHeight: number;
        clientWidth: number;

        getBoundingClientRect(): ClientRect;
    }

    class Popper {
        static modifiers: (BaseModifier & { name: string })[];
        static placements: Placement[];
        static Defaults: Options;

        options: Options;

        constructor(reference: Element | ReferenceObject, popper: Element, options?: Options);

        destroy(): void;

        update(): void;

        scheduleUpdate(): void;

        enableEventListeners(): void;

        disableEventListeners(): void;
    }
}