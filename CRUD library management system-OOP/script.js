class Item {
    constructor(id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
    }

    getType() {
        return 'Item';
    }

    displayInfo() {
        return `${this.title} by ${this.author}`;
    }
}

class Book extends Item {
    getType() {
        return 'Book';
    }
}

class Magazine extends Item {
    getType() {
        return 'Magazine';
    }
}

class Newspaper extends Item {
    getType() {
        return 'Newspaper';
    }
}

class LibraryManager {
    #items = [];
    static #storageKey = 'libraryItems';

    constructor(itemListId, titleInputId, authorInputId, itemTypeId, editItemModalId, editTitleInputId, editAuthorInputId, editItemTypeId, saveChangesButtonId) {
        this.itemListElement = document.getElementById(itemListId);
        this.titleInput = document.getElementById(titleInputId);
        this.authorInput = document.getElementById(authorInputId);
        this.itemType = document.getElementById(itemTypeId);
        this.editItemModal = document.getElementById(editItemModalId);
        this.editTitleInput = document.getElementById(editTitleInputId);
        this.editAuthorInput = document.getElementById(editAuthorInputId);
        this.editItemType = document.getElementById(editItemTypeId);
        this.saveChangesButton = document.getElementById(saveChangesButtonId);
        
        this.loadItems();
        this.addEventListeners();
    }

    static get storageKey() {
        return this.#storageKey;
    }

    addEventListeners() {
        document.getElementById('addItemButton').addEventListener('click', () => this.addItem());
        this.saveChangesButton.addEventListener('click', () => this.updateItem());
    }

    loadItems() {
        const storedItems = JSON.parse(localStorage.getItem(LibraryManager.storageKey)) || [];
        this.#items = storedItems.map(item => {
            switch (item.type) {
                case 'Book': return new Book(item.id, item.title, item.author);
                case 'Magazine': return new Magazine(item.id, item.title, item.author);
                case 'Newspaper': return new Newspaper(item.id, item.title, item.author);
                default: return new Item(item.id, item.title, item.author);
            }
        });
        this.renderItems();
    }

    renderItems() {
        this.itemListElement.innerHTML = '';
        this.#items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <span>${item.displayInfo()} <span class="badge bg-${item.getType() === 'Book' ? 'success' : item.getType() === 'Magazine' ? 'info' : 'secondary'}">${item.getType()}</span></span>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-warning btn-sm" onclick="libraryManager.openEditModal(${item.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-danger btn-sm ms-2" onclick="libraryManager.deleteItem(${item.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>`;
            this.itemListElement.appendChild(li);
        });
    }

    addItem() {
        const title = this.titleInput.value.trim();
        const author = this.authorInput.value.trim();
        const type = this.itemType.value;

        if (title && author) {
            let newItem;
            if (type === 'Book') {
                newItem = new Book(Date.now(), title, author);
            } else if (type === 'Magazine') {
                newItem = new Magazine(Date.now(), title, author);
            } else if (type === 'Newspaper') {
                newItem = new Newspaper(Date.now(), title, author);
            }

            this.#items.push(newItem);
            this.saveItems();
            this.renderItems();
            this.titleInput.value = '';
            this.authorInput.value = '';
        }
    }

    openEditModal(itemId) {
        const itemToEdit = this.#items.find(item => item.id === itemId);
        this.editTitleInput.value = itemToEdit.title;
        this.editAuthorInput.value = itemToEdit.author;
        this.editItemType.value = itemToEdit.getType();
        this.currentItemId = itemId;

        const modalInstance = new bootstrap.Modal(this.editItemModal);
        modalInstance.show();
    }

    updateItem() {
        const title = this.editTitleInput.value.trim();
        const author = this.editAuthorInput.value.trim();
        const type = this.editItemType.value;

        if (title && author) {
            const itemIndex = this.#items.findIndex(item => item.id === this.currentItemId);
            if (itemIndex !== -1) {
                let updatedItem;
                if (type === 'Book') {
                    updatedItem = new Book(this.currentItemId, title, author);
                } else if (type === 'Magazine') {
                    updatedItem = new Magazine(this.currentItemId, title, author);
                } else if (type === 'Newspaper') {
                    updatedItem = new Newspaper(this.currentItemId, title, author);
                }
                this.#items[itemIndex] = updatedItem;
                this.saveItems();
                this.renderItems();
                this.editTitleInput.value = '';
                this.editAuthorInput.value = '';
                this.currentItemId = null;

                const modalInstance = bootstrap.Modal.getInstance(this.editItemModal);
                modalInstance.hide();
            }
        }
    }

    deleteItem(itemId) {
        this.#items = this.#items.filter(item => item.id !== itemId);
        this.saveItems();
        this.renderItems();
    }

    saveItems() {
        localStorage.setItem(LibraryManager.storageKey, JSON.stringify(this.#items));
    }
}

// Instantiate LibraryManager
const libraryManager = new LibraryManager(
    'itemList',
    'titleInput',
    'authorInput',
    'itemType',
    'editItemModal',
    'editTitleInput',
    'editAuthorInput',
    'editItemType',
    'saveChangesButton'
);
