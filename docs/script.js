let capacity = 3;
let cache = new Map();
let hits = 0, misses = 0;

function setCapacity(){
  capacity = parseInt(document.getElementById("capacity").value);
  cache.clear();
  hits = misses = 0;
  updateChart(); render();
}

function addValue(){
  let val = document.getElementById("valueInput").value;
  if(cache.has(val)){
    cache.delete(val); hits++;
  } else{
    if(cache.size >= capacity) cache.delete(cache.keys().next().value);
    misses++;
  }
  cache.set(val,true);
  updateChart(); render();
}

function removeValue(){
  let val = document.getElementById("valueInput").value;
  cache.delete(val);
  render();
}

function clearCache(){
  cache.clear();
  hits = misses = 0;
  updateChart(); render();
}

function render(){
  document.getElementById("hit").innerText = hits;
  document.getElementById("miss").innerText = misses;

  const div = document.getElementById("cache");
  div.innerHTML = "";
  Array.from(cache.keys()).reverse().forEach(v=>{
    let b=document.createElement("div");
    b.className="block";
    b.innerText=v;
    div.appendChild(b);
  });
}

let chart = new Chart(document.getElementById("chart"),{
  type:'bar',
  data:{ labels:['Hits','Misses'],
  datasets:[{data:[0,0]}]},
  options:{animation:true, scales:{y:{beginAtZero:true}}}
});

function updateChart(){
  chart.data.datasets[0].data=[hits,misses];
  chart.update();
}

/* Dark Mode */
document.querySelector("#themeToggle").onclick = ()=>{
  document.body.classList.toggle("dark");
}
setTimeout(()=>document.querySelectorAll(".fade-in").forEach(e=>e.classList.add("show")),200);
