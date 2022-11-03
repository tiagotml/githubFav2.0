export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();

    }
    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || [];
    }
    save(){
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries));
    }
}
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root);
        this.tbody = this.root.querySelector('table tbody');
        this.update();
        this.onadd();
    }

    createRow() {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/tiagotml.png" alt="" class="avatar">
                <a href="https://github.com/tiagotml" class="name" target="_blank">
                    <p> Tiago Mota</p>
                    <span> tiagotml</span>
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
            const row = this.createRow();
            this.tbody.appendChild(row);
        }
           
    }
