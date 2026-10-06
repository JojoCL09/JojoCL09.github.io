let supabaseClient = null;

function configured() {
  return SUPABASE_URL.startsWith("https://") &&
         !SUPABASE_URL.includes("PASTE-YOUR") &&
         SUPABASE_PUBLISHABLE_KEY.length > 20 &&
         !SUPABASE_PUBLISHABLE_KEY.includes("PASTE-YOUR");
}

function showSetupMessage() {
  const box = document.getElementById("guestbookEntries");
  if (box) box.innerHTML = "the guestbook is almost ready ♡ add your Supabase details to config.js";
}

async function initGuestbook() {
  if (!configured()) { showSetupMessage(); return; }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  await updateAuthUI();
  await loadGuestbook();
  supabaseClient.auth.onAuthStateChange(() => updateAuthUI());
}

async function loadGuestbook() {
  const box = document.getElementById("guestbookEntries");
  if (!box || !supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("guestbook")
    .select("id,name,message,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    box.innerHTML = "couldn't load the guestbook yet ♡";
    return;
  }
  box.innerHTML = data.length ? data.map(e => `
    <div style="background:#fff0f5;border:1px solid #f2c6d4;border-radius:12px;padding:11px;margin-top:10px">
      <b>${escapeHtml(e.name)} ♡</b>
      <div style="margin-top:4px">${escapeHtml(e.message)}</div>
    </div>`).join("") : "<small>be the first to leave a little love ♡</small>";
}

async function updateAuthUI() {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getUser();
  const loggedIn = !!data.user;
  document.getElementById("authArea").innerHTML = loggedIn
    ? `<small>logged in ♡</small>`
    : `<button class="btn" onclick="openAuth()">log in to write ♡</button>`;
  document.getElementById("guestbookForm").style.display = loggedIn ? "block" : "none";
}

function openAuth(){ document.getElementById("authModal").style.display="flex"; }
function closeAuth(){ document.getElementById("authModal").style.display="none"; }

async function signup(){
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signUp({email, password});
  document.getElementById("authMessage").textContent =
    error ? error.message : "check your email to confirm your account ♡";
}

async function login(){
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signInWithPassword({email, password});
  document.getElementById("authMessage").textContent =
    error ? error.message : "you're logged in ♡";
  if (!error) closeAuth();
}

async function logout(){
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  await updateAuthUI();
}

async function addGuestbookEntry(){
  if (!supabaseClient) return;
  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData.user) return openAuth();

  const name = document.getElementById("guestName").value.trim();
  const message = document.getElementById("guestMessage").value.trim();
  if (!name || !message) return alert("please fill in your name and message ♡");

  const { error } = await supabaseClient.from("guestbook").insert({
    name, message, user_id: userData.user.id
  });
  if (error) return alert(error.message);

  document.getElementById("guestName").value = "";
  document.getElementById("guestMessage").value = "";
  await loadGuestbook();
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[c]));
}

document.addEventListener("DOMContentLoaded", initGuestbook);
