const BASE_URL="http://localhost:5000";
let hits=0,misses=0,chart=null;

async function api(url){ return fetch(url).then(r=>r.json()).catch(()=>[]); }

// SET CAPACITY
async function setCapacity(){
    await api(`${BASE_URL}/set/${capacity.value}`);
    hits=misses=0; updateStats(); render();
}

// ADD
async function addValue(){
    const v=valueInput.value;
    if(!v) return;

    let list=await api(`${BASE_URL}/list`);
    list.includes(String(v)) ? hits++ : misses++;

    updateStats();
    await api(`${BASE_URL}/add/${v}`);
    render();
}

// REMOVE
async function removeValue(){ await api(`${BASE_URL}/remove/${valueInput.value}`); render(); }

// CLEAR
async function clearCache(){ await api(`${BASE_URL}/clear`); hits=misses=0; updateStats(); render(); }

// UPDATE UI
async function render(){
    let arr=await api(`${BASE_URL}/list`);
    arr.reverse();         // MRU → LRU
    cache.innerHTML="";
    arr.forEach(v=>cache.innerHTML+=`<div class="item">${v}</div>`);
}

// STATS + CHART
function updateStats(){
    hit.innerText=hits; miss.innerText=misses; drawChart();
}

function drawChart(){
    const ctx=document.getElementById("chart").getContext("2d");
    if(chart) chart.destroy();
    chart=new Chart(ctx,{
        type:"bar",
        data:{
            labels:["Hits","Misses"],
            datasets:[{data:[hits,misses],backgroundColor:["green","red"]}]
        },
        options:{scales:{y:{beginAtZero:true}}}
    });
}

render(); updateStats();
