//Storage Controller

const StorageCtrl = (function(){
        //Public methods

    return {

        storeItem: function(item){

            let items;
            //Check if there are items in local storage

            if (localStorage.getItem('items')=== null) {
                items = [];
                items.push(item);
                //Set item in local storage
                localStorage.setItem('items', JSON.stringify(items));

            } else {
                items = JSON.parse(localStorage.getItem('items'));
                //Push new item
                items.push(item);
                //save to ls again
                localStorage.setItem('items', JSON.stringify(items));
            }

        },
        getItemsFromStorage: function(){
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;

        }
    }

})();

//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function (ID, name, calories){
        this.ID = ID;
        this.name = name;
        this.calories = calories;
    }

    //Data structure / State

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }
    //Public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            //Create id
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].ID + 1;
            } else {
                ID = 0;
            }
            //Calories to number
            calories = parseInt(calories);
            //create new Item

            const newItem = new Item (ID, name, calories);
            //Add to items Array
            data.items.push(newItem);
            return newItem;
        },
        getItemByID: function(ID) {
            let found = null;
            //loop through items
            data.items.forEach(function(item){
                if(item.ID===ID) {
                    found = item;
                }
            })
           
            return found;
            
        },
        updateListItem: function(name,calories){
            //Calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if (item.ID===data.currentItem.ID) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(ID){
            //get ids
            const IDS = data.items.map(function(item){
                return item.ID;
            });
            //Get Index
            const index = IDS.indexOf(ID);

            //Remove item
            data.items.splice(index,1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){

            let total = 0;
            data.items.forEach(function(item){
                total+=item.calories;
            
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logData: function(){
            return data;
        }
    }
})();


//UI Controller
const UiCtrl = (function(){
    const UiSelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn:".add-btn",
        updateBtn:".update-btn",
        deleteBtn:".delete-btn",
        backBtn:".back-btn",
        clearBtn:".clear-btn",
        itemNameInput:"#item-name",
        ItemCaloriesInput:"#item-calories",
        totalCalories:".total-calories"
    }

    return {
        populateItemList: function(items){
            let html = "";
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.ID}"><strong>${item.name}:</strong><em>${item.calories}</em>
                <a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a>
                </li>`;
            });
            //Insert List items
            document.querySelector(UiSelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return{
                name: document.querySelector(UiSelectors.itemNameInput).value,
                calories: document.querySelector(UiSelectors.ItemCaloriesInput).value
            }
        
        },
        addListItem: function(item){
            //show the list
            document.querySelector(UiSelectors.itemList).style.display="block";
            //Create li element
            const li = document.createElement("li");
            //Add class
            li.className = "collection-item";
            //Add ID
            li.id = `item-${item.ID}`;
            //Add html
            li.innerHTML = `<strong>${item.name}:</strong><em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a>`;
            //insert item
            document.querySelector(UiSelectors.itemList).insertAdjacentElement("beforeend",li)
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UiSelectors.listItems);
            //Turn Node List into Array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute("ID");

                if (itemID === `item-${item.ID}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong><em>${item.calories}</em>
                    <a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a>`;
                }
            });
        },
        deleteListItem: function(ID){
            const itemID = `#item-${ID}`;
            const item = document.querySelector(itemID);
            item.remove();

        },
        clearInput: function(){
            document.querySelector(UiSelectors.itemNameInput).value="";
            document.querySelector(UiSelectors.ItemCaloriesInput).value="";
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UiSelectors.listItems);
            //Turn Node List into Array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        addItemToForm: function(){
            document.querySelector(UiSelectors.itemNameInput).value=ItemCtrl.getCurrentItem().name;
            document.querySelector(UiSelectors.ItemCaloriesInput).value=ItemCtrl.getCurrentItem().calories;
            UiCtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UiSelectors.itemList).style.display ="none";
        },
        showTotalCalories: function(total){
            document.querySelector(UiSelectors.totalCalories).textContent=total;
        },
        clearEditState: function(){
            UiCtrl.clearInput();
            document.querySelector(UiSelectors.updateBtn).style.display ="none";
            document.querySelector(UiSelectors.deleteBtn).style.display ="none";
            document.querySelector(UiSelectors.backBtn).style.display ="none";
            document.querySelector(UiSelectors.addBtn).style.display ="inline";

        },
        showEditState: function(){
            document.querySelector(UiSelectors.updateBtn).style.display ="inline";
            document.querySelector(UiSelectors.deleteBtn).style.display ="inline";
            document.querySelector(UiSelectors.backBtn).style.display ="inline";
            document.querySelector(UiSelectors.addBtn).style.display ="none";

        },
        getSelectors: function(){
            return UiSelectors;
        }
    }
})();

