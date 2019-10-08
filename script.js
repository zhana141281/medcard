const mainButton = document.querySelector('.create-visit');//главная кнопка "Создать визит"
const select = document.querySelector('.select');// Выбор врача
const visitorName = document.getElementById('fullname-input');//ФИО пациента
const target = document.getElementById('target-input');//Цель визита
const nextVisit = document.getElementById('next-visit-input');//Дата следующего визита
const illnessList = document.getElementById('illness-input');//Список перенесенных заболеваний
const lastVisit = document.getElementById('last-visit-input');//Дата последнего визита
const weighClient = document.getElementById('weight-input');//Индекс массы тела
const ageClient = document.getElementById('age-input');//Возраст пациента
const comment = document.getElementById('comment-input');//Комментарии
const modalButton = document.querySelector('.btn-modal');//Кнопка "Создать визит" на модальном окне
const modalCrossButton = document.querySelector('.cross'); //кнопка-крестик на модальном окне
const pressureValue = document.getElementById('pressure-input'); //давление
const modalWindow = document.querySelector('.modal'); //Модальное окно
const inputFields = document.querySelectorAll('.field-for-doctors'); //Инпуты
const labelForNextVisit = document.getElementById('label-for-next-visit'); //Лейбл для следующего визита
const labelForLastVisit = document.getElementById('label-for-last-visit'); // Лейбл для последнего визита

let visits=[],
    board = document.querySelector('.board-container'),
    newCard;

window.onload = checkVisits(visits);
window.onload = function(){
    checkLocalStorage();
};

class Visit {
    constructor(doctor, visitDate, fullName, visitTarget, visitID, comments) {
        this._doctor = doctor;
        this._visitDate = visitDate;
        this._fullname = fullName;
        this._visitTarget = visitTarget;
        this._visitId = visitID;
        this._comments = comments;
        this._newCard = document.createElement('div');
        this._showMoreButton = document.createElement('button');
        this._p = document.createElement('p');
        this._span = document.createElement('span');
        this._board = document.querySelector('.board-container');
        this._savePlaceDiv = document.createElement('div');
        this._savePlaceDiv.className = 'save-place-div';
        this._savePlaceDiv.setAttribute('data-visitId', this._visitId);
    }

    get visitId() {
        return this._visitId;
    }
    get savePlaceDiv(){
        return this._savePlaceDiv;
    }

    createNewCard() {
        this._p.className = 'name-of-field';

        let nameField = this._p.cloneNode(),
            doctorField = this._p.cloneNode(),
            visitField = this._p.cloneNode();

        this._newCard.setAttribute('data-visitId', this._visitId);
        this._newCard.setAttribute('draggable', 'true');
        this._newCard.className = 'visiting-card';
        this._showMoreButton.className = 'show-more ';
        this._span.className = 'close';
        this._span.innerHTML = '<i class="fas fa-times"></i>';
        this._showMoreButton.innerText = "Показать больше";

        nameField.innerHTML = `ФИО:&nbsp${this._fullname}`;
        doctorField.innerHTML = `Врач:&nbsp${this._doctor}`;
        visitField.innerHTML = `Дата визита:&nbsp${this._visitDate}`;

        this._newCard.appendChild(this._span);
        this._newCard.appendChild(nameField);
        this._newCard.appendChild(doctorField);
        this._newCard.appendChild(visitField);
        this._newCard.appendChild(this._showMoreButton);
        return this._newCard;
    }

