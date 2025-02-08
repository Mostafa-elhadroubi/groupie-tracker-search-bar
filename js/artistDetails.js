const locationDiv = document.querySelector('#location')
const locationParent = document.querySelector('#locationParent')
const locationElement = locationDiv.textContent.split(" ")

const dateDiv = document.querySelector('#date')
const dateParent = document.querySelector('#dateParent')
const dateElement = dateDiv.textContent.split(' ')

const relationDiv = document.querySelector('#relation')
const relationParent = document.querySelector('#relationParent')
const relationElement = relationDiv.textContent.split(' ')
const goBack = document.querySelector('.btn')

// console.log(locationElement)
const ulLocation = document.createElement('ul')
locationElement.forEach(location => {
    const liLocation = document.createElement('li')
    liLocation.textContent = location
    ulLocation.appendChild(liLocation)
})
locationDiv.textContent = ''
locationParent.appendChild(ulLocation)



// console.log(dateElement)

const ulDate = document.createElement('ul')
dateElement.forEach(date => {
    const liDate = document.createElement('li')
    liDate.textContent = date
    ulDate.appendChild(liDate)
})
dateDiv.textContent = ''
dateParent.appendChild(ulDate)

const ulRelation = document.createElement('ul')
relationElement.forEach(relation => {
    const liRelation = document.createElement('li')
    if(relation.includes('map[')){
        liRelation.textContent = relation.slice(4)
    }else {
        liRelation.textContent = relation
    }
    ulRelation.appendChild(liRelation)
})
relationDiv.textContent = ''
relationParent.appendChild(ulRelation)
// console.log(relationElement)

goBack.addEventListener('click', () => {
    window.location.href = '/'
})