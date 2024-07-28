const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log( txt.split(/[\r\n]+/gm) );

const uploadInputEl = document.querySelector('.uploader__input');
const orderFormEl = document.querySelector('.panel__order');
const orderFormSubmitBtn = document.querySelector('.order__field-submit')
const panelSummaryListEl = document.querySelector('.panel__summary');
const excursionsList = document.querySelector('.excursions')
const basketRemoveBtnEl = document.querySelector('.panel__basket-remove-button')
const panelBasketEl = document.querySelector('.panel__basket');
const panelEl = document.querySelector('.panel')
const orderTotalPriceEl = document.querySelector('.order__total-price-value')
orderTotalPriceEl.textContent = '';

let excursionObj = {}

uploadInputEl.addEventListener('change', function (e) {

    const fr = new FileReader();
    fr.readAsText(uploadInputEl.files[0])
    fr.onload = function () {
        const csv = fr.result
        const csvSplitted = csv.split(/[\r\n]+/gm).map(function (line) {
            return line.split('","')
        })                  

        csvSplitted.forEach(function (array) {
            const excursionItem = document.querySelector('.excursions__item')
            const excursionsList = document.querySelector('.panel__excursions')
            createExcursion(excursionItem, excursionsList, array)
        })
    }
})

excursionsList.addEventListener('submit', function(e) {
    e.preventDefault()

    const inputAdultEl = e.target.elements.adults
    const inputAdultValue = Number(inputAdultEl.value)
    const adultPriceValue = Number(inputAdultEl.previousElementSibling.textContent)
    inputAdultEl.style.borderColor = '';

    const inputChildrenEl = e.target.elements.children
    const inputChildrenValue = Number(inputChildrenEl.value)
    const childrenPriceValue = Number(inputChildrenEl.previousElementSibling.textContent)

    const excTitle = e.target.parentElement.querySelector('.excursions__title').textContent

    if(inputAdultValue === 0) {
        inputAdultEl.style.borderColor = "red"
    } else {
        prepareExcursion(excTitle, inputAdultValue, adultPriceValue, inputChildrenValue, childrenPriceValue)
        const summaryItem = document.querySelector('.summary__item')
        const summaryList = document.querySelector('.panel__summary')
        createSummary(summaryItem, summaryList, excursionObj)
        calculateTotalCost(summaryItem)
        inputAdultEl.value = ''
        inputChildrenEl.value = ''
    }
})

orderFormEl.addEventListener('submit', function(e) {
    e.preventDefault()

    const nameEl = e.target.elements.name;
    const nameValue = nameEl.value
    nameEl.style.borderColor = ''
    const emailEl = e.target.elements.email;
    const emailValue = emailEl.value
    emailEl.style.borderColor = ''
    const totalPriceEl = document.querySelector('.order__total-price-value')
    const totalPriceValue = totalPriceEl.textContent;
    const errorsListEl = document.querySelector('.validation__errors-list');
    const errorsArr = []

    while (errorsListEl.firstChild) {
        errorsListEl.removeChild(errorsListEl.firstChild);
    }

    const nameRegex = /^\s*[A-Za-z]+\s+[A-Za-z]+\s*$/;

    if(!nameRegex.test(nameValue)) {
        nameEl.style.borderColor = 'red'
        errorsArr.push('Podaj poprawne imię i nazwisko.')
    }
    if(!emailValue.includes('@')) {
        emailEl.style.borderColor = 'red'
        errorsArr.push('Podaj poprawny email, zawierający "@".')
    }
    if(errorsArr.length > 0) {
        errorsArr.forEach(error => {
            const errorEl = document.createElement('li')
            errorEl.textContent = error
            errorEl.style.color = 'red'
            errorsListEl.appendChild(errorEl)
        })
    }else {
        createBasket(nameValue, emailValue, totalPriceValue)
        nameEl.value = ''
        emailEl.value = ''
        totalPriceEl.textContent = ''

        const removeButtonsList = document.querySelectorAll('li:not(.summary__item--prototype) .summary__btn-remove i')
        removeButtonsList.forEach(function(el) {
            el.click()
        })

        panelEl.classList.add('hide-panel')
    }
})

