/**
 * Description placeholder
 *
 * @export
 * @param {string} tagName
 * @param {Object.<string, string>} attributes An object that sets the attribute of the HTMLElement and its value
 * @returns {HTMLElement}
 */
export function createElement(tagName, attributes = {}) {
  const element = document.createElement(tagName);
  for (const [attribute, value] of Object.entries(attributes)) {
    if (value !== false && value !== null) {
      element.setAttribute(attribute, value);
    }
  }
  return element;
}