    dragManager() {
        let card = this._newCard;
        let board = this._board;
        let savePlaceDiv = this._savePlaceDiv;


        function zIndexCount() {
            let index = 0;
            return function () {
                index++;
                return index
            }
        }

        const zIndex = zIndexCount();
        moveCard(card);

        function moveCard(card) {
            let dragStart = false;
            card.onmousedown = function (e) {
                card.style.zIndex = zIndex();
                card.style.left = getCoords(card).left - getCoords(board).left + 'px';
                card.style.top = getCoords(card).top - getCoords(board).top + 'px';
                card.style.position = 'absolute';
                if (!dragStart) {
                    savePlaceDiv.style.width = card.offsetWidth + 'px';
                    savePlaceDiv.style.height = card.offsetHeight + 'px';
                    board.insertBefore(savePlaceDiv, card);
                    dragStart = true
                }
                let cardCoords = getCoords(card);
                let shiftX = e.pageX - cardCoords.left;
                let shiftY = e.pageY - cardCoords.top;
                let boardCoords = getCoords(board);

                document.onmousemove = function (e) {
                    let newLeft = e.pageX - shiftX - boardCoords.left;
                    let newTop = e.pageY - shiftY - boardCoords.top;

                    if (newLeft < 0) {
                        newLeft = 0;
                    }
                    let rightEdge = board.offsetWidth - card.offsetWidth;
                    if (newLeft > rightEdge) {
                        newLeft = rightEdge;
                    }
                    if (newTop < 0) {
                        newTop = 0;
                    }
                    let topEdge = board.offsetHeight - card.offsetHeight;
                    if (newTop > topEdge) {
                        newTop = topEdge;
                    }
                    card.style.left = newLeft + 'px';
                    card.style.top = newTop + 'px';
                };
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };

                return false;
            };

            card.ondragstart = function () {
                return false;
            };

            function getCoords(elem) {
                let box = elem.getBoundingClientRect();
                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };
            }
        }
    }
}

class VisitToCardiologist extends Visit {
    constructor(doctor, visitDate, fullName, visitTarget, visitID, pressure, weightIndex, age, illnesses, comments) {
        super(doctor, visitDate, fullName, visitTarget, visitID, comments);
        this._pressure = pressure;
        this._weightIndex = weightIndex;
        this._age = age;
        this._illnesses = illnesses;
    }
  showMore() {
      this._showMoreButton.addEventListener('click', () => {
          this._showMoreButton.style.display = 'none';
         let  targetField = this._p.cloneNode(),
              pressureField = this._p.cloneNode(),
              weightField = this._p.cloneNode(),
              illnessesField = this._p.cloneNode(),
              ageField = this._p.cloneNode(),
              comments = this._p.cloneNode();

          targetField.innerHTML = `Цель визита:&nbsp${this._visitTarget}`;
          pressureField.innerHTML = `Давление:&nbsp${this._pressure}`;
          weightField.innerHTML = `Вес:&nbsp${this._weightIndex}`;
          illnessesField.innerHTML = `Болезни:&nbsp${this._illnesses}`;
          ageField.innerHTML = `Возраст:&nbsp${this._age}`;
          comments.innerHTML = `Комментарии:&nbsp${this._comments}`;

          this._newCard.insertBefore(ageField, this._showMoreButton);
          this._newCard.insertBefore(illnessesField, this._showMoreButton);
          this._newCard.insertBefore(weightField, this._showMoreButton);
          this._newCard.insertBefore(pressureField, this._showMoreButton);
          this._newCard.insertBefore(targetField, this._showMoreButton);
          this._newCard.insertBefore(comments, this._showMoreButton);

      })
  }
}

class VisitToDentist extends Visit {
    constructor(doctor, visitDate, fullName, visitTarget, visitID, lastVisitDate, comments) {
        super(doctor, visitDate, fullName, visitTarget, visitID, comments);
        this._lastVisitDate = lastVisitDate;
    }

    showMore() {
        this._showMoreButton.addEventListener('click', () => {
            this._showMoreButton.style.display = 'none';
            let targetField = this._p.cloneNode(),
                lastVisitDateField = this._p.cloneNode(),
                comments = this._p.cloneNode();

            targetField.innerHTML = `Цель визита:&nbsp${this._visitTarget}`;
            lastVisitDateField.innerHTML = `Дата последнего визита:&nbsp${this._lastVisitDate}`;
            comments.innerHTML = `Комментарии:&nbsp${this._comments}`;
            this._newCard.insertBefore(lastVisitDateField, this._showMoreButton);
            this._newCard.insertBefore(targetField, this._showMoreButton);
            this._newCard.insertBefore(comments, this._showMoreButton);
        })
    }
}