panelSummaryListEl.addEventListener('click', function(e) {
    e.preventDefault()
    if(e.target.parentElement.classList.contains('summary__btn-remove')) {
        const nodeToRemove = e.target.closest('.summary__item');
        if (nodeToRemove) {
            nodeToRemove.remove();
            calculateTotalCost();
        }
    }
})

basketRemoveBtnEl.addEventListener('click', function(e) {
    if(basketRemoveBtnEl) {
        panelEl.classList.remove('hide-panel')
        panelBasketEl.classList.remove('basket')
        excursionObj = {}
    }
})

function prepareExcursion(exTitle, adultNum, adultPrice, childrenNum, childrenPrice) {
    excursionObj.title = exTitle
    excursionObj.adultNumber = adultNum
    excursionObj.adultPrice = adultPrice
    excursionObj.childrenNumber = childrenNum
    excursionObj.childrenPrice = childrenPrice
}

function createBasket(name, email, price) {
    panelBasketEl.classList.add('basket')

    const userName = panelBasketEl.querySelector('.panel__basket-name')
    userName.textContent = name

    const userEmail = panelBasketEl.querySelector('.panel__basket-email')
    userEmail.textContent = email

    const totalPrice = panelBasketEl.querySelector('.panel__basket-price-value')
    totalPrice.textContent = `${price}`
}

function createExcursion(nodeToClone, parentToAppend, csvArray) {
    const newExcursion = nodeToClone.cloneNode(true)
    newExcursion.classList.remove("excursions__item--prototype")
    const excTitle = newExcursion.querySelector('.excursions__title')
    excTitle.textContent = csvArray[1];

    const excDesc = newExcursion.querySelector('.excursions__description')
    excDesc.textContent = csvArray[2];

    const excPriceAdultEl = newExcursion.querySelector('input[name="adults"]')
    excPriceAdultEl.setAttribute('type', 'number')
    excPriceAdultEl.setAttribute('min', '0')
    const excPriceAdult = excPriceAdultEl.previousElementSibling
    excPriceAdult.textContent = csvArray[3]

    const excPriceChildrenEl = newExcursion.querySelector('input[name="children"]')
    excPriceChildrenEl.setAttribute('type', 'number')
    excPriceChildrenEl.setAttribute('min', '0')
    const excPriceChildren = excPriceChildrenEl.previousElementSibling
    const clearString = csvArray[4].split('"')
    excPriceChildren.textContent = clearString[0]
    
    parentToAppend.appendChild(newExcursion)
}

function createSummary(nodeToClone, parentToAppend, excObj) {
    const title = excObj.title
    const adultNum = excObj.adultNumber
    const adultPrice = excObj.adultPrice
    const childrenNum = excObj.childrenNumber
    const childrenPrice = excObj.childrenPrice
    const newSummary = nodeToClone.cloneNode(true)
    newSummary.classList.remove('summary__item--prototype')

    const summaryName = newSummary.querySelector('.summary__name')
    summaryName.textContent = title

    const summaryTotalPrice = newSummary.querySelector('.summary__total-price')
    const totalPriceValue = calculateExcursionCost(excObj)
    summaryTotalPrice.textContent = `${totalPriceValue}PLN`

    const summaryPrices = newSummary.querySelector('.summary__prices')
    summaryPrices.textContent = `dorośli: ${adultNum} x ${adultPrice}PLN, dzieci: ${childrenNum} x ${childrenPrice}PLN`

    parentToAppend.appendChild(newSummary)
}

function calculateExcursionCost(indexOfObjInArray) {
    const adultCostNumber = indexOfObjInArray.adultNumber * indexOfObjInArray.adultPrice;
    const childrenCost = indexOfObjInArray.childrenNumber * indexOfObjInArray.childrenPrice;
    return adultCostNumber + childrenCost;
}

function calculateTotalCost() {
    const sumItemsList = document.querySelectorAll('.summary__item');
    let sumPrice = 0;
    sumItemsList.forEach(function(item) {
        if(!item.classList.contains('summary__item--prototype')) {
            const price = parseInt(item.querySelector('.summary__total-price').textContent)
            sumPrice += price;
        }
    })
    const totalPriceEl = document.querySelector('.order__total-price-value');
    totalPriceEl.textContent = `${sumPrice}PLN`;
}