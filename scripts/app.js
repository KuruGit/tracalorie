//Storage Controller

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
        items: [
            // {id:0, name: "Steak Dinner", calories: 1200},
            // {id:1, name: "Cookie", calories: 500},
            // {id:2, name: "Salad", calories: 250},
        ],
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
                ID = data.items[data.items.length - 1].id + 1;
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
        logData: function(){
            return data;
        }
    }
})();


//UI Controller
const UiCtrl = (function(){
    const UiSelectors = {
        itemList: "#item-list",
        addBtn:".add-btn",
        itemNameInput:"#item-name",
        ItemCaloriesInput:"#item-calories"
    }

    return {
        populateItemList: function(items){
            let html = "";
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}"><strong>${item.name}:</strong><em>${item.calories}</em>
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
            li.id = `item-${item.id}`;
            //Add html
            li.innerHTML = `<strong>${item.name}:</strong><em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="edit-item fas fa-edit"></i></a>`;
            //insert item
            document.querySelector(UiSelectors.itemList).insertAdjacentElement("beforeend",li)
        },
        clearInput: function(){
            document.querySelector(UiSelectors.itemNameInput).value="";
            document.querySelector(UiSelectors.ItemCaloriesInput).value="";
        },
        hideList: function(){
            document.querySelector(UiSelectors.itemList).style.display ="none";
        },
        getSelectors: function(){
            return UiSelectors;
        }
    }
})();

//App Controller
const App = (function(ItemCtrl, UiCtrl){
    // Load event listeners
    const loadEventListeners = function(){
        //Get Ui Selectors -> UiSelectors is a private variable of UiCtrl, so we have to take the detour
        const UiSelectors = UiCtrl.getSelectors();

        //Add item Event
        document.querySelector(UiSelectors.addBtn).addEventListener("click", itemAddSubmit);
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

            //Clear fields after inserting new Item
            UiCtrl.clearInput();
        }

        e.preventDefault();
    };

    return {
        init: function(){
            const items = ItemCtrl.getItems();

            //Check if there are any items, if not call hideList and "hide" the style border of the list. If yes, call populateItemList
            if (items.length===0) {
                UiCtrl.hideList();
            } else {
                UiCtrl.populateItemList(items);
            }

           //Load Eventlisteners
           loadEventListeners();
        }
    }
    
})(ItemCtrl, UiCtrl);

//Initialize App

App.init();