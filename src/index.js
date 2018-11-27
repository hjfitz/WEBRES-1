// things overcome:
// window scroll position
// adding style to elements in the DOM - have to add to the DOM and then add style
// Add all methods in IIFE so as to not mess with window
// body not rendering everything and thus having to do different rounds - having to wait for render
// as well as links, need to find elements with event listeners to simulate a click
import nlp from 'compromise'
import Recognition from './Recognition'

const listeners = []
const original = EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener = function addEventListener(...args) {
    console.log('invoked')
    listeners.push({
        node: this,
        type: args[0],
    })
    return original.apply(this, args)
}

let round = 0
const maxRounds = 5
let roundInterval
let scrollListener
let mouseListener

function h(type, content = '', classList) {
    const elem = document.createElement(type)
    elem.textContent = content
    classList ? elem.classList = classList : void 0
    return elem
}

const normaliseProp = prop => Number(prop.replace('px', ''))

const throttle = (func, limit) => {
    let inThrottle
    return function throttledCallback(...args) {
        const context = this
        if (!inThrottle) {
            func.apply(context, args)
            inThrottle = true
            setTimeout(() => { inThrottle = false }, limit)
        }
    }
}

function highlightLinks() {
    [...document.querySelectorAll('.webres-injected-link')].forEach(elem => document.body.removeChild(elem));
    [...document.getElementsByTagName('a')].forEach((link, idx) => {
        const elem = h('span', '', 'webres-injected-link')
        elem.appendChild(h('p', idx + 1))
        elem.dataset.linkIndex = (idx + 1)
        elem.dataset.link = link // by assigning <a> to dataset, implicitly pull out href
        const rect = link.getBoundingClientRect()
        const style = getComputedStyle(link)
        const padTop = normaliseProp(style.getPropertyValue('padding-top'))
        const padLeft = normaliseProp(style.getPropertyValue('padding-left'))
        const left = ((rect.x - 5) - padTop) + window.scrollX
        const top = ((rect.y - 10) - padLeft) + window.scrollY
        document.body.appendChild(elem)
        elem.setAttribute('style', `left:${left}px; top:${top}px; `)
    })
}

function clickLink(number) {
    const [elem] = document.querySelectorAll(`[data-link-index='${number}']`)
    if (elem) window.location = elem.dataset.link
}

function phasedHighlight() {
    round += 1
    if (round === maxRounds) return clearInterval(roundInterval)
    highlightLinks()
}

function contains(word) {
    return this.transcript.indexOf(word) > -1
}

function checkClick(result) {
    const verbs = ['click', 'open', 'launch', 'go to', 'goto']
    const { transcript } = result
    verbs.forEach((verb) => {
        if (result.contains(verb)) { // && result.contains('link')) {
        // if (transcript.indexOf(`${verb}`) > -1 && transcript.indexOf('link')) {
            const parsed = nlp(transcript).values().toNumber().out()
            clickLink(Number(parsed.trim()))
        }
    })
}

function checkNav(transcript) {
    if (transcript.contains('go back') || transcript.contains('go backward')) return window.history.go(-1)
    if (transcript.contains('go forward')) return window.history.go(1)
}


function main() {
    setTimeout(highlightLinks, 100)
    scrollListener = window.addEventListener('scroll', (highlightLinks))// , 50))
    mouseListener = window.addEventListener('mouseup', throttle(highlightLinks, 50))

    const speech = new Recognition()

    speech.addEventListener('interim', (result) => {
        console.log(result.transcript)
        result.contains = contains.bind(result)
        // console.log(transcript)
        checkClick(result)
        checkNav(result)
    })
}

setTimeout(main, 100)
