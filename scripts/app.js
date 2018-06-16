//Storage Controller

//Item Controller
const ItemCtrl = (function(){
    //Item Constructor
    const Item = function (id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data structure / State

    const data = {
        items: [
            {id:0, name: "Steak Dinner", calories: 1200},
            {id:1, name: "Cookie", calories: 500},
            {id:2, name: "Salad", calories: 250},
        ],
        currentItem: null,
        totalCalories: 0
    }
    //Public methods
    return {
        getItems: function(){
            return data.items;
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
        addBtn:".add-btn"
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
    }

    //Add item submit
    const itemAddSubmit = function(e){


        e.preventDefault();
    }
    return {
        init: function(){
            const items = ItemCtrl.getItems();
           UiCtrl.populateItemList(items);

           //Load Eventlisteners
           loadEventListeners();
        }
    }
    
})(ItemCtrl, UiCtrl);

//Initialize App

App.init();