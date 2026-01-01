let cacheCap = 3;
let cacheMap = new Map();
let hits = 0, misses = 0;

/* ---------- SET CAPACITY ---------- */
function setCap(){
    let c = Number(document.getElementById("cap").value);

    if(!c || c < 1){
        return show("Enter valid capacity","miss");
    }

    cacheCap = c;

    // 🔥 Shrink cache if size already > new capacity
    while(cacheMap.size > cacheCap){
        let lru = cacheMap.keys().next().value;
        cacheMap.delete(lru);
    }

    hits = 0; 
    misses = 0;
    render();
    show("Capacity set to " + cacheCap,"rem");
}

/* ---------- PUT ---------- */
function put(){
    let k = key.value.trim();
    let v = val.value.trim();

    if(!k || !v) return show("Enter key & value","miss");

    // HIT case
    if(cacheMap.has(k)){
        let oldVal = cacheMap.get(k);
        cacheMap.delete(k);
        cacheMap.set(k, oldVal);   // move to MRU
        hits++; render();
        show("HIT - Key matched","hit");
        highlight(k);
        return;
    }

    // MISS case
    if(cacheMap.size >= cacheCap){
        let lru = cacheMap.keys().next().value;
        cacheMap.delete(lru);
        misses++;
        show("MISS - Removed LRU " + lru,"rem");
    } else {
        misses++;
        show("MISS - Key stored","miss");
    }

    cacheMap.set(k, v);
    render();
}

/* ---------- GET ---------- */
function get(){
    let k = key.value.trim();
    if(!k) return show("Enter key","miss");

    if(cacheMap.has(k)){
        let val = cacheMap.get(k);
        cacheMap.delete(k); cacheMap.set(k,val);
        hits++; render();
        show("HIT - "+k+":"+val,"hit");
        highlight(k);
    } 
    else{
        misses++; render();
        show("MISS - Not found","miss");
    }
}

/* ---------- CLEAR ---------- */
function clr(){
    cacheMap = new Map();
    hits = 0; misses = 0;
    render();
    show("Cache cleared","rem");
}

/* ---------- RENDER UI ---------- */
function render(){
    hit.innerText = hits;
    miss.innerText = misses;

    cache.innerHTML = "";
    [...cacheMap].forEach(([k,v],i)=>{
        let node = document.createElement("div");
        node.className="node";
        node.innerHTML=`${k}<small>${v}</small>`;
        cache.appendChild(node);

        if(i < cacheMap.size-1){
            let arrow=document.createElement("div");
            arrow.className="arrow"; arrow.innerText="➝";
            cache.appendChild(arrow);
        }
    });
}

/* ---------- Highlight ---------- */
function highlight(k){
    setTimeout(()=>{
        document.querySelectorAll(".node").forEach(n=>{
            n.classList.remove("hit-node");
            if(n.innerText.split("\n")[0] == k) 
                n.classList.add("hit-node");
        });
    },150);
}

/* ---------- Status Banner ---------- */
function show(text,type){
    msg.className="msg";
    if(type=="hit") msg.classList.add("msg-hit");
    if(type=="miss") msg.classList.add("msg-miss");
    if(type=="rem") msg.classList.add("msg-rem");
    msg.textContent=text;
}
