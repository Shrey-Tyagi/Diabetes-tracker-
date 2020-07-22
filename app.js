/*
    Storage Controller
 */
const StorageCtrl = (function() {
    // Public methods
    return {
        storeItem: function(newItem) {
            // Check if any item in localStorage
            if (localStorage.getItem('items') === null) {
                let items = []

                // Push new item
                items.push(newItem)

                // Set item to localStorage
                localStorage.setItem('items', JSON.stringify(items))

            } else {
                items = JSON.parse(localStorage.getItem('items'))

                // Push new Item
                items.push(newItem)

                // Reset the storage
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemFromLocalStorage: function() {
            let items = []

            // Check if localStorage is null or not
            if (localStorage.getItem('items') === null) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function(item, index) {
                if (updatedItem.id === item.id) {
                    // Remove item from the list and update it the same time
                    items.splice(index, 1, updatedItem)

                }
            })

            // Update the local storage
            localStorage.setItem('items', JSON.stringify(items))
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'))

            items.forEach(function(item, index) {
                if (id === item.id) {
                    items.splice(index, 1)
                }
            })

            // Reset the localStorage
            localStorage.setItem('items', JSON.stringify(items))
        },
        clearItemFromStorage: function() {
            localStorage.removeItem('items')
        }
    }
})()


/*
    Item Controller
 */
const ItemCtrl = (function() {

    // Item constructor (Private Method)
    const Item = function(id, name, calories, date) {
        this.id = id
        this.name = name
        this.calories = calories
        this.date = date
    }

    //Data Structure / State (Private Method)
    const data = {
        items: StorageCtrl.getItemFromLocalStorage(),
        currentItem: null,
        totalCalories: "Normal"
    }

    // Public methods
    return {
        getItems: function() {
            return data.items
        },
        getItemByID: function(id) {
            let found

            data.items.forEach(function(item) {
                if (item.id === id) {
                    found = item
                }
            })

            return found
        },
        updateItem: function(name, calories, StrDate) {
            // Calories to number
            calories = parseInt(calories)

            // Covert date to Date format
            const date = new Date(StrDate)

            let found

            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = calories
                    item.date = date
                    found = item
                }
            })
            return found
        },
        deleteItem: function(itemID) {
            // Get all item ids
            const ids = data.items.map(function(item) {
                return item.id
            })

            // Get index
            const index = ids.indexOf(itemID)

            // Remove item
            data.items.splice(index, 1)

        },
        setCurrentItem: function(item) {
            data.currentItem = item
        },
        getCalories: function() {
            let total = 0

            data.items.forEach(function(item) {
                total = item.calories
            })

            // Set total calories to the data structure
            if( total>=140){
                data.totalCalories = "High Please take your medication"
            }
            if( total<70){
                data.totalCalories = "Low Please take your medication"
            }
            if( total>=70 && total<140){
                data.totalCalories = "Normal. Have a great day ahead!"
            }
            total = 0

            return data.totalCalories
        },
        getCurrentItem: function() {
            return data.currentItem
        },
        addItem: function(name, calorie, StrDate) {
            let ID

            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }

            // Convert calorie to number
            const calories = parseInt(calorie)

            // Covert date to Date format
            const date = new Date(StrDate)

            // Create new Item
            const newItem = new Item(ID, name, calories, date)

            // Push data to items array
            data.items.push(newItem)

            return newItem

        },
        clearAllData: function() {
            data.items = []
        },
        covertToDateType: function(item) {
            return new Date(item)
        }
    }

})()





