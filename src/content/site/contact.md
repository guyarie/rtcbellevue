---
# The "Let's Get Started" contact form (home + Contact Us pages).
# Form submissions go to Formspree. Collect contact info only — this is a
# therapy practice; never add fields that invite clinical details.
title: Contact form
form_action: ""   # TODO: Formspree endpoint, e.g. https://formspree.io/f/xxxxxxx
form_fields:
  - { name: first_name, label: First Name, type: text, required: true }
  - { name: last_name, label: Last Name, type: text, required: true }
  - { name: email, label: Email, type: email, required: true }
  - { name: message, label: Message, type: textarea, required: true }
form_note: Please don't include clinical or health details in this form — email is not confidential.
form_submit: Send
form_success: Thank you! We'll be in touch soon.
---
