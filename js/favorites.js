import { GithubUser } from "./GithubUser.js";
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();

        GithubUser.search('tiagotml').then(user => {
            console.log(user);
        });
    }
    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || [];
    }
    save() {
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries));
    }
    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username);
            if (userExists) {
                throw new Error('Usuário já existe');
            }
            const user = await GithubUser.search(username);
            if (user.login === undefined) {
                throw new Error('Usuário não encontrado');
            }
            this.entries = [user, ...this.entries];
            this.update();
            this.save();
        } catch (err) {
            console.log(err.message);
        }
    }
}
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector('table tbody');
        this.update();
        this.onadd();
    }
    onadd() {
        const addBtn = this.root.querySelector('.search button')
        const input = this.root.querySelector('.search input');
        addBtn.addEventListener('click', () => {
            const input = this.root.querySelector('.search input');
            this.add(input.value);
            input.value = '';
        })
        input.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                this.add(input.value);
                input.value = '';
            }
        })

    }
    delete(username) {
        this.entries = this.entries.filter(entry => entry.login !== username);
        this.update();
        this.save();
    }

    createRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/tiagotml.png" alt="" class="avatar">
                <a href="https://github.com/tiagotml" class="name" target="_blank">
                    <p> Tiago Mota</p>
                    <span> /tiagotml</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td class="action">
                <button class="remove">Remover</button>
            </td>
        `
        return tr;
    }
    update() {
        this.removeAllTr();
        this.entries.forEach((user) => {
            const tr = this.createRow();
            tr.querySelector('.user img').src = ` https://github.com/${user.login}.png`;
            tr.querySelector('.user a').href = ` https://github.com/${user.login}`;
            tr.querySelector('.user p').textContent = user.name;
            tr.querySelector('.user span').textContent = `/${user.login}`;
            tr.querySelector('.repositories').textContent = user.public_repos;
            tr.querySelector('.followers').textContent = user.followers;
            this.tbody.appendChild(tr);
            tr.querySelector('.remove').addEventListener('click', () => {
                confirm('Deseja realmente remover?') && this.delete(user.login);
            })
        })
    }
    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach(tr => tr.remove());
    }
}

