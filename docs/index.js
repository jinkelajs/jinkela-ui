const renderer = new marked.Renderer();

renderer.code = (code, rLang) => {
  const [lang, ext = ''] = rLang.split(/,/g);
  const language = hljs.getLanguage(lang) ? lang : 'text';
  const { value } = hljs.highlight(code, { language });
  return `
    <dl>
      <dd></dd>
      <dt>
        <pre class="hljs ${lang}" data-ext="${ext}"><div>${value}</div></pre>
      </dt>
    </dl>
  `;
};

renderer.link = (href, title, text) => {
  return `<a href="${href}" target="_blank" title="${title}">${text}</a>`;
};

marked.setOptions({ renderer });

const { jkl, createState, request } = Jinkela;

const mdState = request(async () => {
  const res = await fetch('./index.md');
  const text = await res.text();
  const html = marked.parse(text);
  const node = jkl({ raw: [html] });
  node.querySelectorAll('dl').forEach((dl) => {
    const pre = dl.querySelector('dt pre');
    const { textContent } = pre;
    const f = new Function('jkl', textContent.replace(/^export default/gm, 'return'));
    dl.querySelector('dd')?.appendChild(f(jkl));
  });
  const list = node.querySelectorAll('[id]');
  return { list, node };
});

const de = document.documentElement;
const pageState = createState({ menuPos: 'fixed', hash: location.hash });
// addEventListener('scroll', () => {
//   return (pageState.menuPos = de.scrollTop > 90 ? 'fixed' : 'absolute');
// });
addEventListener('hashchange', () => (pageState.hash = location.hash));

document.body.appendChild(jkl`
  <aside style="position: ${() => pageState.menuPos};">
    <ul>
      ${() => {
        if (!mdState.data) return;
        const list = mdState.data.list;
        return Array.from(list, (h) => {
          const level = h.tagName.match(/\d+/) - 1;
          const id = h.getAttribute('id');
          const href = `#${encodeURIComponent(id)}`;
          const visiting = ''; // () => (id === s.view ? 'visiting' : '');
          const active = () => (href === pageState.hash ? 'active' : '');
          return jkl`
            <li style="margin-left: ${level}em;" class="${visiting} ${active}">
              <a href="${href}">${h.textContent}<a/>
            </li>`;
        });
      }}
    </ul>
  </aside>
  <article>
    ${() => {
      if (mdState.loading) {
        return 'Loading...';
      }
      if (mdState.error) {
        return jkl`<pre>${() => mdState.error.stack}</pre>`;
      }
      setTimeout(() => {
        const { hash } = location;
        const id = decodeURIComponent(hash.slice(1));
        const hx = document.getElementById(id);
        hx.scrollIntoView(true);
      });
      return mdState.data.node;
    }}
  </article>
`);