/*
    UI Controller
 */
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        inputMeal: '#item-name',
        inputCalorie: '#item-calorie',
        inputDate: `#item-date`,
        totalCalories: '.total-calorie'

    }

    // Public method
    return {
        populateItemList: function(items) {
            let html = ''

            items.forEach(function(item) {
                /* Converting string date to Date object
                    ( When data is in localStorage Date object 
                      get converted to string) */
                let date = new Date(item.date)
                html += `<li class="list-group-item lits-group-item-active" id="item-${item.id}">
                            <strong><u>${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}</u></strong>&emsp;
                            <strong>${item.name}: </strong>
                            <em>${item.calories} mg/Dl</em>
                            <a href="#" class="float-right">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`
            })

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.inputMeal).value,
                calories: document.querySelector(UISelectors.inputCalorie).value,
                date: document.querySelector(UISelectors.inputDate).value
            }
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.inputMeal).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.inputCalorie).value = ItemCtrl.getCurrentItem().calories
               
            const newDate = ItemCtrl.covertToDateType(ItemCtrl.getCurrentItem().date)
            document.querySelector(UISelectors.inputDate).value = newDate.toISOString().substring(0, 10)
            UICtrl.showEditState()
        },
        clearInput: function() {
            document.querySelector(UISelectors.inputMeal).value = ''
            document.querySelector(UISelectors.inputCalorie).value = ''
            document.querySelector(UISelectors.inputDate).value = ''
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none'
        },
        getSelectors: function() {
            return UISelectors
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearEditState: function() {
            UICtrl.clearInput()
            document.querySelector(UISelectors.updateBtn).style.display = 'none'
            document.querySelector(UISelectors.deleteBtn).style.display = 'none'
            document.querySelector(UISelectors.addBtn).style.display = 'inline'
            document.querySelector(UISelectors.backBtn).style.display = 'none'
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline'
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline'
            document.querySelector(UISelectors.addBtn).style.display = 'none'
            document.querySelector(UISelectors.backBtn).style.display = 'inline'
        },
        addNewItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block'

            // Create li element
            const li = document.createElement('li')

            // Add class
            li.className = 'list-group-item lits-group-item-active'

            // Add id
            li.id = `item-${item.id}`

            // Add HTML
            li.innerHTML = `<strong><u>${item.date.getUTCDate()}/${item.date.getUTCMonth()+1}/${item.date.getUTCFullYear()}</u></strong>&emsp;
                            <strong>${item.name}: </strong>
                            <em>${item.calories} mg/Dl</em>
                            <a href="#" class="float-right">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`

            // Insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(updatedItem) {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // Turn NodeList to array
            listItems = Array.from(listItems)

            listItems.forEach(function(item) {
                const itemID = item.getAttribute('id')

                if (itemID === `item-${updatedItem.id}`) {
                    document.querySelector(`#${itemID}`).
                    innerHTML = `<strong><u>${updatedItem.date.getUTCDate()}/${updatedItem.date.getUTCMonth()+1}/${updatedItem.date.getUTCFullYear()}</u></strong>&emsp;
                                <strong>${updatedItem.name}: </strong>
                                <em>${updatedItem.calories} mg/Dl</em>
                                <a href="#" class="float-right">
                                    <i class="edit-item fa fa-pencil"></i>
                                </a>`
                }
            })

            // Get total calories
            const totalCalories = ItemCtrl.getCalories()

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories)

            UICtrl.clearEditState()

        },
        deleteListItem: function(id) {
            // create id similar to html list ID
            const itemID = `#item-${id}`

            // fetch the li using generated id
            const item = document.querySelector(itemID)

            // remove item from the list
            item.remove()

            // Get total calories
            const totalCalories = ItemCtrl.getCalories()

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories)

            UICtrl.clearEditState()
        },
        removeAllItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems)

            // Turn NodeList to array
            listItems = Array.from(listItems)

            listItems.forEach(function(item) {
                item.remove()
            })

        }
    }

})()




/*
    App Controller
 */
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {

    // Load event listener
    const loadEventListener = function() {
        // Get UI selector
        const UISelectors = UICtrl.getSelectors()

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        // Disable submit on Enter key
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault()
                return false
            }
        })

        // Click edit icon
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)

        // Update Event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateEvent)

        // Delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteEvent)

        // Clear All items
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemEvent)

        // Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', backEvent)
    }

    // Add item submit (load Event function)
    const itemAddSubmit = function(e) {
        // get form input from UI Controller
        const input = UICtrl.getItemInput()

        // Check for input
        if (input.name !== '' && input.calories !== '' && input.date !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories, input.date)

            // Add Item to UI List
            UICtrl.addNewItem(newItem)

            // Store data to local storage
            StorageCtrl.storeItem(newItem)

        }

        // Get total calories
        const totalCalories = ItemCtrl.getCalories()

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories)

        // Clear input Tabs
        UICtrl.clearInput()

        e.preventDefault()
    }

    // Update Icon click
    const itemEditClick = function(e) {
        // check for update symbol
        if (e.target.classList.contains('edit-item')) {
            // Get list item id
            const listID = e.target.parentNode.parentNode.id

            // break outcome into array to get integer value
            const listIDNumber = parseInt(listID.split('-')[1])

            // Get the entire item from data
            const itemToEdit = ItemCtrl.getItemByID(listIDNumber)

            // Set Current item
            ItemCtrl.setCurrentItem(itemToEdit)

            // Add item to form
            UICtrl.addItemToForm()

        }
        e.preventDefault()
    }

    // Item Delete Event
    const itemDeleteEvent = function(e) {
        // Get the current item 
        const currentItem = ItemCtrl.getCurrentItem()

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id)

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id)

        // Delete from localStorage
        StorageCtrl.deleteItemFromStorage(currentItem.id)

        e.preventDefault()
    }

    // Item Update Click
    const itemUpdateEvent = function(e) {
        // Get item input
        const input = UICtrl.getItemInput()

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories, input.date)
        console.log(updatedItem)

        // Update the UI
        UICtrl.updateListItem(updatedItem)

        // Update Local storage
        StorageCtrl.updateItemStorage(updatedItem)

        e.preventDefault()
    }

    // Clear All items
    const clearAllItemEvent = function(e) {
        // clear all items from data structure
        ItemCtrl.clearAllData()

        // Remove from UI
        UICtrl.removeAllItems()

        // Get total calories
        const totalCalories = ItemCtrl.getCalories()

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories)

        UICtrl.clearEditState()

        // Clear from Local Storage
        StorageCtrl.clearItemFromStorage()

        // Hide the UL
        UICtrl.hideList()

        e.preventDefault()
    }

    // Back event
    const backEvent = function(e) {
        UICtrl.clearEditState()

        e.preventDefault()
    }

    // Public methods
    return {
        init: function() {
            console.log('initializing app....')

            // Clear edit state (update, delete, back, add buttons)
            UICtrl.clearEditState()

            // Fetch items from data structure
            const items = ItemCtrl.getItems()

            // Check for items
            if (items.length == 0) {
                // Hide UL if there is no LI
                UICtrl.hideList()
            } else {
                // Populate list with items
                UICtrl.populateItemList(items)
            }

            // Get total calories
            const totalCalories = ItemCtrl.getCalories()

            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories)

            // Load Event listener
            loadEventListener()
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl)


/*
    Initializing App
*/
App.init()