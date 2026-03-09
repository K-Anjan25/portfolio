function toggleMode(){
document.body.classList.toggle("dark");

const btn = document.querySelector(".dark-btn");

if(document.body.classList.contains("dark")){
btn.innerHTML = "☀️ Light Mode";
}else{
btn.innerHTML = "🌙 Dark Mode";
}
}

const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){
entry.target.classList.add("active");
}
});
});

document.querySelectorAll(".reveal").forEach(section=>{
observer.observe(section);
});

document.getElementById("contactForm").addEventListener("submit", function(e){

e.preventDefault();

document.getElementById("successMessage").innerText =
"✅ Message sent successfully!";

this.reset();

});