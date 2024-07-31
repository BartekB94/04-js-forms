See the live version of [Excursion loader](https://bartekb94.github.io/04-js-forms/)

This project is based on the use of forms, validation, adding and resetting data with JavaScipt

###   Features
- uploading and displaying excursions from .csv file [Example.csv](https://github.com/BartekB94/04-js-forms/blob/main/example.csv)
- user info validation
  

---

### Code Fragments

```
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
```

```
    const nameRegex = /^\s*[A-Za-z]+\s+[A-Za-z]+\s*$/;

    if(!nameRegex.test(nameValue)) {
        nameEl.style.borderColor = 'red'
        errorsArr.push('Podaj poprawne imię i nazwisko.')
    }
    if(!emailValue.includes('@')) {
        emailEl.style.borderColor = 'red'
        errorsArr.push('Podaj poprawny email, zawierający "@".')
    }
```


---

## 🙋‍♂️ Feel free to contact me
Write sth nice ;) Find me on   <a href="https://www.linkedin.com/in/bartekb94/" target="_blank">
    <img align="center" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank" />
  </a>

&nbsp;

## 👏 Thanks / Special thanks / Credits
Thanks to my [Mentor - devmentor.pl](https://devmentor.pl/) – for providing me with this task and for code review.

