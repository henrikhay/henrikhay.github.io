//Henter objekter fra DOM
const toggleBtn = document.querySelector('.toggle-btn')
const toggleBtnIcon = document.querySelector('.toggle-btn i')
const dropDownMenu = document.querySelector('.dropdown-menu')


//Funksjon som lytter etter trykk på nedtrekksmenyknappen
toggleBtn.onclick = function(){
    dropDownMenu.classList.toggle('open') //Legger til og fjerner klassen open til nedtrekksmenyen
    const isOpen = dropDownMenu.classList.contains('open') 

    //Hvis dropdown menyen er åpen, så skal ikonet bytte til x, hvis den ikker er åpen skal den gå tilbake til streker. 
    toggleBtnIcon.classList = isOpen
      ? 'fa-solid fa-xmark'
      : 'fa-solid fa-bars' 
}