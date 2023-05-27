const fs = require('fs')
var toys = require('../data/toy.json')
const { log } = require('console')

let pages
const PAGE_SIZE = 5

function query(filterBy = {}, sortBy) {
    let toysToDisplay = toys
    if (filterBy.name) {
        const regExp = new RegExp(filterBy.name, 'i')
        toysToDisplay = toysToDisplay.filter((toy) => regExp.test(toy.name))
    }
    if (filterBy.inStock && filterBy.inStock !== 'all') {
        toysToDisplay = toysToDisplay.filter((toy) => filterBy.inStock === toy.inStock)
    }
    if (filterBy.labels && filterBy.labels.length > 0) {
        toysToDisplay = toysToDisplay.filter((toy) => {
            return filterBy.labels.every((label) => toy.labels.includes(label))
        })
    }
    if (sortBy) _getSortedToys(toysToDisplay, sortBy)
    if (filterBy.pageIdx !== undefined)  {
        console.log('hi')
        pages = Math.ceil(toysToDisplay.length / PAGE_SIZE)
       if (filterBy.pageIdx + 1 < pages || filterBy.pageIdx > 0) {
           const startIdx = filterBy.pageIdx * PAGE_SIZE
           toysToDisplay = toysToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
       }
    }
    return Promise.resolve({toysToDisplay, pages})
}

function get(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found!')
    return Promise.resolve(toy)
    // return Promise.resolve({toy, msgs: ['Hello!','I would like to complain', 'My name is Keren']})
}

function remove(toyId, loggedinUser) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No Such Toy')
    const toy = toys[idx]
    // if (toy.owner._id !== loggedinUser._id) return Promise.reject('Not your toy')
    toys.splice(idx, 1)
    return _saveToysToFile()

}

function save(toy, loggedinUser) {
    if (toy._id) {
        const toyToUpdate = toys.find(currToy => currToy._id === toy._id)
        // if (toyToUpdate.owner._id !== loggedinUser._id) return Promise.reject('Not your toy')
        toyToUpdate.name = toy.name
        toyToUpdate.price = toy.price
        toyToUpdate.labels = toy.labels
        toyToUpdate.inStock = toy.inStock
    } else {
        toy._id = _makeId()
        // toy.owner = loggedinUser
        toy.createdAt = Date.now()
        toys.push(toy)
    }

    return _saveToysToFile().then(() => toy)
    // return Promise.resolve(toy)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {

        const toysStr = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', toysStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

function _getSortedToys(toysToDisplay, sortBy) {
    console.log('entered sorting')
    toysToDisplay.sort(
        (t1, t2) => {
            const value1 = t1[sortBy.type]
            const value2 = t2[sortBy.type]
            return sortBy.desc * (typeof value1 === 'string' && typeof value2 === 'string' ? value2.localeCompare(value1) : value2 - value1)
        }
    )
}

module.exports = {
    query,
    get,
    remove,
    save
}