import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://we-are-the-champions-51638-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
let postsInDB = ref(database, "posts")

const publishBtn = document.getElementById("publish-btn")
const endorsementInput = document.getElementById("endorsement-input")
const postList = document.getElementById("post-list")
const fromInput = document.getElementById("from-input")
const toInput = document.getElementById("to-input")

publishBtn.addEventListener("click", function(){
    if (endorsementInput.value !== "") {
            let inputFieldValue = endorsementInput.value
            let fromValue = fromInput.value
            let toValue = toInput.value

            clearInputFields()
            let inputArray = [inputFieldValue, fromValue, toValue]

            //pushing items into firebase db through reference
            push(postsInDB, inputArray)

    }
})

onValue(postsInDB, function(snapshot) {

    if (snapshot.exists()) {
        let postsArray = Object.entries(snapshot.val())
        clearPostListEl()
    
        for (let i = 0; i < postsArray.length; i++){
            let currentPost= postsArray[i]
            appendPostToPostList(currentPost)
        }
    } else {
        postList.innerHTML = `No posts here... yet`
    }
})

function clearPostListEl() {
    postList.innerHTML = ""
}

function clearInputFields() {
    endorsementInput.value = ""
    fromInput.value = ""
    toInput.value = ""
}

function appendPostToPostList(post) {
    let postID = post[0]
    let postContent = post[1][0]
    let postFrom = post[1][1]
    let postTo = post[1][2]

    let newEl = document.createElement("li")
    let innerDiv = document.createElement("div")
    innerDiv.classList.add("post")
    innerDiv.textContent = postContent
    newEl.appendChild(innerDiv)

    postFrom = postFrom === "" ? "N/A" : postFrom
    postTo = postTo === "" ? "N/A" : postTo
    let fromToDiv = document.createElement("div")
    fromToDiv.classList.add("from-to-container")
    fromToDiv.innerHTML = `<div class="bold">From: ${postFrom}</div><div class="bold">To: ${postTo}</div>`
    innerDiv.append(fromToDiv)
    //newEl.innerHTML = `<div class="post">${postContent}<div class="container">From: ${postFrom} To: ${postTo}</div></div>`

    newEl.addEventListener("click", function(){
        let exactLocationInDB = ref(database, `posts/${postID}`)
        remove(exactLocationInDB)
    })
    postList.append(newEl)
}

