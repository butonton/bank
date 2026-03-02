// Функція створює "карту" користувача



// let arr = [1, 2, 3, 4];

// localStorage.setItem("myArray", JSON.stringify(arr));


// let savedArr = JSON.parse(localStorage.getItem("myArray"));

// console.log(savedArr);

function userCard(id){

    // Початковий баланс
    let balance = 100;

    if (localStorage.getItem(`balance-atlant`) != `null`) {
        balance = localStorage.getItem(`balance-atlant`)
    } else {
        let balance = 100;
    }
    
    // Ліміт операцій (максимальна сума за раз)
    let transactionLimit = 100;

    // Історія операцій
    let historyLogs = []; 


    let savedArr = JSON.parse(localStorage.getItem("historyLogs-atlant"));

    console.log(savedArr);

    if (savedArr != null) {
        historyLogs = savedArr;
         $(".operations").html("");
        for (let i = 0; i < historyLogs.length; i++) {
        $(".operations").append(`
            <div class="operation">
                <span class="nameOperation">
                    ${historyLogs[i].operationType}
                </span>
                <span class="amountOperation">
                    ${historyLogs[i].credits}$
                </span>
            </div>
        `);
    }
    }
    

    function updateSavesValue() {
        localStorage.setItem(`balance-atlant`, balance)
        localStorage.setItem(`transactionLimit-atlant`, transactionLimit)
        localStorage.setItem(`historyLogs-atlant`, JSON.stringify(historyLogs))

        
    }

    updateSavesValue()

    // Допоміжна функція для запису операцій в історію
    function recordOperations(type, value, time, setRecord){

    // максимум 3 операції
    if (historyLogs.length >= 3) {
        historyLogs.shift(); // видаляємо найстарішу
    }

    historyLogs.push({
        operationType: type,
        credits: value,
        operationTime: time
    });

    // очищаємо контейнер
    $(".operations").html("");

    // рендеримо історію
    if (setRecord == true) {
        for (let i = 0; i < historyLogs.length; i++) {
            $(".operations").append(`
                <div class="operation">
                    <span class="nameOperation">
                        ${historyLogs[i].operationType}
                    </span>
                    <span class="amountOperation">
                        ${historyLogs[i].credits}$
                    </span>
                </div>
            `);
        }
    }
    
}

    // Повертаємо об’єкт з методами карти
    return{

            

        // Отримати інформацію про карту
        getCardOptions(){
            return{
                id,
                balance,
                transactionLimit,
                historyLogs
            }
        },

        // Покласти гроші на карту
        putCredits(amount){
            if(amount <= transactionLimit){
                balance += amount;
                recordOperations('Поповнення', amount, new Date().toLocaleString(), true);
            }else{
                console.log('Exceeded the transaction limit');
            }
            updateSavesValue()
            updateData()
        },

        // Зняти гроші
        takeCredits(amount){
            if(amount <= transactionLimit){
                if(amount <= balance){
                    balance -= amount;
                    recordOperations('Зняття', amount, new Date().toLocaleString(), true);
                }else{
                    console.log('Not enough credits');
                }
            }else{
                console.log('Exceeded the transaction limit');
            }
            updateSavesValue()
            updateData()
        },

        mobileTopUp(amount){
            if(amount <= transactionLimit){
                if(amount <= balance){
                    balance -= amount;
                    recordOperations('Поповнення телефону', amount, new Date().toLocaleString(), true);
                }else{
                    console.log('Not enough credits');
                }
            }else{
                console.log('Exceeded the transaction limit');
            }
            updateSavesValue()
            updateData()
        },

        creatorTopUp(amount){
            if(amount <= transactionLimit){
                if(amount <= balance){
                    balance -= amount;
                    recordOperations('оплата за creator', amount, new Date().toLocaleString(), true);
                }else{
                    console.log('Not enough credits');
                }
            }else{
                console.log('Exceeded the transaction limit');
            }
            updateSavesValue()
            updateData()
        },

        // Змінити ліміт
        setTransactionLimit(amount){
            transactionLimit = amount;
            
            updateSavesValue()
            updateData()
        },

        // Переказ грошей на іншу карту
        transferCredits(amount, card){
            const TAX = 0.005; // комісія 0.5%
            let transferAmount = amount * TAX + amount;

            if(transferAmount <= transactionLimit){
                if(transferAmount <= balance){
                    this.takeCredits(transferAmount); // списуємо з комісією
                    card.putCredits(amount);          // отримувач отримує без комісії
                }else{
                    console.log('Not enough credits');
                }
            }else{
                console.log('Exceeded the transaction limit');
            }
            updateSavesValue()
            updateData()
        }   


        
    }

    
}

