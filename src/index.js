const h = (type, content = '', classList) => {
  const elem = document.createElement(type);
  elem.textContent = content;
  classList ? elem.classList = classList : void 0;
  return elem;
};

const highlightLinks = () => {
  const links = document.querySelectorAll('a');
  [...links].forEach((link, idx) => {
    const elem = h('span', '', 'webres-injected-link');
    elem.appendChild(h('p', idx + 1));
    elem.dataset.linkIndex = idx;
    const rect = link.getBoundingClientRect();
    elem.style.left = rect.x - 5;
    elem.style.top = rect.y - 10;
    document.body.appendChild(elem);
  });
};

const injectStyle = () => {
  const style = h('style', `
  .webres-injected-link {
    border: solid 1px;
    background-color: rgba(255, 0, 0, 0.5);
    color: white;
    position: absolute;
    font-family: monospace;
    height: 10px;
    width: 10px;
    padding: 3px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .webres-injected-link > p {
    color: white;
    margin: 0;
  }
  `);
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  injectStyle();
  highlightLinks();
});