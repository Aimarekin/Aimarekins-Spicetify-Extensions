(async function() {
        while (!Spicetify.React || !Spicetify.ReactDOM) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        var skipDafterDtimestamp = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // external-global-plugin:react
  var require_react = __commonJS({
    "external-global-plugin:react"(exports, module) {
      module.exports = Spicetify.React;
    }
  });

  // external-global-plugin:react-dom
  var require_react_dom = __commonJS({
    "external-global-plugin:react-dom"(exports, module) {
      module.exports = Spicetify.ReactDOM;
    }
  });

  // src/jsx.tsx
  var namespaceMap = {
    svg: "http://www.w3.org/2000/svg",
    path: "http://www.w3.org/2000/svg"
  };
  function createElement(tag, props, ...children) {
    if (typeof tag === "function") {
      return tag(props, ...children);
    }
    const namespace = props.xmlns || namespaceMap[tag] || "http://www.w3.org/1999/xhtml";
    const element = document.createElementNS(namespace, tag);
    Object.entries(props || {}).forEach(([name, value]) => {
      if (name === "className") {
        name = "class";
      }
      if (name.startsWith("on") && name.toLowerCase() in window) {
        element.addEventListener(name.toLowerCase().substring(2), value);
      } else {
        element.setAttribute(name, String(value));
      }
    });
    children.forEach((child) => {
      appendChild(element, child);
    });
    return element;
  }
  function appendChild(parent, child) {
    if (Array.isArray(child)) {
      child.forEach((nestedChild) => appendChild(parent, nestedChild));
    } else {
      parent.append(child);
    }
  }

  // src/loc/en.json
  var en_default = {
    skip_after_timestamp: "Skip after Timestamp",
    percentage_mode_setting: "Percentage mode - Skip tracks based on percentage completed instead of a timestamp",
    will_skip_after_time: "Tracks will now be skipped after {0}",
    will_skip_after_percentage: "Tracks will now be skipped after {0} completed",
    future_skip_after_time: "Future tracks will now be skipped after {0}",
    future_skip_after_percentage: "Future tracks will now be skipped after {0} completed",
    this_skip_after_time: "This track will now be skipped after {0}",
    this_skip_after_percentage: "This track will now be skipped after {0} completed",
    disabled_auto_skip: "Disabled auto skip",
    disabled_once: "Will not skip this track once"
  };

  // src/loc/es.json
  var es_default = {
    skip_after_timestamp: "Saltar Despu\xE9s de",
    percentage_mode_setting: "Modo de porcentaje - Salta la canci\xF3n despu\xE9s de que se haya reproducido un porcentaje en vez de una duraci\xF3n",
    will_skip_after_time: "Se reproducir\xE1 la siguiente canci\xF3n tras {0}",
    will_skip_after_percentage: "Se reproducir\xE1 la siguiente canci\xF3n tras reproducir el {0}",
    future_skip_after_time: "Las siguientes canciones se reproducir\xE1n tras {0}",
    future_skip_after_percentage: "Las siguientes canciones se reproducir\xE1n tras reproducir el {0}",
    this_skip_after_time: "Se reproducir\xE1 la siguiente canci\xF3n tras {0}",
    this_skip_after_percentage: "Se reproducir\xE1 la siguiente canci\xF3n tras reproducir el {0}",
    disabled_auto_skip: "Siguiente reproducci\xF3n autom\xE1tica desactivada",
    disabled_once: "Esta canci\xF3n no se saltar\xE1 autom\xE1ticamente"
  };

  // src/localizer.tsx
  var fallbackLang = "en";
  var stringStorage = {
    en: en_default,
    es: es_default
  };
  function Translate(key, locale) {
    locale = locale || Spicetify.Locale.getLocale();
    if (stringStorage[locale]) {
      return stringStorage[locale][key] || key;
    } else {
      return Translate(key, fallbackLang);
    }
  }

  // src/util.tsx
  function waitForElm(selector, within = document.body, timeoutAfter = 5e3, shouldReject = false) {
    return new Promise((resolve, reject) => {
      let timeoutId;
      if (timeoutAfter > 0) {
        timeoutId = setTimeout(() => {
          if (shouldReject) {
            return reject("Did not find element after timeout.");
          } else {
            console.warn("waitForElm has waited for", timeoutAfter, " for selector", selector, "within", within, "but it has not yet been found.");
          }
        }, timeoutAfter);
      }
      const el = within.querySelector(selector);
      if (el) {
        return resolve(el);
      }
      const observer = new MutationObserver(() => {
        const el2 = within.querySelector(selector);
        if (el2) {
          observer.disconnect();
          clearTimeout(timeoutId);
          return resolve(el2);
        }
      });
      observer.observe(within, {
        childList: true,
        subtree: true
      });
    });
  }
  function getPercentageClickedOn(e, elm) {
    const mouseClickOffset = e.clientX - elm.getBoundingClientRect().left;
    return Math.min(Math.max(mouseClickOffset / elm.clientWidth, 0), 1);
  }
  function returnAnyAccess(obj, paths) {
    for (const path of paths) {
      if (obj[path] !== void 0) {
        return obj[path];
      }
    }
    return void 0;
  }

  // src/string_representations.tsx
  var formatTime = (ms) => `${Math.floor(ms / 6e4)}:${Math.floor(ms % 6e4 / 1e3).toString().padStart(2, "0")}`;
  var formatPercentage = (percentage, forCSS = false) => `${forCSS ? percentage * 100 : Math.floor(percentage * 100)}%`;
  var cleanNumber = (str) => str.trim().replace(",", ".");
  var parseDirtyFloat = (str) => typeof str === "string" ? str.match(/[^\d.]/) ? NaN : parseFloat(cleanNumber(str)) : NaN;
  function parseTime(representation) {
    if (!representation || !representation.match(/\d/))
      return null;
    const times = representation.split(":");
    if (times.length > 3)
      return null;
    const hours = times.length > 2 ? parseDirtyFloat(times[times.length - 3]) : 0;
    const minutes = times.length > 1 ? parseDirtyFloat(times[times.length - 2]) : 0;
    const seconds = parseDirtyFloat(times[times.length - 1]);
    const res = (hours * 3600 + minutes * 60 + seconds) * 1e3;
    console.log("TIME", representation, res);
    return isNaN(res) ? null : res;
  }
  function parsePercentage(representation) {
    if (!representation || !representation.match(/\d/))
      return null;
    const res = parseDirtyFloat(representation.replace("%", "")) / 100;
    console.log("PERCENT", representation, res);
    return isNaN(res) ? null : res;
  }

  // node_modules/.pnpm/spcr-settings@1.3.0/node_modules/spcr-settings/settingsSection.tsx
  var import_react = __toESM(require_react());
  var import_react_dom = __toESM(require_react_dom());
  var SettingsSection = class {
    constructor(name, settingsId, initialSettingsFields = {}) {
      this.name = name;
      this.settingsId = settingsId;
      this.initialSettingsFields = initialSettingsFields;
      this.settingsFields = this.initialSettingsFields;
      this.setRerender = null;
      this.pushSettings = async () => {
        Object.entries(this.settingsFields).forEach(([nameId, field]) => {
          if (field.type !== "button" && this.getFieldValue(nameId) === void 0) {
            this.setFieldValue(nameId, field.defaultValue);
          }
        });
        while (!Spicetify?.Platform?.History?.listen) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (this.stopHistoryListener)
          this.stopHistoryListener();
        this.stopHistoryListener = Spicetify.Platform.History.listen((e) => {
          if (e.pathname === "/preferences") {
            this.render();
          }
        });
        if (Spicetify.Platform.History.location.pathname === "/preferences") {
          await this.render();
        }
      };
      this.rerender = () => {
        if (this.setRerender) {
          this.setRerender(Math.random());
        }
      };
      this.render = async () => {
        while (!document.getElementById("desktop.settings.selectLanguage")) {
          if (Spicetify.Platform.History.location.pathname !== "/preferences")
            return;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const allSettingsContainer = document.querySelector(
          ".main-view-container__scroll-node-child main div"
        );
        if (!allSettingsContainer)
          return console.error("[spcr-settings] settings container not found");
        let pluginSettingsContainer = Array.from(
          allSettingsContainer.children
        ).find((child) => child.id === this.settingsId);
        if (!pluginSettingsContainer) {
          pluginSettingsContainer = document.createElement("div");
          pluginSettingsContainer.id = this.settingsId;
          allSettingsContainer.appendChild(pluginSettingsContainer);
        } else {
          console.log(pluginSettingsContainer);
        }
        import_react_dom.default.render(/* @__PURE__ */ import_react.default.createElement(this.FieldsContainer, null), pluginSettingsContainer);
      };
      this.addButton = (nameId, description, value, onClick, events) => {
        this.settingsFields[nameId] = {
          type: "button",
          description,
          value,
          events: {
            onClick,
            ...events
          }
        };
      };
      this.addInput = (nameId, description, defaultValue, onChange, inputType, events) => {
        this.settingsFields[nameId] = {
          type: "input",
          description,
          defaultValue,
          inputType,
          events: {
            onChange,
            ...events
          }
        };
      };
      this.addHidden = (nameId, defaultValue) => {
        this.settingsFields[nameId] = {
          type: "hidden",
          defaultValue
        };
      };
      this.addToggle = (nameId, description, defaultValue, onChange, events) => {
        this.settingsFields[nameId] = {
          type: "toggle",
          description,
          defaultValue,
          events: {
            onChange,
            ...events
          }
        };
      };
      this.addDropDown = (nameId, description, options, defaultIndex, onSelect, events) => {
        this.settingsFields[nameId] = {
          type: "dropdown",
          description,
          defaultValue: options[defaultIndex],
          options,
          events: {
            onSelect,
            ...events
          }
        };
      };
      this.getFieldValue = (nameId) => {
        return JSON.parse(
          Spicetify.LocalStorage.get(`${this.settingsId}.${nameId}`) || "{}"
        )?.value;
      };
      this.setFieldValue = (nameId, newValue) => {
        Spicetify.LocalStorage.set(
          `${this.settingsId}.${nameId}`,
          JSON.stringify({ value: newValue })
        );
      };
      this.FieldsContainer = () => {
        const [rerender, setRerender] = (0, import_react.useState)(0);
        this.setRerender = setRerender;
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-section",
          key: rerender
        }, /* @__PURE__ */ import_react.default.createElement("h2", {
          className: "TypeElement-cello-textBase-type"
        }, this.name), Object.entries(this.settingsFields).map(([nameId, field]) => {
          return /* @__PURE__ */ import_react.default.createElement(this.Field, {
            nameId,
            field
          });
        }));
      };
      this.Field = (props) => {
        const id = `${this.settingsId}.${props.nameId}`;
        let defaultStateValue;
        if (props.field.type === "button") {
          defaultStateValue = props.field.value;
        } else {
          defaultStateValue = this.getFieldValue(props.nameId);
        }
        if (props.field.type === "hidden") {
          return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null);
        }
        const [value, setValueState] = (0, import_react.useState)(defaultStateValue);
        const setValue = (newValue) => {
          if (newValue !== void 0) {
            setValueState(newValue);
            this.setFieldValue(props.nameId, newValue);
          }
        };
        return /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-row"
        }, /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-firstColumn"
        }, /* @__PURE__ */ import_react.default.createElement("label", {
          className: "TypeElement-viola-textSubdued-type",
          htmlFor: id
        }, props.field.description || "")), /* @__PURE__ */ import_react.default.createElement("div", {
          className: "x-settings-secondColumn"
        }, props.field.type === "input" ? /* @__PURE__ */ import_react.default.createElement("input", {
          className: "x-settings-input",
          id,
          dir: "ltr",
          value,
          type: props.field.inputType || "text",
          ...props.field.events,
          onChange: (e) => {
            setValue(e.currentTarget.value);
            const onChange = props.field.events?.onChange;
            if (onChange)
              onChange(e);
          }
        }) : props.field.type === "button" ? /* @__PURE__ */ import_react.default.createElement("span", null, /* @__PURE__ */ import_react.default.createElement("button", {
          id,
          className: "Button-sm-buttonSecondary-isUsingKeyboard-useBrowserDefaultFocusStyle x-settings-button",
          ...props.field.events,
          onClick: (e) => {
            setValue();
            const onClick = props.field.events?.onClick;
            if (onClick)
              onClick(e);
          },
          type: "button"
        }, value)) : props.field.type === "toggle" ? /* @__PURE__ */ import_react.default.createElement("label", {
          className: "x-settings-secondColumn x-toggle-wrapper"
        }, /* @__PURE__ */ import_react.default.createElement("input", {
          id,
          className: "x-toggle-input",
          type: "checkbox",
          checked: value,
          ...props.field.events,
          onClick: (e) => {
            setValue(e.currentTarget.checked);
            const onClick = props.field.events?.onClick;
            if (onClick)
              onClick(e);
          }
        }), /* @__PURE__ */ import_react.default.createElement("span", {
          className: "x-toggle-indicatorWrapper"
        }, /* @__PURE__ */ import_react.default.createElement("span", {
          className: "x-toggle-indicator"
        }))) : props.field.type === "dropdown" ? /* @__PURE__ */ import_react.default.createElement("select", {
          className: "main-dropDown-dropDown",
          id,
          ...props.field.events,
          onChange: (e) => {
            setValue(
              props.field.options[e.currentTarget.selectedIndex]
            );
            const onChange = props.field.events?.onChange;
            if (onChange)
              onChange(e);
          }
        }, props.field.options.map((option, i) => {
          return /* @__PURE__ */ import_react.default.createElement("option", {
            selected: option === value,
            value: i + 1
          }, option);
        })) : /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null)));
      };
    }
  };

  // src/format_unicorn.tsx
  String.prototype.formatUnicorn = String.prototype.formatUnicorn || function() {
    let str = this.toString();
    if (arguments.length) {
      const t = typeof arguments[0];
      let key;
      const args = "string" === t || "number" === t ? Array.prototype.slice.call(arguments) : arguments[0];
      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

  // src/app.tsx
  var DRAG_THRESHOLD = 8;
  var MINIMUM_SKIP_DURATION = 1 * 1e3;
  var distancePoints = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  var returnAnyAccessPlaybackId = () => returnAnyAccess(Spicetify.Player.data, ["playbackId", "playback_id"]);
  async function main() {
    while (!(Spicetify == null ? void 0 : Spicetify.Player) || !(Spicetify == null ? void 0 : Spicetify.Locale) || !(Spicetify == null ? void 0 : Spicetify.showNotification) || !(Spicetify == null ? void 0 : Spicetify.CosmosAsync)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    try {
      Spicetify.CosmosAsync.sub("sp://player/v2/main", (state) => {
        if (state.playback_id !== returnAnyAccessPlaybackId())
          return;
        const progress = state.position_as_of_timestamp;
        if (progress === void 0 || progress < MINIMUM_SKIP_DURATION)
          return;
        if (progress >= skipAfterDuration()) {
          setSkipThisPlayback(false);
        }
      });
    } catch (e) {
      console.error(e);
    }
    const settings = new SettingsSection(Translate("skip_after_timestamp"), "skip-after-timestamp", {
      "percentage-mode": {
        type: "toggle",
        description: Translate("percentage_mode_setting"),
        defaultValue: false,
        events: {
          "onChange": () => {
            setPercentageModeTranslated(settings.getFieldValue("percentage-mode"), true);
          }
        }
      }
    });
    await settings.pushSettings();
    const playbackBar = await waitForElm(".playback-progressbar");
    const marker = /* @__PURE__ */ createElement("div", {
      className: "skip-after-timestamp-marker"
    }, /* @__PURE__ */ createElement("div", {
      className: "skip-after-timestamp-container"
    }, /* @__PURE__ */ createElement("button", {
      className: "skip-after-timestamp-button",
      type: "button"
    })));
    document.body.appendChild(marker);
    const observedProperties = ["left", "top", "right", "bottom"];
    const cachedValues = Array(observedProperties.length).fill(null);
    function updatePlaybackVariables() {
      const playbackBarRect = playbackBar.getBoundingClientRect();
      for (const [i, prop] of observedProperties.entries()) {
        const value = playbackBarRect[prop];
        if (value === cachedValues[i])
          continue;
        marker.style.setProperty("--skip-after-timestamp-playback-" + prop, value + "px");
        cachedValues[i] = value;
      }
      requestAnimationFrame(updatePlaybackVariables);
    }
    updatePlaybackVariables();
    marker.addEventListener("mousedown", (e) => {
      const initialX = e.clientX;
      const initialY = e.clientY;
      function markerClick(e2) {
        window.removeEventListener("mousemove", mouseMove);
        if (!marker.contains(e2.target))
          return;
        e2.preventDefault();
        if (e2.button === 0) {
          disableSkipAfter(true);
          Spicetify.showNotification(Translate("disabled_auto_skip"));
          marker.classList.remove("skip-after-timestamp-active");
        } else if (e2.button === 2) {
          setSkipThisPlayback(!shouldSkipThisPlayback(), true);
        }
      }
      function mouseMove(e2) {
        if (distancePoints(initialX, initialY, e2.clientX, e2.clientY) > DRAG_THRESHOLD) {
          beginDrag(e2);
          window.removeEventListener("mouseup", markerClick);
          window.removeEventListener("mousemove", mouseMove);
        }
      }
      window.addEventListener("mouseup", markerClick, { once: true });
      window.addEventListener("mousemove", mouseMove);
    });
    const TippyProps = __spreadProps(__spreadValues({}, Spicetify.TippyProps), {
      interactive: true,
      interactiveBorder: 30
    });
    const markerTooltip = Spicetify.Tippy(marker, TippyProps);
    const markerInput = /* @__PURE__ */ createElement("input", {
      className: "skip-after-timestamp-input",
      type: "text"
    });
    markerTooltip.popper.querySelector(".main-contextMenu-tippy").appendChild(markerInput);
    markerInput.addEventListener("focusout", (e) => {
      const value = markerInput.value;
      if (value === "")
        return;
      markerInput.value = formattedSkipAfter();
      let parsed = isPercentageMode() ? parsePercentage(value) : parseTime(value);
      let parseAsPercentage = isPercentageMode();
      if (parsed === null) {
        parseAsPercentage = !parseAsPercentage;
        parsed = isPercentageMode() ? parseTime(value) : parsePercentage(value);
      }
      if (parsed === null || (parseAsPercentage ? formatPercentage(parsed) : formatTime(parsed)) === formattedSkipAfter())
        return;
      (parseAsPercentage ? setSkipAfterPercentage : setSkipAfterDuration)(parsed, true);
    });
    markerInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        markerInput.blur();
      }
    });
    const formattedSkipAfter = () => isPercentageMode() ? formatPercentage(skipAfterPercentage()) : formatTime(skipAfterDuration());
    const timeToPercentage = (duration, totalTime = Spicetify.Player.getDuration()) => duration / totalTime;
    const percentageToTime = (percentage, totalTime = Spicetify.Player.getDuration()) => percentage * totalTime;
    let _skipAfterEnabled;
    let _skipThisPlayback;
    let _isPercentageMode;
    let _skipAfterDuration;
    let _skipAfterPercentage;
    const isSkipAfterEnabled = () => _skipAfterEnabled === true;
    const shouldSkipThisPlayback = () => _skipThisPlayback === true;
    const isPercentageMode = () => _isPercentageMode === true;
    const skipAfterDuration = () => isPercentageMode() ? percentageToTime(_skipAfterPercentage) : _skipAfterDuration;
    const skipAfterPercentage = () => isPercentageMode() ? _skipAfterPercentage : timeToPercentage(_skipAfterDuration);
    function disableSkipAfter(notify = false) {
      if (!isSkipAfterEnabled())
        return;
      _skipAfterEnabled = false;
      setSkipThisPlayback(true);
      marker.classList.remove("skip-after-timestamp-active");
      if (notify) {
        Spicetify.showNotification(Translate("disabled_auto_skip"));
      }
    }
    function showSkipNotification(justEnabledSkipThis = false) {
      const prefix = justEnabledSkipThis ? "this" : shouldSkipThisPlayback() ? "will" : "future";
      if (isPercentageMode()) {
        Spicetify.showNotification(Translate(prefix + "_skip_after_percentage").formatUnicorn(formatPercentage(skipAfterPercentage())));
      } else {
        Spicetify.showNotification(Translate(prefix + "_skip_after_time").formatUnicorn(formatTime(skipAfterDuration())));
      }
    }
    function setSkipAfterDuration(duration, notify = false) {
      if (!isPercentageMode() && duration === skipAfterDuration())
        return;
      markerTooltip.hide();
      marker.classList.add("skip-after-timestamp-active");
      marker.classList.add("skip-after-timestamp-duration-mode");
      marker.classList.remove("skip-after-timestamp-percentage-mode");
      _skipAfterEnabled = true;
      setPercentageMode(false);
      _skipAfterDuration = duration;
      updateMarkerProgress();
      if (hasPassedSkipTime())
        setSkipThisPlayback(false);
      const shownTime = formatTime(duration);
      if (notify) {
        showSkipNotification();
      }
      markerInput.value = formatTime(duration);
    }
    function setSkipAfterPercentage(percentage, notify = false) {
      if (isPercentageMode() && percentage === skipAfterPercentage())
        return;
      markerTooltip.hide();
      marker.classList.add("skip-after-timestamp-active");
      marker.classList.remove("skip-after-timestamp-duration-mode");
      marker.classList.add("skip-after-timestamp-percentage-mode");
      _skipAfterEnabled = true;
      setPercentageMode(true);
      _skipAfterPercentage = percentage;
      updateMarkerProgress();
      if (hasPassedSkipTime())
        setSkipThisPlayback(false);
      const shownPercentage = formatPercentage(percentage);
      if (notify) {
        showSkipNotification();
      }
      markerInput.value = formatPercentage(percentage);
    }
    const setSkipAfter = (percentage, notify = false) => isPercentageMode() ? setSkipAfterPercentage(percentage, notify) : setSkipAfterDuration(percentageToTime(percentage), notify);
    function setSkipThisPlayback(skip, notify = false) {
      if (skip === _skipThisPlayback)
        return;
      _skipThisPlayback = skip;
      marker.classList[skip ? "remove" : "add"]("skip-after-timestamp-dont-skip-this-playback");
      if (notify) {
        if (skip) {
          showSkipNotification(true);
        } else {
          Spicetify.showNotification(Translate("disabled_once"));
        }
      }
    }
    function setPercentageMode(percentageMode, notify = false) {
      if (percentageMode === isPercentageMode())
        return;
      _isPercentageMode = percentageMode;
      settings.setFieldValue("percentage-mode", percentageMode);
      marker.classList[percentageMode ? "add" : "remove"]("skip-after-timestamp-percentage-mode");
      if (notify && isSkipAfterEnabled())
        showSkipNotification();
    }
    function setPercentageModeTranslated(percentageMode, notify = false) {
      if (percentageMode === isPercentageMode())
        return;
      if (isSkipAfterEnabled()) {
        if (percentageMode) {
          setSkipAfterPercentage(skipAfterPercentage(), notify);
        } else {
          setSkipAfterDuration(skipAfterDuration(), notify);
        }
      } else {
        setPercentageMode(percentageMode, notify);
      }
    }
    disableSkipAfter();
    setSkipThisPlayback(true);
    setPercentageMode(settings.getFieldValue("percentage-mode"));
    function updateMarkerProgress(percentage = skipAfterPercentage()) {
      marker.style.setProperty("--skip-after-timestamp-set", percentage.toString());
      marker.classList[percentage > 1 ? "add" : "remove"]("skip-after-timestamp-overflow");
    }
    const hasPassedSkipTime = () => isPercentageMode() ? Spicetify.Player.getProgressPercent() >= _skipAfterPercentage : Spicetify.Player.getProgress() >= _skipAfterDuration;
    const shouldSkip = () => isSkipAfterEnabled() && shouldSkipThisPlayback() && hasPassedSkipTime() && Spicetify.Player.getProgress() > MINIMUM_SKIP_DURATION && !isDragging;
    let isDragging = false;
    function beginDrag(e) {
      if (!Spicetify.Player.origin.getState().hasContext)
        return;
      if (isDragging)
        return;
      isDragging = true;
      markerTooltip.disable();
      const updateProgress = (e2) => marker.style.setProperty("--skip-after-timestamp-drag", getPercentageClickedOn(e2, playbackBar).toString());
      marker.classList.add("skip-after-timestamp-dragging");
      updateProgress(e);
      window.addEventListener("mousemove", updateProgress);
      function mouseUpCallback(upE) {
        if (upE.button !== e.button)
          return;
        window.removeEventListener("mousemove", updateProgress);
        window.removeEventListener("mouseup", mouseUpCallback);
        isDragging = false;
        markerTooltip.enable();
        marker.classList.remove("skip-after-timestamp-dragging");
        let percentage = getPercentageClickedOn(upE, playbackBar);
        setSkipAfter(percentage, true);
      }
      window.addEventListener("mouseup", mouseUpCallback);
    }
    playbackBar.addEventListener("mousedown", (e) => {
      if (e.button === 2)
        beginDrag(e);
    });
    let lastPlaybackId = void 0;
    let isSkipping = false;
    Spicetify.Player.addEventListener("onprogress", () => {
      if (!Spicetify.Player.origin.getState().hasContext) {
        disableSkipAfter();
        return;
      }
      const currentPlaybackId = returnAnyAccessPlaybackId();
      if (currentPlaybackId !== lastPlaybackId) {
        lastPlaybackId = currentPlaybackId;
        setSkipThisPlayback(true);
        isSkipping = false;
        updateMarkerProgress();
      }
      if (isSkipping)
        return;
      if (shouldSkip()) {
        if (Spicetify.Player.isPlaying()) {
          isSkipping = true;
          Spicetify.Player.next();
        } else {
          setSkipThisPlayback(false);
        }
      }
    });
    console.log("Loaded skip-after-timestamp");
  }
  var app_default = main;

  // C:/Users/Aimar/AppData/Local/Temp/spicetify-creator/index.jsx
  (async () => {
    await app_default();
  })();
})();
(async () => {
    if (!document.getElementById(`skipDafterDtimestamp`)) {
      var el = document.createElement('style');
      el.id = `skipDafterDtimestamp`;
      el.textContent = (String.raw`
  /* C:/Users/Aimar/AppData/Local/Temp/tmp-13812-q3SE1GaMwjn9/18dce0babab0/style.css */
.skip-after-timestamp-marker {
  position: absolute;
  height: 15px;
  width: 15px;
  left: calc(var(--skip-after-timestamp-playback-left) + var(--skip-after-timestamp-progress) * (var(--skip-after-timestamp-playback-right) - var(--skip-after-timestamp-playback-left)));
  top: calc((var(--skip-after-timestamp-playback-top) + var(--skip-after-timestamp-playback-bottom)) / 2);
  --skip-after-timestamp-progress: var(--skip-after-timestamp-set);
  transform: translate(-5px, -50%);
  z-index: 1;
  overflow: visible;
  transition: left 0.25s, transform 0.05s;
}
.skip-after-timestamp-marker.skip-after-timestamp-overflow:not(.skip-after-timestamp-dragging) {
  left: var(--skip-after-timestamp-playback-right);
  top: var(--skip-after-timestamp-playback-top);
  transform: translate(-50%, -150%);
}
.skip-after-timestamp-marker.skip-after-timestamp-overflow:not(.skip-after-timestamp-dragging) .skip-after-timestamp-container {
  background-color: gray;
}
.skip-after-timestamp-marker.skip-after-timestamp-dont-skip-this-playback .skip-after-timestamp-container {
  background-color: gray;
}
.skip-after-timestamp-marker:not(.skip-after-timestamp-active):not(.skip-after-timestamp-dragging) {
  display: none;
}
.skip-after-timestamp-marker.skip-after-timestamp-dragging {
  transition: none;
  --skip-after-timestamp-progress: var(--skip-after-timestamp-drag);
}
.skip-after-timestamp-marker:hover {
  cursor: pointer;
}
.skip-after-timestamp-marker:hover .skip-after-timestamp-button {
  background-color: rgba(0, 0, 0, 0.2);
}
.skip-after-timestamp-marker:active .skip-after-timestamp-button {
  background-color: rgba(0, 0, 0, 0.4);
}
.skip-after-timestamp-marker .skip-after-timestamp-button {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' role='img' aria-hidden='true' viewBox='0 0 16 16' fill='white'><path d='M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z'/></svg>");
}
.skip-after-timestamp-marker.skip-after-timestamp-dont-skip-this-playback .skip-after-timestamp-button,
.skip-after-timestamp-marker.skip-after-timestamp-overflow .skip-after-timestamp-button {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' role='img' aria-hidden='true' viewBox='0 0 16 16' fill='white'><path d='M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z'/></svg>");
}
.skip-after-timestamp-container {
  background-color: #4687d6;
  filter: drop-shadow(0 0 6px var(--spice-shadow));
  transition: background-color 0.25s;
  height: 100%;
  width: 100%;
}
.skip-after-timestamp-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: 0;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.skip-after-timestamp-input {
  width: 55px;
  background-color: transparent;
  border: none;
  text-align: center;
}
.skip-after-timestamp-input:focus {
  border-bottom: 1px solid #fff;
  text-align: left;
}

      `).trim();
      document.head.appendChild(el);
    }
  })()
      })();