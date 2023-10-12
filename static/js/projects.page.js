/**
 * Fetch projects from the "backend".
 * @returns {Object} data - `Object` containing `projects: any[]` and `stacks: string[]`.
 */
const fetchProjects = async () => {
    const res = await (await fetch('/api/projects')).json();

    if (res.status !== 200)
        throw new Error('todo');

    return res.data;
};

/**
 * `<projects-list-item>` component.
 * 
 * Somewhat similar functionality to a "product card" on an e-commerce site.
 * @class
 */
class ProjectsListItem extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        const { name, banner, stack } = JSON.parse(this.getAttribute('data') || '');

        const hero = document.createElement('div');
        hero.setAttribute('class', 'hero');
        hero.innerHTML = `<img src="${banner}" />`

        const meta = document.createElement('div');
        meta.setAttribute('class', 'meta');
        meta.innerText = name;

        const tech = document.createElement('div');
        tech.setAttribute('class', 'tech');
        tech.innerHTML = stack.map(tech => `<div class="badge">${tech}</div>`).join('');

        const style = document.createElement('style');
        style.textContent = `
            :host {
                overflow: hidden;
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                color: var(--color-text);
                cursor: pointer;
            }

            :host(:hover) .hero {
                border: 0.25rem solid var(--color-accent);
            }
            :host(:hover) .meta {
                background: var(--color-accent);
                color: var(--color-accent-text);
            }

            .hero {
                width: 100%;
                aspect-ratio: 1 / 1;
                border: 0 solid transparent;
                box-sizing: border-box;
                transition: var(--block-transition) all;

                > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .meta {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2.5rem;
                padding: 1rem 0.5rem;
                background: var(--color-block);
                transition: var(--block-transition) all;
            }

            .tech {
                position: absolute;
                inset: 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: start;
                align-items: start;
                align-content: start;
                gap: 0.5rem;
                padding: 1rem;
            }

            .badge {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 1.5rem;
                padding: 0.25rem 0.75rem;
                background: var(--color-accent);
                color: var(--color-accent-text);
                border-radius: 1rem;
                font-size: 0.85rem;
                font-weight: 600;
                text-transform: uppercase;
                box-shadow: 0 0 15px -2px rgba(0, 0, 0, 0.75);
            }
        `;

        shadow.appendChild(style)
        shadow.appendChild(hero);
        shadow.appendChild(meta);
        shadow.appendChild(tech);
    }
    disconnectedCallback() { }
}
customElements.define('projects-list-item', ProjectsListItem);

/**
 * `<projects-list>` component.
 * 
 * A responsive grid with `<projects-list-item>` children.
 * @class
 */
class ProjectsList extends HTMLElement {
    static observedAttributes = ['filter', 'search'];

    /** @type {string[]} */
    filter = [];
    /** @type {string} */
    search = '';

    /** @constructor */
    constructor() {
        super();
        this.innerHTML = '';
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.innerHTML = `<div class="loading">Loading...</div>`;
    }

    connectedCallback() {
        fetchProjects().then(({ projects }) => {
            this.innerHTML = '';
            this.shadowRoot.innerHTML = '';

            const style = document.createElement('style');
            style.textContent = `
                    :host {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, 22rem);
                        gap: 1rem;
                    }

                    a {
                        text-decoration: none;
                    }
                `;
            this.shadow.appendChild(style)

            // Create a `<projects-list-item>` for every project.
            projects.forEach(project => {
                // Check if we're supposed to filter based on stack
                if (this.filter.length > 0) {
                    // If current filter does not contain any of the current stack; bail.
                    if (!this.filter.some(e => project.stack.includes(e)))
                        return;
                }
                // Are we searching?
                if (this.search) {
                    // Convert to lowercase and check if substring is found, if not; bail.
                    if (!project.name.toLowerCase().includes(this.search.toLowerCase()))
                        return;
                }

                const instance = document.createElement('projects-list-item');
                instance.setAttribute('data', JSON.stringify(project));

                const wrapper = document.createElement('a');
                wrapper.setAttribute('href', `/projects/${project.id}`);

                wrapper.appendChild(instance);

                // Write project child to the dom.
                this.shadow.appendChild(wrapper);
            });
        })
    }

