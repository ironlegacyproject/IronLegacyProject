// Iron Legacy Project — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  // Mark active nav link
  var here = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll("nav.main-nav a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === here || (here === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  // If the contact form fell back to a plain (non-JS) submission, FormSubmit
  // redirects back here with ?sent=true — show the confirmation message.
  if (window.location.search.indexOf("sent=true") !== -1) {
    var contactForm = document.getElementById("contact-form");
    var contactStatus = contactForm ? contactForm.querySelector("#form-status") : document.getElementById("form-status");
    if (contactStatus) {
      contactStatus.textContent = "Thank you — your message has been sent.";
      contactStatus.className = "ok";
    }
  }
});

// ---- Supabase client (lazy init) ----
function getSupabaseClient() {
  var url = window.SUPABASE_URL;
  var key = window.SUPABASE_ANON_KEY;
  if (!url || !key || url.indexOf("PASTE_YOUR") === 0 || key.indexOf("PASTE_YOUR") === 0) {
    return null;
  }
  if (typeof window.supabase === "undefined") {
    return null;
  }
  if (!window._ilpSupabaseClient) {
    window._ilpSupabaseClient = window.supabase.createClient(url, key);
  }
  return window._ilpSupabaseClient;
}

// Generic form submit handler.
// formEl: the <form> element
// tableName: Supabase table to insert into
// buildRecord: function(formData) -> object to insert
function wireSupabaseForm(formEl, tableName, buildRecord) {
  if (!formEl) return;
  var statusEl = formEl.querySelector("#form-status") || document.getElementById("form-status");

  formEl.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (statusEl) {
      statusEl.textContent = "Submitting...";
      statusEl.className = "";
    }

    var client = getSupabaseClient();
    if (!client) {
      if (statusEl) {
        statusEl.textContent =
          "This form isn't connected yet. Please email " +
          "support@ironlegacyproject.com directly, or contact the site admin to finish Supabase setup.";
        statusEl.className = "err";
      }
      return;
    }

    var data = new FormData(formEl);
    var record = buildRecord(data);

    var submitBtn = formEl.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      var result = await client.from(tableName).insert([record]);
      if (result.error) {
        console.error(result.error);
        if (statusEl) {
          statusEl.textContent = "Something went wrong submitting this form. Please try again or email support@ironlegacyproject.com.";
          statusEl.className = "err";
        }
      } else {
        formEl.reset();
        if (statusEl) {
          statusEl.textContent = "Thank you — this has been submitted successfully.";
          statusEl.className = "ok";
        }
      }
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent = "Something went wrong submitting this form. Please try again or email support@ironlegacyproject.com.";
        statusEl.className = "err";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Contact form handler — sends straight to an email via FormSubmit (no backend needed).
// formEl: the <form> element with fields name, email, message
function wireContactForm(formEl) {
  if (!formEl) return;
  var statusEl = formEl.querySelector("#form-status") || document.getElementById("form-status");
  var endpoint = "https://formsubmit.co/ajax/support@ironlegacyproject.com";

  formEl.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (statusEl) {
      statusEl.textContent = "Sending...";
      statusEl.className = "";
    }

    var data = new FormData(formEl);
    // Honeypot: if a bot filled this hidden field, silently pretend success.
    if (data.get("_honey")) {
      formEl.reset();
      if (statusEl) {
        statusEl.textContent = "Thank you — your message has been sent.";
        statusEl.className = "ok";
      }
      return;
    }

    var payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      _subject: "New message from ironlegacyproject.com contact form",
      _template: "table"
    };

    var submitBtn = formEl.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        formEl.reset();
        if (statusEl) {
          statusEl.textContent = "Thank you — your message has been sent.";
          statusEl.className = "ok";
        }
      } else {
        throw new Error("Non-OK response");
      }
    } catch (err) {
      console.error(err);
      if (statusEl) {
        statusEl.textContent = "Something went wrong sending this message. Please try again or email support@ironlegacyproject.com directly.";
        statusEl.className = "err";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