class VisitToTherapist extends Visit {
    constructor(doctor, visitDate, fullName, visitTarget, visitID, age, comments) {
        super(doctor, visitDate, fullName, visitTarget, visitID, comments);
        this._age = age;
    }
    showMore() {
        this._showMoreButton.addEventListener('click', () => {
            this._showMoreButton.style.display = 'none';
            let targetField = this._p.cloneNode(),
                ageField = this._p.cloneNode(),
                comments = this._p.cloneNode();

            targetField.innerHTML = `Цель визита:&nbsp${this._visitTarget}`;
            ageField.innerHTML = `Возраст:&nbsp${this._age}`;
            comments.innerHTML = `Комментарии:&nbsp${this._comments}`;
            this._newCard.insertBefore(ageField, this._showMoreButton);
            this._newCard.insertBefore(targetField, this._showMoreButton);
            this._newCard.insertBefore(comments, this._showMoreButton);
        })
    }
}

mainButton.addEventListener('click',function () {
    modalWindow.classList.add('active');
    fieldsReset();
});

select.addEventListener('change',function () {
    fieldsReset();
});

modalCrossButton.addEventListener ('click',function () {
    modalWindow.classList.remove('active')
});

modalButton.addEventListener('click', function (e) {
    e.preventDefault();
    let selectIndex = select.selectedIndex,
        doctor = select.options[selectIndex].value,
        visitDate = nextVisit.value,
        visitTarget = target.value,
        fullName = visitorName.value,
        illnesses = illnessList.value,
        lastVisitDate = lastVisit.value,
        age = ageClient.value,
        weightIndex = weighClient.value,
        pressure = pressureValue.value,
        commentText = comment.value,
        visitID = Date.now(),
        board = document.querySelector('.board-container'),
        newVisit,
        newCard;

    switch (selectIndex) {
        case(0):
            if(!validation(doctor, visitDate, fullName, visitTarget, pressure, weightIndex, age, illnesses, commentText)){
                newVisit = new VisitToCardiologist(doctor, visitDate, fullName, visitTarget, visitID, pressure, weightIndex, age, illnesses, commentText);
                createNewVisit(newVisit);
            }
            else {
                alert('Заполните пожалуйста все поля');
            }
            break;
        case(1):
            if(!validation(doctor, visitDate, fullName, visitTarget,lastVisitDate, commentText)){
                newVisit = new VisitToDentist(doctor, visitDate, fullName, visitTarget, visitID, lastVisitDate, commentText);
                createNewVisit(newVisit);
            }
            else {
                alert('Заполните пожалуйста все поля');
            }

            break;
        case(2):
            if(!validation(doctor, visitDate, fullName, visitTarget,age, commentText)){
                newVisit = new VisitToTherapist(doctor, visitDate, fullName, visitTarget, visitID, age, commentText);
                createNewVisit(newVisit);
            }
            else {
                alert('Заполните пожалуйста все поля');
            }

            break;
    }

    const closeCards = document.querySelectorAll('.close');
    closeCards.forEach((closeCard)=>
        closeCard.onclick = function(e){
            console.log('closeCard onclick applied');
            removeVisit(e);



    }
    );
    checkVisits(visits);

});
function checkLocalStorage() {

    let localStorageVisits = localStorage.getItem('localVisits');
    if (localStorageVisits === null) {
        console.log('No saved Visits on Local Storage');
    } else {
        let parsedVisits = JSON.parse(localStorageVisits);
        console.log('Visits in local storage: ', parsedVisits);
        parsedVisits.forEach(function (savedVisit) {
            switch (savedVisit._doctor) {
                case("кардиолог"):
                    savedVisit = new VisitToCardiologist(savedVisit._doctor, savedVisit._visitDate, savedVisit._fullname, savedVisit._visitTarget, savedVisit._visitId, savedVisit._pressure, savedVisit._weightIndex, savedVisit._age, savedVisit._illnesses, savedVisit._comments);
                    createNewVisit(savedVisit);
                    break;

                case("стоматолог"):
                    savedVisit = new VisitToDentist(savedVisit._doctor, savedVisit._visitDate, savedVisit._fullname, savedVisit._visitTarget, savedVisit._visitId, savedVisit._lastVisitDate, savedVisit._comments);
                    createNewVisit(savedVisit);
                    break;

                case("терапевт"):
                    savedVisit = new VisitToTherapist(savedVisit._doctor, savedVisit._visitDate, savedVisit._fullname, savedVisit._visitTarget, savedVisit._visitId, savedVisit._age,savedVisit._comments);
                    createNewVisit(savedVisit);
                    break;
            }

            console.log(savedVisit);
            const closeCards = document.querySelectorAll('.close');
            closeCards.forEach((closeCard)=>
                closeCard.onclick = function(e){
                    removeVisit(e);
                }
            );
            checkVisits(visits);
        });
    }
}

