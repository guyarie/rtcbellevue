---
# The "Let's Get Started" contact form (home + Contact Us pages).
# Every submission is emailed to `form_email` by FormSubmit (formsubmit.co):
# no account needed. The very first submission triggers a one-time
# activation email to that inbox — click "Activate Form" in it.
# Collect contact info only — this is a therapy practice; never add fields
# that invite clinical details.
title: Contact form
form_email: therapy@rtcbellevue.com
form_subject: Website referral
form_fields:
  - { name: first_name, label: First Name, type: text, required: true }
  - { name: last_name, label: Last Name, type: text, required: true }
  - { name: email, label: Email, type: email, required: true }
  - { name: message, label: Message, type: textarea, required: true }
form_note: Please don't include clinical or health details in this form — email is not confidential.
form_submit: Send
form_success: Thank you! We'll be in touch soon.
---
