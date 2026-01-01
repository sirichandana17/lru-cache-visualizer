let cap = 3;
let map = new Map();
let hits = 0, misses = 0;

function setCap(){
    let c = parseInt(cap.value);
    if(c < 1) return show("Enter valid capacity","rem");
    cap = c; map.clear(); hits = 0; misses = 0;
    render(); show("Capacity set","rem");
}

function put(){
    let k = key.value.trim(), v = val.value.trim();
    if(!k || !v) return show("Enter key & value","miss");

    if(map.has(k)){                         // HIT
        let old = map.get(k);
        map.delete(k); map.set(k, old);
        hits++; render();
        show("HIT - Key matched","hit");
        highlight(k);
        return;
    }

    // MISS section
    if(map.size >= cap){
        let lru = map.keys().next().value;
        map.delete(lru);
        misses++; show("MISS - Removed LRU "+lru,"rem");
    } else {
        misses++; show("MISS - Key stored","miss");
    }

    map.set(k, v);
    render();
}

function get(){
    let k = key.value.trim();
    if(!k) return show("Enter key","miss");

    if(map.has(k)){
        let v = map.get(k);
        map.delete(k); map.set(k,v);
        hits++; render();
        show("HIT - "+k+":"+v,"hit");
        highlight(k);
    } else {
        misses++; render();
        show("MISS - Not found","miss");
    }
}

function clr(){
    map.clear(); hits = 0; misses = 0;
    render(); show("Cache cleared","rem");
}

/* ------- Rendering -------- */
function render(){
    document.getElementById("hit").innerText = hits;
    document.getElementById("miss").innerText = misses;

    cache.innerHTML = "";
    [...map].forEach(([k,v],i)=>{
        let node = document.createElement("div");
        node.className="node";
        node.innerHTML = `${k}<small>${v}</small>`;
        cache.appendChild(node);

        if(i != map.size-1){
            let arrow=document.createElement("div");
            arrow.className="arrow"; arrow.innerText="➝";
            cache.appendChild(arrow);
        }
    });
}

/* Highlight on HIT */
function highlight(k){
    setTimeout(()=>{
        document.querySelectorAll(".node").forEach(n=>{
            n.classList.remove("hit-node");
            if(n.innerText.split("\n")[0]==k) n.classList.add("hit-node");
        });
    },70);
}

/* Status message color */
function show(t,type){
    msg.className="msg";
    if(type=="hit") msg.classList.add("msg-hit");
    if(type=="miss") msg.classList.add("msg-miss");
    if(type=="rem") msg.classList.add("msg-rem");
    msg.textContent=t;
}