    /**
     * Fetch projects from the "backend".
     * @param {string} name - Attribute name
     * @param {string} prev - Previous value of the attribute
     * @param {string} value - New (current) value of the attribute
     */
    attributeChangedCallback(name, prev, value) {
        switch (name) {
            case 'filter':
                this.filter = value && value?.split(',') || [];
                break;
            case 'search':
                this.search = value || '';
                break;
        }

        this.connectedCallback();
    }
}
customElements.define('projects-list', ProjectsList);

/**
 * `<projects-filter>` component, Filtering and search UI.
 * 
 * Works by updating attributes on a `<projects-list>` component.
 * FIXME: Hardcoded to target the first instance of `<projects-list>`.
 * @class
 */
class ProjectsFilter extends HTMLElement {
    /** @type {string[]} */
    filter = [];

    /** @constructor */
    constructor() {
        super();
        this.innerHTML = ``;
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        fetchProjects().then(({ stacks }) => {
            this.innerHTML = '';

            const style = document.createElement('style');
            style.textContent = `
                :host {
                    padding: 1rem;
                    background: var(--color-block);
                    height: fit-content;
                }

                .label {
                    padding: 0 0 0.25rem 0;
                    margin: 0 0 0.75rem 0;
                    font-size: 1rem;
                    font-weight: 800;
                    border-bottom: 0.15rem solid var(--color-block-dark);
                }

                .stacks {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: start;
                    align-items: start;
                    align-content: start;
                    gap: 0.5rem;
                    width: 100%;
                    margin-bottom: 1rem;
                }

                .search {
                    border: none;
                    width: 100%;
                    font-size: 1;
                    font-weight: 700;
                    padding: 0.5rem 0.5rem;
                    box-sizing: border-box;

                    &:focus{
                        outline: none;
                    }
                }

                .item {
                    padding: 0.25rem 0.75rem;
                    border: 0.15rem solid var(--color-text);
                    border-radius: 1rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    cursor: pointer;
                    user-select: none;

                    &:hover {
                        border-color: var(--color-accent);
                        color: var(--color-accent);
                    }

                    &[selected] {
                        background: var(--color-accent);
                        color: var(--color-accent-text);
                    }
                }

                a {
                    text-decoration: none;
                }
            `;
            shadow.appendChild(style);

            const stackLabel = document.createElement('p');
            stackLabel.setAttribute('class', 'label');
            stackLabel.innerText = 'Stack';

            const stack = document.createElement('div');
            stack.setAttribute('class', 'stacks');

            stacks.forEach(tech => {
                const instance = document.createElement('div');
                instance.setAttribute('class', 'item');
                instance.onclick = () => {
                    if (instance.getAttribute('selected')) {
                        instance.removeAttribute('selected');
                        this.filter = this.filter.filter(item => item !== tech);
                    } else {
                        instance.setAttribute('selected', 'true');
                        this.filter.push(tech);
                    }

                    const list = document.getElementsByTagName('projects-list')[0];
                    list.setAttribute('filter', this.filter);
                };
                instance.innerText = tech;

                stack.appendChild(instance);
            });

            const searchLabel = document.createElement('p');
            searchLabel.setAttribute('class', 'label');
            searchLabel.innerText = 'Search';

            const search = document.createElement('input');
            search.setAttribute('class', 'search');
            search.oninput = (e) => {
                const list = document.getElementsByTagName('projects-list')[0];
                list.setAttribute('search', e.target.value);
            }

            shadow.appendChild(stackLabel);
            shadow.appendChild(stack);
            shadow.appendChild(searchLabel);
            shadow.appendChild(search);
        })
    }
}
customElements.define('projects-filter', ProjectsFilter);
