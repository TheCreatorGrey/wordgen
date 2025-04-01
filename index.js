const save_config_button = document.getElementById("save_config");
const load_config_button = document.getElementById("load_config");
const file_input = document.getElementById('file_input');

const groups = document.getElementById("groups");
const structure_input = document.getElementById("structure_input");
const amount_input = document.getElementById("amount_input");
const generate_button = document.getElementById("generate");
const add_group_button = document.getElementById("group_add_btn");
const group_add_letter_input = document.getElementById("group_add_letter_input");
const group_add_alias_input = document.getElementById("group_add_alias_input");
const output = document.getElementById("output");

// This was a small side project and more or less thrown together.
// I will probably improve the code more later.

function exportJSON(obj, file_name) {
    let url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    let link = document.createElement('a');
    link.href = url;
    link.download = file_name;
    document.body.appendChild(link);
    link.click();
    link.remove();
}


var group_obj = {};
function addGroup(letter, alias, initialValue="") {
    if (!(letter in group_obj)) {
        let group = document.createElement("span");
        groups.appendChild(group);

        let text = document.createElement("span");
        text.innerText = `${alias}: (${letter})`;
        group.appendChild(text);

        let input = document.createElement("textarea");
        input.className = "field";
        input.id = `${letter}-input`;
        input.value = initialValue;
        group.appendChild(input);


        group_obj[letter] = {
            input: input,
            alias: alias
        }
    }
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



add_group_button.onclick = () => {
    addGroup(
        group_add_letter_input.value,
        group_add_alias_input.value
    )
}



function randomItem(array) {
    let index = Math.floor(
        Math.random()*array.length
    );

    return array[index];
}

function randInt(range1, range2) {
    let range = range2 - range1;

    let rand = Math.round(
        Math.random() * range
    );

    return rand + range1;
}



function generateOne() {
    // Separate structure input by commas
    let structure = structure_input.value.split(/,\s*/);
    let result = "";

    for (let item of structure) {
        // Pick a random item from between the slashes in
        // the item, if any
        let chosen = randomItem(item.split("/"));

        let group = document.getElementById(`${chosen}-input`);
        if (group) {
            // If the first letter of the fragment matches a group letter,
            // pick a random value from that group
            result += randomItem(
                group.value.split(/,\s*/)
            )
        } else {
            // Otherwise, interpret literally
            result += chosen;
        }
    }

    return result
}

function generateAll() {
    let iterations = parseInt(amount_input.value);
    let iter = 0;

    let taken = [];

    output.innerHTML = ""

    while (iter < (iterations+1)) {
        let word = generateOne();

        if (!taken.includes(word)) {
            taken.push(word);
            output.innerHTML += word + "<br>"
        }

        iter += 1
    }
}

generate_button.onclick = generateAll;
generateAll();

function save_config() {
    let data = {};

    data.structure = structure_input.value;
    data.gencount = amount_input.value;
    data.groups = {};

    for (let letter in group_obj) {
        let group = group_obj[letter];

        data.groups[letter] = {
            alias:group.alias,
            value:group.input.value
        };
    }

    console.log(data)
    exportJSON(data, "configuration.wgfc")
}

save_config_button.onclick = save_config;




load_config_button.onclick = () => {
    file_input.click()
}

file_input.onchange = () => {
    if (file_input.files.length > 0) {
        var file = file_input.files[0];
        
        var reader = new FileReader();
  
        reader.onload = function(e) {
            let content = e.target.result;
            let json = JSON.parse(content);

            amount_input.value = json.gencount;
            structure_input.value = json.structure;

            for (let letter in json.groups) {
                let group = json.groups[letter];
                addGroup(group, group.alias, group.value)
            }

            generateAll();
        };
  
        reader.readAsText(file);
    }
};