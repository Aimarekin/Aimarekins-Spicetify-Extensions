// Type definitions for tippy.js v2.2.3
// Project: https://atomiks.github.io/tippyjs
// Definitions by: renehamburger <https://github.com/renehamburger>

///<reference path="./popper.d.ts" />

declare namespace Tippy {

    type Placement = 'top' | 'bottom' | 'left' | 'right';

    type Trigger = 'mouseenter' | 'focus' | 'click';

    /** @see https://atomiks.github.io/tippyjs/#all-options */
    interface Options {
        /**
         * Specifies which direction to place the tooltip in relation to the reference
         * element. Add the suffix `-start` or `-end` to shift the placement, e.g. `'top-end'`.
         * Default: 'top'
         */
        placement: Placement;
        /**
         * If `false`, the tooltip won't flip when scrolling. This was unconfigurable and
         * always `true` before v2.2.
         * Default: true
         */
        livePlacement: boolean;
        /**
         * Specifies which type of events will trigger a tooltip to show. Separate each
         * by a space. `mouseenter` is for hovering and touch on mobile, and `focus` is for
         * keyboard navigation. Use `manual` if you want to show/hide the tooltip manually
         * (see https://atomiks.github.io/tippyjs/#methods). You can also use any other event listener,
         * but it won't have the opposite "hide" event.
         * Default: 'mouseenter focus'
         */
        trigger: Trigger | 'manual' | string;
        /**
         * Whenever the `title` attribute on the reference element changes, the tooltip will
         * automatically be updated.
         * Default: false
         */
        dynamicTitle: boolean;
        /**
         * Makes a tooltip interactive, i.e. will not close when the user hovers over or
         * clicks on the tooltip. This lets you create a popover (similar to Bootstrap)
         * when used in conjunction with a `click` trigger.
         * Default: false
         */
        interactive: boolean;
        /**
         * Specifies the size in pixels of the invisible border around an interactive tooltip that will
         * prevent it from closing. Only applies to `mouseenter` triggered tooltips.
         * Default: 2
         */
        interactiveBorder: number;
        /**
         * Specifies the type of transition animation a tooltip has.
         * Default: 'shift-away'
         */
        animation: 'shift-away' | 'shift-toward' | 'perspective' | 'fade' | 'scale';
        /**
         * Adds a material design-esque filling animation. This is disabled if you have `arrow`
         * set to `true`.
         * Default: true
         */
        animateFill: boolean;
        /**
         * Adds an arrow pointing to the reference element. Setting this to `true` disables `animateFill`.
         * Default: false
         */
        arrow: boolean;
        /**
         * Specifies the type of arrow to use. Sharp is a CSS triangle, whereas Round is a
         * custom SVG shape.
         * Default: 'sharp'
         */
        arrowType: 'sharp' | 'round';
        /**
         * Allows you to transform the arrow with a css transform, such as the proportion using scale.
         * Because of flipping, the syntax becomes dynamic. You must use the syntax that gives
         * the desired results for the `top` placement, even if you use a different placement.
         * Only `translate` and `scale` are supported for dynamic syntax.
         *  'scaleX(1.5)' = wider arrow
         *  'scaleX(0.5)' = narrower arrow
         *  'scale(0.5)' = smaller arrow
         *  'scale(1.5)' = larger arrow
         *  'translateY(-5px)' = arrow closer to tooltip
         *  'translateY(5px)' = arrow farther from tooltip
         * Default: ''
         */
        arrowTransform: string;
        /**
         * A CSS selector string used for event delegation. When specified, it will make the
         * element a delegate. The selector should match the child elements that should receive
         * a tooltip.
         * Default: null
         */
        target: string | null;
        /**
         * Specifies how long it takes (in milliseconds) after a show or hide event is fired for a tooltip to
         * begin showing or hiding. Use an array to specify a different show and hide delay,
         * such as `[300, 100]`.
         * Default: 0
         */
        delay: number | [number, number];
        /**
         * Specifies whether the tooltip should flip (the reversing of placement based on the
         * amount of room in the viewport to display a tooltip).
         * Default: true
         */
        flip: boolean;
        /**
         * Specifies the flipping behavior of a tooltip. Based on the amount of room in the
         * viewport, the tooltip will choose which placement to use. For example, 'clockwise'
         * with a placement of 'right' will flip to the bottom when there is not enough room.
         * Default: 'flip'
         */
        flipBehavior: 'flip' | 'clockwise' | 'counterclockwise' | Placement[];
        /**
         * Specifies the maximum width of a tooltip. Ensure you add units, such as px, rem, etc.
         * Default: ''
         */
        maxWidth: string;
        /**
         * Specifies how long (in milliseconds) the transition animation takes to complete. A single number will
         * use the same duration for the show and hide events. Use an array to specify a different
         * show and hide duration, such as `[300, 100]`.
         * Default: [350, 300]
         */
        duration: number | [number, number];
        /**
         * Allows you to add HTML to a tooltip. A string can be used to specify a unique
         * css selector of the template element in the DOM.
         * @see https://atomiks.github.io/tippyjs/#creating-html-templates.
         * Default: false
         */
        html: false | string | Element;
        /**
         * Specifies how large the tooltip is.
         * Default: 'regular'
         */
        size: 'small' | 'regular' | 'large';
        /**
         * Specifies how far away (in px) the tooltip is from its reference element. This contrasts
         * the `offset` option in that it only applies to a single axis and allows tooltips to
         * still be interactive when their trigger is `mouseenter`.
         * Default: 10
         */
        distance: number;
        /**
         * You can create your own easily.
         * @see https://atomiks.github.io/tippyjs/#creating-themes
         * Default: 'dark'
         */
        theme: 'dark';
        /**
         * Offsets a tooltip on a certain axis. Use a string such as '25, 10' to offset it on
         * both the x and y axis. Both in px.
         * Default: 0
         */
        offset: [number, number] | number | string;
        /**
         * Specifies whether to hide a tooltip upon clicking its reference element after
         * hovering over and when clicking elsewhere on the document. For click-triggered
         * tooltips when using `false`, toggle functionality remains unless you use 'persistent'.
         * Default: true
         */
        hideOnClick: true | false | 'persistent';
        /**
         * Specifies whether to allow multiple tooltips open on the page (click trigger only).
         * Default: false
         */
        multiple: boolean;
        /**
         * Specifies whether to follow the user's mouse cursor (mouse devices only).
         * Default: false
         */
        followCursor: boolean;
        /**
         * Modifies the `transition-timing-function` with a cubic bezier to create a "slingshot"
         * intertial effect.
         * Default: false
         */
        inertia: boolean;
        /**
         * Specifies the transition duration (in milliseconds) between flips and when updating a tooltip's
         * position on the document.
         * Default: 350
         */
        updateDuration: number;
        /**
         * Specifies whether the tooltip should stick to its reference element when it's
         * showing (for example, if the element is animated/moves).
         * Default: false
         */
        sticky: boolean;
        /**
         * Specifies which element the tooltip popper is appended to. Use a function which
         * returns an Element for more advanced use cases.
         * Default:  document.body
         */
        appendTo: Element | (() => void);
        /**
         * Specifies the z-index of the tooltip popper.
         * Default: 9999
         */
        zIndex: number;
        /**
         * Changes the trigger behavior on touch devices. It will change it from a tap to
         * show and tap off to hide, to a tap and hold to show, and a release to hide.
         * Default: false
         */
        touchHold: boolean;
        /**
         * Disables `data-tippy-*` attribute options to make initial instantiation time faster.
         * Default: false
         */
        performance: boolean;
        /**
         * Callback function triggered when a tooltip begins to show.
         */
        onShow: (this: HTMLElement, instance: Instance) => void;
        /**
         * Callback function triggered when a tooltip has fully transitioned in.
         */
        onShown: (this: HTMLElement, instance: Instance) => void;
        /**
         * Callback function triggered when a tooltip begins to hide.
         */
        onHide: (this: HTMLElement, instance: Instance) => void;
        /**
         * Callback function triggered when a tooltip has fully transitioned out.
         */
        onHidden: (this: HTMLElement, instance: Instance) => void;
        /**
         * Delays showing the tooltip until you manually invoke `show()`.
         */
        wait: (this: HTMLElement, show: () => void, triggeringEvent: Event) => void;
        /**
         * By default, the popper instance for a tooltip is not created until it is shown
         * for the first time in order to optimize performance. In some cases this may cause
         * issues, so you can specify it to be created when you init with `tippy()`.
         * Safari seems to stutter slightly when the tooltip is shown for the first time.
         * Certain CSS effects may also cause the transition to stutter on the first show.
         * For these certain cases, you may want to set this option to `true`.
         * Default: false
         */
        createPopperInstanceOnInit: boolean;

