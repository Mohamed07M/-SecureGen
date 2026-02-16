// الحروف والأرقام والرموز
const upper="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower="abcdefghijklmnopqrstuvwxyz";
const numbers="0123456789";
const symbols="!@#$%^&*()_+~`|}{[]:;?><,./-=";
const similar="O0lI1";

const password=document.getElementById("password");
const strengthBar=document.getElementById("strengthBar");
const lengthSlider=document.getElementById("length");
const lengthValue=document.getElementById("lengthValue");
const upperCheckbox=document.getElementById("upper");
const lowerCheckbox=document.getElementById("lower");
const numbersCheckbox=document.getElementById("numbers");
const symbolsCheckbox=document.getElementById("symbols");
const excludeCheckbox=document.getElementById("exclude");
const toast=document.getElementById("toast");

// دالة توليد رقم عشوائي آمن
function secureRandom(max){
    const array=new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

// توليد كلمة مرور
function generatePassword(){
    const length=parseInt(lengthSlider.value);
    let chars="";

    if(upperCheckbox.checked) chars+=upper;
    if(lowerCheckbox.checked) chars+=lower;
    if(numbersCheckbox.checked) chars+=numbers;
    if(symbolsCheckbox.checked) chars+=symbols;

    if(excludeCheckbox.checked){
        chars=chars.split("").filter(c=>!similar.includes(c)).join("");
    }

    if(chars.length===0){
        password.value="";
        strengthBar.style.width="0%";
        return;
    }

    let pass="";
    for(let i=0;i<length;i++){
        pass+=chars[secureRandom(chars.length)];
    }

    password.value=pass;
    updateStrength(pass);
}

// تحديث قوة كلمة المرور
function updateStrength(pass){
    let score=0;
    if(pass.length>=12) score+=30;
    if(/[A-Z]/.test(pass)) score+=20;
    if(/[a-z]/.test(pass)) score+=20;
    if(/[0-9]/.test(pass)) score+=15;
    if(/[^A-Za-z0-9]/.test(pass)) score+=15;

    strengthBar.style.width=score+"%";
    strengthBar.style.background=score<50?"red":score<75?"orange":"green";
}

// نسخ كلمة المرور
function copyPassword(){
    if(password.value==="") return;
    navigator.clipboard.writeText(password.value);
    toast.classList.add("show");
    setTimeout(()=>toast.classList.remove("show"),2000);
}

// تغيير الثيم
function toggleTheme(){
    document.body.classList.toggle("light");
    localStorage.setItem("theme",
        document.body.classList.contains("light")?"light":"dark");
}

// تغيير اللغة
function toggleLang(){
    const current=document.documentElement.lang;
    const newLang=current==="ar"?"en":"ar";
    document.documentElement.lang=newLang;
    document.documentElement.dir=newLang==="ar"?"rtl":"ltr";
    localStorage.setItem("lang",newLang);
}

// عند التحميل
window.onload=()=>{
    if(localStorage.getItem("theme")==="light")
        document.body.classList.add("light");

    const savedLang=localStorage.getItem("lang");
    if(savedLang){
        document.documentElement.lang=savedLang;
        document.documentElement.dir=savedLang==="ar"?"rtl":"ltr";
    }

    generatePassword();
};

// تحديث طول كلمة المرور تلقائي
lengthSlider.oninput=function(){
    lengthValue.textContent=this.value;
    generatePassword();
};
