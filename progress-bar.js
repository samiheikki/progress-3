import {Element as PolymerElement}
    from "../node_modules/@polymer/polymer/polymer-element.js"

// Added "export" to export the MyApp symbol from the module
export class ProressBar extends PolymerElement {

  // Define a string template instead of a `<template>` element.
  static get template() {
    return `
    <style>
      :host {
        display: block;
        border: 1px dashed;
        width: 100%;
      }
      :host([hidden]) {
        display: none !important;
      }
      [part="bar"] {
        height: 5px;
      }
      [part="value"] {
        height: 100%;
        transform-origin: 0 50%;
        background: blue;
        transform: scaleX(var(--vaadin-progress-value));
      }
      :host([indeterminate]) [part="value"] {
        --lumo-progress-indeterminate-progress-bar-background: linear-gradient(to right, #000000 10%, blue);
        --lumo-progress-indeterminate-progress-bar-background-reverse: linear-gradient(to left, #000000 10%, blue);
        width: 100%;
        background-image: var(--lumo-progress-indeterminate-progress-bar-background);
        opacity: 0.75;
        will-change: transform;
        animation: vaadin-progress-slide 1.6s infinite cubic-bezier(.645, .045, .355, 1), vaadin-progress-scale 1.6s infinite cubic-bezier(.645, .045, .355, 1);
      }
      @keyframes vaadin-progress-slide {
        0% {
          transform-origin: 0% 0%;
        }
        50% {
          transform-origin: 100% 0%;
          background-image: var(--lumo-progress-indeterminate-progress-bar-background);
        }
        50.1% {
          transform-origin: 100% 0%;
          background-image: var(--lumo-progress-indeterminate-progress-bar-background-reverse);
        }
        100% {
          transform-origin: 0% 0%;
          background-image: var(--lumo-progress-indeterminate-progress-bar-background-reverse);
        }
      }
    </style>
    <div part="bar">
      <div part="value"></div>
    </div>
    `;
  }

  // properties, observers, etc. are identical to 2.x
  static get properties() {
    return {
      /**
       * Current progress value.
       */
      value: {
        type: Number,
        observer: '_valueChanged'
      },
      /**
       * Minimum bound of the progress bar.
       */
      min: {
        type: Number,
        value: 0,
        observer: '_minChanged'
      },
      /**
       * Maximum bound of the progress bar.
       */
      max: {
        type: Number,
        value: 1,
        observer: '_maxChanged'
      },
      /**
       * Indeterminate state of the progress bar.
       * This property takes precedence over other state properties (min, max, value). 
       */
      indeterminate: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return [
      '_normalizedValueChanged(value, min, max)'
    ];
  }

  ready() {
    super.ready();
    this.setAttribute('role', 'progressbar');
  }

  _normalizedValueChanged(value, min, max) {
    const newNormalizedValue = this._normalizeValue(value, min, max);
    this.style.setProperty('--vaadin-progress-value', newNormalizedValue);
    this.updateStyles({
      '--vaadin-progress-value': String(newNormalizedValue)
    });
  }
  _valueChanged(newV, oldV) {
    this.setAttribute('aria-valuenow', newV);
  }
  _minChanged(newV, oldV) {
    this.setAttribute('aria-valuemin', newV);
  }
  _maxChanged(newV, oldV) {
    this.setAttribute('aria-valuemax', newV);
  }
  /**
   * Percent of current progress relative to whole progress bar (max - min)
   */
  _normalizeValue(value, min, max) {
    let nV;
    if (!value && value != 0) {
      nV = 0;
    } else if (min >= max) {
      nV = 1;
    } else {
      nV = (value - min) / (max - min);
      nV = Math.min(Math.max(nV, 0), 1);
    }
    return nV;
  }
}

customElements.define('progress-bar', ProressBar);