//App Controller
const App = (function(ItemCtrl,StorageCtrl,UiCtrl){
    // Load event listeners
    const loadEventListeners = function(){
        //Get Ui Selectors -> UiSelectors is a private variable of UiCtrl, so we have to take the detour
        const UiSelectors = UiCtrl.getSelectors();

        //Add item Event
        document.querySelector(UiSelectors.addBtn).addEventListener("click", itemAddSubmit);

        //disable submit on enter

        document.addEventListener("keypress", function(e){
            if(e.keyCode===13||e.which===13){
                e.preventDefault();
                return false;
            }
        });
    
        //Edit-item click event --> uses event delegation because items are added to DOM after page loaded
        document.querySelector(UiSelectors.itemList).addEventListener("click",itemEditClick);

        //Update item event
        document.querySelector(UiSelectors.updateBtn).addEventListener("click",itemUpdateSubmit);
        
        //Back Button Event
        document.querySelector(UiSelectors.backBtn).addEventListener("click",UiCtrl.clearEditState);

        //Delete item Event
        document.querySelector(UiSelectors.deleteBtn).addEventListener("click",itemDeleteSubmit);

        //clear all event
         //Delete item Event
         document.querySelector(UiSelectors.clearBtn).addEventListener("click",clearAllItemsClick);

    };
    const itemAddSubmit = function(e){
        //get form input from Ui Controller
        const input = UiCtrl.getItemInput();

        //Check for name and calorie input
        if(input.name !== "" && input.calories!==""){
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to Ui List
            UiCtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
            //Add totalCalories to UI
            UiCtrl.showTotalCalories(totalCalories);

            //Store in local storage
            StorageCtrl.storeItem(newItem);

            //Clear fields after inserting new Item
            UiCtrl.clearInput();
        }

        e.preventDefault();
    };
    //Item edit click
    const itemEditClick = function(e){
    if(e.target.classList.contains("edit-item")){
        //get list item id
        const listID = e.target.parentNode.parentNode.id;
        // Break into array with split method
        const listIDArr = listID.split("-");
        //Get actual ID
        const id = parseInt(listIDArr[1]);
        
        //Get item

        const itemToEdit = ItemCtrl.getItemByID(id);

        //set current item
        ItemCtrl.setCurrentItem(itemToEdit);
        UiCtrl.addItemToForm();
    }        
        e.preventDefault;
    }

    //Item update submit

    const itemUpdateSubmit = function(e){
        //Get item input
        const input = UiCtrl.getItemInput();
        //Update item
        const updatedItem = ItemCtrl.updateListItem(input.name, input.calories);
        UiCtrl.updateListItem(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add totalCalories to UI
        UiCtrl.showTotalCalories(totalCalories);
        UiCtrl.clearEditState();
        e.preventDefault();
    }
    //Item Delete submit
    const itemDeleteSubmit = function(e){
       
        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.ID);

        //delete from UI
        UiCtrl.deleteListItem(currentItem.ID);

        const totalCalories = ItemCtrl.getTotalCalories();
        //Add totalCalories to UI
        UiCtrl.showTotalCalories(totalCalories);
        UiCtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function(){

        //Delete all items from data structure
        ItemCtrl.clearAllItems();
          
        const totalCalories = ItemCtrl.getTotalCalories();
        //Add totalCalories to UI
        UiCtrl.showTotalCalories(totalCalories);
        UiCtrl.clearEditState();
        //Remove from UI
        UiCtrl.removeItems();
        
        //Hide UL
        UiCtrl.hideList();

    }


    return {
        init: function(){
            //Clear Edit State
            UiCtrl.clearEditState();
            let items = [];
            items = ItemCtrl.getItems();

            //Check if there are any items, if not call hideList and "hide" the style border of the list. If yes, call populateItemList
            if (items.length === 0 || items === null) {
                UiCtrl.hideList();
            } else {
                UiCtrl.populateItemList(items);
            }
          
           //Load Eventlisteners
           loadEventListeners();
           //Get total calories
          
        }
    }
    
})(ItemCtrl,StorageCtrl,UiCtrl);

//Initialize App

App.init();