function fieldsReset() {
    inputFields.forEach(function (element) {
        element.style.display = 'none';
    });
    switch (select.selectedIndex) {
        case(0):
            target.style.display = 'block';
            pressureValue.style.display = 'block';
            weighClient.style.display = 'block';
            illnessList.style.display = 'block';
            ageClient.style.display = 'block';
            visitorName.style.display = 'block';
            labelForNextVisit.style.display = 'block';
            nextVisit.style.display = 'block';
            comment.style.display = 'block';
            modalButton.style.display = 'inline-block';
            break;
        case(1):
            target.style.display = 'block';
            labelForLastVisit.style.display = 'block';
            lastVisit.style.display = 'block';
            visitorName.style.display = 'block';
            labelForNextVisit.style.display = 'block';
            nextVisit.style.display = 'block';
            comment.style.display = 'block';
            modalButton.style.display = ' inline-block';
            break;
        case(2):
            visitorName.style.display = 'block';
            labelForNextVisit.style.display = 'block';
            nextVisit.style.display = 'block';
            ageClient.style.display = 'block';
            target.style.display = 'block';
            comment.style.display = 'block';
            modalButton.style.display = 'inline-block';
            break;
    }
}

function addVisit(visitObj){
    visits.push(visitObj);
    console.log(visits);
}

function checkVisits(visits) {
    console.log('function check visits apllied');
    const noVisitsText = document.querySelector('.no-visit');
    if(visits.length===0){
        noVisitsText.classList.add('active');
    }else{
        noVisitsText.classList.remove('active');
    }
}

function pushVisitsToLocalStorage(visits) {
    if(visits.length>0){
        let localStorageVisits = JSON.stringify(visits);
        localStorage.setItem('localVisits',localStorageVisits);
    }else{
        localStorage.clear();
    }
}

function removeVisit(e) {
    console.log('function remove Visit applied');
    let visitingCardID = e.target.parentNode.parentNode.dataset.visitid;
    console.log('card ID to remove: ', visitingCardID);
    let visitObjToRemove= document.querySelector(`.visiting-card[data-visitid="${visitingCardID}"]`);
    let savePlaceDivToRemove = document.querySelector(`.save-place-div[data-visitid="${visitingCardID}"]`);
    console.log('savePlaceDivToRemove: ',savePlaceDivToRemove);
    console.log('card in DOM to remove ', visitObjToRemove);
    let removeIndex = visits.findIndex((e)=>{
        return e.visitId === +visitingCardID;
    });
    console.log('index in array to remove',removeIndex);
    visits.splice(removeIndex, 1);
    console.log('visits Array after Remove Visits func',visits);
    checkVisits(visits);
    visitObjToRemove.remove();
    savePlaceDivToRemove.remove();
}

function validation(...arg) {
    return  arg.some((item)=>
        item === ''
    );

}

function createNewVisit(newVisit){
    newCard = newVisit.createNewCard();
    board.appendChild(newCard);
    newVisit.showMore();
    addVisit(newVisit);
    console.log(newVisit);
    modalWindow.reset();
    modalWindow.classList.remove('active');
    newVisit.dragManager();

}

window.addEventListener('beforeunload',()=>{
    pushVisitsToLocalStorage(visits);
});

