const tempText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Vivamus dictum massa eu ultricies sagittis. Nunc sit amet urna posuere,
sagittis enim et, ornare lectus. Quisque vitae consequat neque,
gravida molestie mi. Nulla ligula nisi, feugiat sed vulputate id,
rhoncus ut arcu. Nulla id nulla orci. Aliquam eros ligula,
gravida condimentum eleifend eu, fermentum ut lectus.
In eu tellus at libero semper hendrerit ut in libero. Sed gravida interdum metus,
ut dignissim risus.

Ut feugiat eu dui a laoreet. Nunc nec massa turpis.
Vivamus pellentesque bibendum quam sit amet volutpat.
Sed id erat non sapien sollicitudin vulputate.
Maecenas rhoncus nisl eget leo tristique, non sodales nisl aliquet.
Praesent nec sollicitudin magna. Integer at gravida libero.
Donec rutrum fringilla nulla sit amet fringilla.
Praesent mattis id lectus id porta.
Etiam feugiat posuere felis non finibus. Nam et molestie nibh.
Sed pretium elit sodales felis porttitor laoreet.
Mauris tincidunt dapibus enim et convallis.
Sed varius urna sed mauris hendrerit hendrerit.
`

const fetchProject = async (id) => {
    const res = await (await fetch('/api/projects')).json();

    if (res.status !== 200)
        throw new Error('todo');

    for (let i = 0; i < res.data.projects.length; i++) {
        if (res.data.projects[i].id === id)
            return res.data.projects[i];
    }

    throw new Error('404');
};

class ProjectItem extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<div class="loading">Loading...</div>`;
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });

        const id = window.location.href.split('/').at(-1);

        fetchProject(id).then(({ id, name, banner, stack }) => {
            this.innerHTML = '';

            const instance = document.createElement('div');

            const hero = document.createElement('div');
            hero.setAttribute('class', 'hero');
            hero.style.backgroundImage = `url("${banner}")`;

            const content = document.createElement('div');
            content.setAttribute('class', 'content');
            content.innerHTML = `
                <div class="stack">
                    ${stack.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <h1>${name}</h1>
                <div class="body">
                    <p>${tempText}</p>
                    <p>${tempText}</p>
                    <p>${tempText}</p>
                    <p>${tempText}</p>
                </div>
            `;

            const style = document.createElement('style');
            style.textContent = `
                h1 {
                    margin: 0;
                    font-size: 4rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .hero {
                    width: 100%;
                    height: 20rem;
                    max-height: 35vh;
                    background-position: center center;
                    background-repeat: no-repeat;
                    background-attachment: fixed;
                    background-size: cover;
                    border-bottom: 0.25rem solid var(--color-block);
                }

                .content {
                    max-width: 1024px;
                    margin: 0 auto;
                    padding: 2rem;

                    > .stack {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: start;
                        align-items: start;
                        align-content: start;
                        gap: 0.5rem;
                        opacity: 0.75;
                        font-weight: 600;
                    }
                }
            `;

            shadow.appendChild(style)

            instance.appendChild(hero);
            instance.appendChild(content);
            shadow.appendChild(instance);
        }).catch((error) => window.location.pathname = '/404')
    }
    disconnectedCallback() { }
}
customElements.define('project-item', ProjectItem);
