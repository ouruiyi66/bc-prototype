function maskPhone(value){return value.length>7?value.slice(0,3)+'****'+value.slice(-4):value.length>2?value[0]+'****'+value.slice(-1):'*'.repeat(value.length)}
const $=(s,r=document)=>r.querySelector(s), screens=[...document.querySelectorAll('.screen')];
function show(id){screens.forEach(s=>s.hidden=s.id!==id);const nav=$('#shared-nav');if(nav)nav.hidden=!['home','scene','profile'].includes(id);if(id!=='intro')stopAnimation();}
function hot(id,cls,label,click){const b=document.createElement('button');b.className='hotspot '+cls;b.type='button';b.setAttribute('aria-label',label);b.addEventListener('click',click);$('#'+id).append(b);return b}
function native(id,cls,placeholder,type){let i=document.createElement('input');i.className='native-field '+cls;i.placeholder=placeholder;i.type=type;i.inputMode=type==='tel'?'tel':'numeric';i.setAttribute('aria-label',placeholder);$('#'+id).append(i);return i}
let animationTimer;function stopAnimation(){}function startAnimation(){const img=$('#intro-animation');img.src='assets/intro-animation.webp'}
let introArt=$('[data-node-id="57:14165"]',$('#intro'));introArt.innerHTML='<img id="intro-animation" class="intro-animation" alt="">';hot('desktop','desktop-hotspot','打开 Babycare',()=>{show('splash');setTimeout(()=>{show('intro');startAnimation()},2000)});hot('intro','intro-hotspot','开始探索',()=>show('login'));
$('[data-node-id="57:8658"]',$('#login')).style.visibility='hidden';$('[data-node-id="57:9360"]',$('#verify')).style.visibility='hidden';const phone=native('login','phone-field','请输入手机号码','tel'), code=native('verify','code-field','请输入验证码','text');code.maxLength=6;code.inputMode='numeric';
const agreement=$('[data-node-id="57:13952"]',$('#login'));const originalCircle=$('[data-node-id="I57:13952;499:19221"]',agreement);originalCircle.style.visibility='hidden';const checkbox=document.createElement('button');checkbox.className='checkmark';checkbox.type='button';checkbox.setAttribute('role','checkbox');checkbox.setAttribute('aria-checked','false');checkbox.setAttribute('aria-label','同意用户协议与隐私政策');$('#login').append(checkbox);checkbox.onclick=()=>checkbox.setAttribute('aria-checked',checkbox.getAttribute('aria-checked')!=='true');
hot('login','send-hotspot','获取验证码',()=>{if(checkbox.getAttribute('aria-checked')!=='true'){agreement.classList.remove('shake');void agreement.offsetWidth;agreement.classList.add('shake');return}if(!phone.value.trim()){phone.focus();return}phone.blur();$('[data-node-id="57:14085"] p',$('#verify')).textContent='已发送至 '+maskPhone(phone.value.trim());show('verify');$('#modal').hidden=false});$('#close').onclick=()=>{$('#modal').hidden=true};hot('verify','enter-hotspot','验证并登录',()=>{if(!code.value.trim()){code.focus();return}code.blur();show('home')});
let previousTab='home',activeTab=0,tabMoving=false;
const tabNames=['home','scene','ai','profile'];
const originalNav={home:$('#home [data-node-id="57:9790"]'),scene:$('#scene [data-name="bottom"]'),profile:$('#profile [data-name="bottom"]')};
const navItems={};for(const id of ['home','scene','profile'])navItems[id]=$('[data-name="items"]',originalNav[id]);
const sharedNav=originalNav.home.cloneNode(true);sharedNav.id='shared-nav';sharedNav.hidden=true;$('#stage').append(sharedNav);
const sharedItems=$('[data-name="items"]',sharedNav);sharedItems.style.zIndex='2';
const variants=[['scene','home'],['home','scene'],['home',null],['home','profile']];
const pill=document.createElement('div');pill.className='persistent-tab-pill';sharedNav.insertBefore(pill,sharedItems);
for(let i=0;i<4;i++){
 const item=sharedItems.children[i],inner=item.firstElementChild;
 const iconFrom=(screen)=>navItems[screen].children[i].firstElementChild.firstElementChild.cloneNode(true);
 const normal=iconFrom(variants[i][0]),chosen=variants[i][1]?iconFrom(variants[i][1]):null;
 inner.replaceChildren();inner.style.backgroundColor='transparent';
 normal.classList.add('tab-icon-normal');inner.append(normal);
 if(chosen){chosen.classList.add('tab-icon-selected');inner.append(chosen)}
 item.classList.toggle('tab-active',i===0);
 const button=document.createElement('button');button.type='button';button.className='shared-tab-hit';button.setAttribute('aria-label','切换到'+['首页','场景','AI','我的'][i]);button.addEventListener('click',()=>switchTab(i));item.append(button);
}
for(const n of Object.values(originalNav))n.style.visibility='hidden';
function switchTab(index){
 if(tabMoving||index===activeTab)return;
 if(index===2){previousTab=tabNames[activeTab];show('ai');return}
 const from=activeTab;activeTab=index;tabMoving=true;
 for(let i=0;i<4;i++)sharedItems.children[i].classList.toggle('tab-active',i===index);
 show(tabNames[index]);
 const start=from*76,end=index*76;
 const animation=pill.animate([{transform:`translateX(${start}px)`},{transform:`translateX(${end}px)`}],{duration:260,easing:'cubic-bezier(.2,.7,.2,1)',fill:'forwards'});
 animation.onfinish=()=>{pill.style.transform=`translateX(${end}px)`;animation.cancel();tabMoving=false};
}
hot('ai','','返回上一页',()=>show(previousTab)).style.cssText='right:12px;top:63px;width:45px;height:48px';
function size(){let scale=Math.min(window.innerWidth/375,1);$('#stage').style.transform=`scale(${scale})`;$('#viewport').style.width=375*scale+'px';$('#viewport').style.height=812*scale+'px'}size();window.addEventListener('resize',size);
// Restore mask positioning emitted by the Figma design for compound artwork.
document.querySelectorAll('[class*="mask-"]').forEach(el=>{for(const c of el.classList){if(c==='mask-no-repeat')el.style.maskRepeat='no-repeat';else if(c==='mask-no-clip')el.style.maskClip='no-clip';else if(c==='mask-alpha')el.style.maskMode='alpha';else if(c.startsWith('mask-position-['))el.style.maskPosition=c.slice(15,-1).replaceAll('_',' ');else if(c.startsWith('mask-size-['))el.style.maskSize=c.slice(11,-1).replaceAll('_',' ');}});
// Deterministic page previews for design review.
const preview=new URLSearchParams(location.search).get('preview');if(['home','scene','ai','profile'].includes(preview)){if(preview!=='ai'){activeTab=tabNames.indexOf(preview);pill.style.transform=`translateX(${activeTab*76}px)`;for(let i=0;i<4;i++)sharedItems.children[i].classList.toggle('tab-active',i===activeTab)}show(preview)}
// Figma-exported artwork retains the original compound masks within the card.
const membershipArtwork=document.querySelector('#profile [data-node-id="57:14467"]');
if(membershipArtwork){membershipArtwork.innerHTML='<img src="assets/membership-card.png" alt="" style="position:absolute;left:0;top:0;width:343px;height:88px">'}