// кінець обєкта



// Клас користувача
class UserAcaunt{

    constructor(name, secondName){
        this.name = name;
        this.secondName = secondName; // ім’я користувача
        this.cards = [];  // список карт
        this.limit = 3;   // максимум 3 карти
    }

    // Додати карту
    addCard(){
        if(this.cards.length < this.limit){
            this.cards.push(new userCard(this.cards.length + 1));
        }else{
            console.log('Limit reached');
        }
    }
 
    // Отримати карту за індексом
    getCardByKey(key){
        return this.cards[key];
    }

    

}






let acauntRegistry = `false`;
let Acaunt;

let isRegistry = localStorage.getItem(`acauntRegistry-atlant`);


if (isRegistry == `true`) {
    let nameInMemory = localStorage.getItem(`name-atlant`) 
    let secondNameInMemory = localStorage.getItem(`secondName-atlant`)
    createAcaunt(nameInMemory, secondNameInMemory)
}

$(`#agreeAcaunt`).click(function() {
    if ($(`#name`).val() != "" && $(`#secondName`).val() != "") {

        createAcaunt($(`#name`).val(), $(`#secondName`).val())
        updateData()

    } else {
        $(`#errorName`).css(`display`, `block`)
    }
})


$(`.acauntBtn`).click(function() {
    $(`.backPanel`).addClass(`openPanel`)
    $(`.backPanel`).removeClass(`hidePanel`)
    $(`.closeZonePanel`).css(`display`, `flex`)

})

$(`.closeZonePanel`).click(function() {
    $(`.backPanel`).removeClass(`openPanel`)
    $(`.backPanel`).addClass(`hidePanel`)
    $(`.closeZonePanel`).css(`display`, `none`)
})



function createAcaunt(name, secondName) {
    Acaunt = new UserAcaunt(name, secondName)
    
    

    acauntRegistry = "true"

    
    localStorage.setItem("acauntRegistry-atlant", acauntRegistry)
    localStorage.setItem("name-atlant", Acaunt.name)
    localStorage.setItem("secondName-atlant", Acaunt.secondName)

    $(".logIn").css("display", "none")
    // $(".home").css("display", "flex")

    $("#firstNameFirstLetter").text(Acaunt.name[0])
    $("#secondNameFirstLetter").text(Acaunt.secondName[0])

    $("#firstNameFirstLetter1").text(Acaunt.name[0])
    $("#secondNameFirstLetter1").text(Acaunt.secondName[0])

    $("#firstNameUser").text(Acaunt.name)
    $("#secondNameUser").text(Acaunt.secondName)


    Acaunt.addCard()

    

    return Acaunt;
}



function updateData() {
    $(`#balanceVisual`).text(Acaunt.getCardByKey(0).getCardOptions().balance)

    
}

updateData()

// Acaunt.getCardByKey(0).putCredits(11)
// Acaunt.getCardByKey(0).putCredits(12)
// Acaunt.getCardByKey(0).putCredits(13)
// Acaunt.getCardByKey(0).putCredits(14)



$(`#mobileTopUp`).click(function() {
    $(`.home`).css(`display`, `none`);
    $(`.pagePayMobileTopUp`).css(`display`, `flex`);
    

})

$(`#agreePayMobileTopUp`).click(function() {
    $(`.home`).css(`display`, `flex`);
    $(`.pagePayMobileTopUp`).css(`display`, `none`);
    
    Acaunt.getCardByKey(0).mobileTopUp($(`#amountMobileTopUp`).val())
    
    
})

$(`#creatorTopUp`).click(function() {
    $(`.home`).css(`display`, `none`);
    $(`.pagePayCreatorTopUp`).css(`display`, `flex`);
    

})

$(`#agreePayCreatorTopUp`).click(function() {
    $(`.home`).css(`display`, `flex`);
    $(`.pagePayCreatorTopUp`).css(`display`, `none`);
    
    Acaunt.getCardByKey(0).creatorTopUp($(`#amountCreatorTopUp`).val())
    
    
})
    
$(`#logOutOfTheAccountBtn`).click(function() {
    
    localStorage.setItem("acauntRegistry-atlant", `false`)
    localStorage.setItem("balance-atlant", `null`)
    localStorage.setItem("historyLogs-atlant", `null`)
    
    $(`.home`).css(`display`, `none`)
    $(`.logIn`).css(`display`, `flex`)
})
