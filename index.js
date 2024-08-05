var groups = document.getElementById("groups")
var inputStructure = document.getElementById("structure_input")
var inputAmount = document.getElementById("amount_input")
var genButton = document.getElementById("generate")
var addGroupButton = document.getElementById("group_add_btn")
var addGroupLetterInput = document.getElementById("group_add_letter_input")
var addGroupAliasInput = document.getElementById("group_add_alias_input")
var output = document.getElementById("output")




function addGroup(letter, alias, initialValue="") {
    groups.insertAdjacentHTML(
        'beforeend', 
        `
        <span>
            <span>
                ${alias}: (${letter})
            </span>
            <textarea class="field" id="${letter}-input">${initialValue}</textarea>
        </span>
        `
    )
}

addGroup(
    "V", 
    "Vowels",
    "a, e, i, o, u"
)

addGroup(
    "C", 
    "Consonants",
    "b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, z"
)

addGroupButton.onclick = () => {
    addGroup(
        addGroupLetterInput.value,
        addGroupAliasInput.value
    )
}



function randomItem(array) {
    let index = Math.floor(
        Math.random()*array.length
    )

    return array[index]
}

function randInt(range1, range2) {
    let range = range2 - range1

    let rand = Math.round(
        Math.random() * range
    )

    return rand + range1
}



function generateOne() {
    let structure = inputStructure.value.split(",")
    let result = ""

    for (let s of structure) {
        console.log(s)

        fragment = randomItem(s.split("/"))
        marker = s[1]

        let group = document.getElementById(`${s}-input`)
        if (group) {
            result += randomItem(
                group.value.split(", ")
            )
        } else {
            result += fragment
        }
    }

    return result
}

function generateAll() {
    let iterations = parseInt(inputAmount.value)
    let iter = 0

    output.innerHTML = ""

    while (iter < (iterations+1)) {
        output.innerHTML += generateOne() + "<br>"

        iter += 1
    }
}

genButton.onclick = generateAll
generateAll()