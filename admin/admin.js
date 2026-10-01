const ADMIN_PASSWORD="gfg140300";
const ADMIN_SESSION_KEY="brasa35_admin_auth";
function unlockAdmin(){
  document.body.classList.remove("locked");
  document.getElementById("loginGate")?.classList.add("unlocked");
}
if(sessionStorage.getItem(ADMIN_SESSION_KEY)==="1") unlockAdmin();
document.getElementById("loginForm")?.addEventListener("submit",e=>{
  e.preventDefault();
  const input=document.getElementById("adminPassword");
  if(input.value===ADMIN_PASSWORD){
    sessionStorage.setItem(ADMIN_SESSION_KEY,"1");
    document.getElementById("loginError").textContent="";
    unlockAdmin();
  }else{
    document.getElementById("loginError").textContent="Senha incorreta.";
    input.value="";
    input.focus();
  }
});
const DEFAULT_PRODUCTS=[
{id:1,name:"Brasa Clássico",category:"Hambúrgueres",price:28.9,tag:"clássico",description:"Pão brioche, smash 160g, cheddar, cebola roxa, picles e molho da casa.",image:"https://images.unsplash.com/photo-1590742309630-e9f9b66da3f7?auto=format&fit=crop&w=1000&q=82",extras:true,available:true},
{id:2,name:"Brasa Bacon",category:"Hambúrgueres",price:34.9,tag:"mais pedido",description:"Smash 160g, cheddar duplo, bacon crocante, cebola caramelizada e barbecue.",image:"https://i.pinimg.com/originals/20/fe/f4/20fef425655c6fe95592a0e011d799b7.jpg",extras:true,available:true},
{id:3,name:"Brasa Duplo",category:"Hambúrgueres",price:39.9,tag:"fome alta",description:"Dois smash de 120g, queijo prato, cheddar, picles e molho 35.",image:"https://iggbsjqnlcvkzvxjmfok.supabase.co/storage/v1/object/public/images/prompts/juicy-burger-close-up-prompt-1775856356160.webp",extras:true,available:true},
{id:4,name:"Combo 35",category:"Combos",price:44.9,tag:"combo",description:"Brasa Clássico + fritas crocantes + refrigerante lata.",image:"https://images.unsplash.com/photo-1590742309630-e9f9b66da3f7?auto=format&fit=crop&w=1100&q=80",extras:true,available:true},
{id:5,name:"Combo Bacon",category:"Combos",price:49.9,tag:"combo",description:"Brasa Bacon + fritas + refrigerante lata.",image:"https://i.pinimg.com/originals/20/fe/f4/20fef425655c6fe95592a0e011d799b7.jpg",extras:true,available:true},
{id:6,name:"Fritas da Casa",category:"Porções",price:18.9,tag:"crocante",description:"Batatas sequinhas com páprica defumada e molho especial.",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80",extras:false,available:true},
{id:7,name:"Fritas Cheddar & Bacon",category:"Porções",price:27.9,tag:"pra dividir",description:"Fritas, cheddar cremoso, bacon crocante e cebolinha.",image:"https://images.unsplash.com/photo-1630431341973-02e1b662ec35?auto=format&fit=crop&w=1000&q=80",extras:false,available:true},
{id:8,name:"Coca-Cola",category:"Bebidas",price:7,tag:"350 ml",description:"Lata gelada para acompanhar o pedido.",image:"https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1000&q=80",extras:false,available:true},
{id:9,name:"Guaraná",category:"Bebidas",price:6.5,tag:"350 ml",description:"Lata gelada.",image:"https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=1000&q=80",extras:false,available:true},
{id:10,name:"Brownie Brasa",category:"Sobremesas",price:16.9,tag:"doce final",description:"Brownie de chocolate com calda cremosa e toque de flor de sal.",image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80",extras:false,available:true}];
const key="brasa35_admin_v1";let db=JSON.parse(localStorage.getItem(key)||"null")||{products:DEFAULT_PRODUCTS,categories:["Hambúrgueres","Combos","Porções","Bebidas","Sobremesas"],settings:{name:"BRASA 35",whatsapp:"62998230185",pix:"705.698.571-80",instagram:"@gfgtech14",address:"Setor Aeroporto, Goiânia - GO",minimum:0,delivery:0},store:{open:true,pausedUntil:null}};
function save(){localStorage.setItem(key,JSON.stringify(db));render();toast("Alterações salvas");}
const money=n=>Number(n).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll(".page,.nav").forEach(x=>x.classList.remove("active"));$(id).classList.add("active");document.querySelector('[data-page="'+id+'"]').classList.add("active");$("pageTitle").textContent={dashboard:"Dashboard",products:"Cardápio",availability:"Disponibilidade",categories:"Categorias",settings:"Configurações"}[id]}
document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>go(b.dataset.page));
function render(){const available=db.products.filter(p=>p.available).length;$("statProducts").textContent=db.products.length;$("statAvailable").textContent=available;$("statPaused").textContent=db.products.length-available;$("statCategories").textContent=db.categories.length;
$("pausedList").innerHTML=db.products.filter(p=>!p.available).map(p=>row(p.name,p.category,'<button class="primary small" onclick="toggle('+p.id+')">Reativar</button>')).join("")||'<div class="notice">Nenhum produto pausado.</div>';
renderProducts();renderAvailability();renderCategories();renderSettings();renderStore()}
function row(a,b,c){return '<div class="list-row"><div><strong>'+a+'</strong><small>'+b+'</small></div><div>'+c+'</div></div>'}
function renderProducts(){let q=($("productSearch").value||"").toLowerCase();$("productRows").innerHTML=db.products.filter(p=>p.name.toLowerCase().includes(q)).map(p=>'<tr><td><div class="product-cell"><img class="thumb" src="'+p.image+'"><div><strong>'+p.name+'</strong><br><small>'+p.tag+'</small></div></div></td><td>'+p.category+'</td><td><strong>'+money(p.price)+'</strong></td><td><span class="pill '+(p.available?"on":"off")+'">'+(p.available?"Disponível":"Pausado")+'</span></td><td class="actions"><button onclick="toggle('+p.id+')" title="Pausar/reativar">◷</button><button onclick="openProduct('+p.id+')" title="Editar">✎</button><button onclick="removeProduct('+p.id+')" title="Excluir">⌫</button></td></tr>').join("")}
$("productSearch").oninput=renderProducts;
function openProduct(id){let p=id?db.products.find(x=>x.id===id):null;$("formTitle").textContent=p?"Editar produto":"Novo produto";$("pId").value=p?.id||"";$("pName").value=p?.name||"";$("pPrice").value=p?.price||"";$("pTag").value=p?.tag||"";$("pDescription").value=p?.description||"";$("pImage").value=p?.image||"";$("pAvailable").checked=p?.available??true;$("pExtras").checked=p?.extras??false;$("pCategory").innerHTML=db.categories.map(c=>'<option '+(p?.category===c?"selected":"")+'>'+c+'</option>').join("");$("backdrop").classList.remove("hidden");$("productModal").classList.remove("hidden")}
function closeProduct(){$("backdrop").classList.add("hidden");$("productModal").classList.add("hidden")}
$("backdrop").onclick=closeProduct;$("productForm").onsubmit=e=>{e.preventDefault();let id=Number($("pId").value);let p={id:id||Date.now(),name:$("pName").value.trim(),category:$("pCategory").value,price:Number($("pPrice").value),tag:$("pTag").value.trim(),description:$("pDescription").value.trim(),image:$("pImage").value.trim()||"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",available:$("pAvailable").checked,extras:$("pExtras").checked};if(id)db.products[db.products.findIndex(x=>x.id===id)]=p;else db.products.push(p);closeProduct();save()}
function toggle(id){let p=db.products.find(x=>x.id===id);p.available=!p.available;save()}function removeProduct(id){if(confirm("Excluir este produto?")){db.products=db.products.filter(x=>x.id!==id);save()}}
function renderAvailability(){$("availabilityList").innerHTML=db.products.map(p=>row(p.name,p.category,'<label class="switch"><input type="checkbox" '+(p.available?"checked":"")+' onchange="toggle('+p.id+')"><span></span></label>')).join("")}
function renderStore(){let paused=db.store.pausedUntil==="manual"||(db.store.pausedUntil&&new Date(db.store.pausedUntil)>new Date());db.store.open=!paused;$("storeOpen").checked=!paused;$("storePauseInfo").textContent=paused?(db.store.pausedUntil==="manual"?"Loja pausada até reativação manual.":"Loja pausada até "+new Date(db.store.pausedUntil).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})):"Loja recebendo pedidos normalmente."}
document.querySelectorAll(".pause-grid button").forEach(b=>b.onclick=()=>{let m=Number(b.dataset.min);db.store.pausedUntil=m<0?"manual":new Date(Date.now()+m*60000).toISOString();save()});$("storeOpen").onchange=e=>{db.store.pausedUntil=e.target.checked?null:"manual";save()}
function renderCategories(){$("categoryList").innerHTML=db.categories.map((c,i)=>row(c,db.products.filter(p=>p.category===c).length+" produtos",'<button class="ghost" onclick="deleteCategory('+i+')">Excluir</button>')).join("")}
$("addCategory").onclick=()=>{let n=prompt("Nome da nova categoria:");if(n&&n.trim()&&!db.categories.includes(n.trim())){db.categories.push(n.trim());save()}};function deleteCategory(i){if(db.products.some(p=>p.category===db.categories[i]))return alert("Mova ou exclua os produtos desta categoria primeiro.");db.categories.splice(i,1);save()}
function renderSettings(){let s=db.settings;$("setName").value=s.name;$("setWhatsapp").value=s.whatsapp;$("setPix").value=s.pix;$("setInstagram").value=s.instagram;$("setAddress").value=s.address;$("setMinimum").value=s.minimum;$("setDelivery").value=s.delivery}
$("saveSettings").onclick=()=>{db.settings={name:$("setName").value,whatsapp:$("setWhatsapp").value,pix:$("setPix").value,instagram:$("setInstagram").value,address:$("setAddress").value,minimum:Number($("setMinimum").value),delivery:Number($("setDelivery").value)};save()}
function toast(t){let x=$("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}render();