        /**
         * Allows more control over tooltip positioning and behavior.
         * @see https://popper.js.org/popper-documentation.html#new_Popper_new
         * Default: {}
         */
        popperOptions: Popper.Options;
    }

    type Selector = string | Element | NodeList | Popper.ReferenceObject

    interface Object {
        /** The target references to be given tooltips. */
        selector: Selector | Selector[];
        /** Array of all Tippy instances that were created. */
        tooltips: Instance[];
        /** Default + instance options merged. */
        options: Options;
        /** Method to destroy all tooltips that were created (all Tippy instances inside `tooltips`) */
        destroyAll: () => void;
    }

    interface Instance {
        /** The ID of the instance. */
        id: number;
        /** The content of the tooltip (if not HTML). */
        title: string;
        /** The popper element which contains the tooltip element and content. */
        popper: Element;
        /** The Popper instance. Not created until the tooltip is shown for the
         * first time, unless specified otherwise. */
        popperInstance: Popper.Popper | null;
        /** The element you gave the tooltip to. */
        reference: Element;
        /** Array of objects containing the event type and handler which were bound to the reference element based on the `trigger` option. */
        listeners: { event: Trigger | string, handler: () => void }[];
        /** Default + instance + individual options merged together. */
        options: Options;
        /**
         * Object containing boolean values about the state of the tooltip.
         *  `destroyed` - has the instance been destroyed?
         *  `enabled` - is the tooltip enabled?
         *  `visible` - is the tooltip currently visible and not transitioning out?
        */
        state: { destroyed: boolean, enabled: boolean, visible: boolean };

        destroy: () => void;
    }

    type tippy =
        | ((selector: Tippy.Selector, options?: Partial<Tippy.Options>) => Tippy.Object)
        | ((element: Element, options?: Partial<Tippy.Options>) => Tippy.Instance);
}