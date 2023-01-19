/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);

  return new proto.constructor(...values);
}

Rectangle.prototype.Circle = (w, h) => {
  this.width = w;
  this.height = h;
};


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class SelectorBuilder {
  constructor() {
    this.selector = {
      element: null,
      id: null,
      class: [],
      attribute: [],
      pseudoClass: [],
      pseudoElement: null,
    };
    this.order = 0;
    this.selectorsComb = [];
  }

  check(selectorType, order) {
    if (this.order > order) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (['element', 'id', 'pseudoElement'].includes(selectorType) && this.selector[selectorType]) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  }

  element(value) {
    this.check('element', 1);
    this.selector.element = value;
    this.order = 1;
    return this;
  }

  id(value) {
    this.check('id', 2);
    this.selector.id = value;
    this.order = 2;
    return this;
  }

  class(value) {
    this.check('class', 3);
    this.selector.class.push(value);
    this.order = 3;
    return this;
  }

  attr(value) {
    this.check('attribute', 4);
    this.selector.attribute.push(value);
    this.order = 4;
    return this;
  }

  pseudoClass(value) {
    this.check('pseudoClass', 5);
    this.selector.pseudoClass.push(value);
    this.order = 5;
    return this;
  }

  pseudoElement(value) {
    this.check('pseudoElement', 6);
    this.selector.pseudoElement = value;
    this.order = 6;
    return this;
  }

  stringifySelector() {
    return (this.selector.element ? this.selector.element : '')
      + (this.selector.id ? `#${this.selector.id}` : '')
      + (this.selector.class.length ? `.${this.selector.class.join('.')}` : '')
      + (this.selector.attribute.length ? `[${this.selector.attribute.join('][')}]` : '')
      + (this.selector.pseudoClass.length ? `:${this.selector.pseudoClass.join(':')}` : '')
      + (this.selector.pseudoElement ? `::${this.selector.pseudoElement}` : '');
  }

  stringify() {
    return this.selectorsComb.length ? this.selectorsComb.join(' ') : this.stringifySelector();
  }

  combine(selector1, combinator, selector2) {
    this.selectorsComb = [selector1, combinator, selector2];
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new SelectorBuilder().element(value);
  },

  id(value) {
    return new SelectorBuilder().id(value);
  },

  class(value) {
    return new SelectorBuilder().class(value);
  },

  attr(value) {
    return new SelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new SelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new SelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new SelectorBuilder().combine(selector1.stringify(), combinator, selector2.stringify());
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
