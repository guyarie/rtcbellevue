---
# Site-wide settings: practice details, header navigation and footer.
title: Relational Therapy Collective
name: Relational Therapy Collective
logo: ../../assets/images/logo-rtc.webp
logo_alt: Relational Therapy Collective
email: therapy@rtcbellevue.com
phone: "4256750881"
address:
  - 14655 NE Bel-Red Road
  - Building F, suite 203
  - Bellevue, WA 98007
map_url: "https://www.google.com/maps/dir//14655+NE+Bel+Red+Rd,+Bellevue,+WA+98007/@47.6258515,-122.1444887,17z"
map_image: ../../assets/images/office-map.webp

nav:
  - label: Home
    url: /
  - label: Our Services
    url: /services
    children:
      - { label: Intro, url: /services }
      - { label: Individual Therapy, url: /individual-therapy }
      - { label: Couples Therapy, url: /couples-therapy }
      - { label: Family Therapy, url: /family-therapy }
      - { label: Parent Coaching/Consultation, url: /parent-coaching-consultation }
      - { label: Group Therapy/Life Skills, url: /group-therapy }
      - { label: Medication Management, url: /med-management }
      - { label: Collaborative Care, url: /collaborative-care }
  - label: Areas of Focus
    url: /intro-2
    children:
      - { label: Intro, url: /intro-2 }
      - { label: ADHD, url: /adhd }
      - { label: Anxiety & Stress Management, url: /anxiety-stress-management }
      - { label: Depression, url: /depression }
      - { label: Neurodivergence, url: /neurodivergent }
      - { label: Parenting, url: /parenting }
      - { label: Relationship & Communication, url: /relational-struggle }
      - { label: Selective Mutism, url: /selective-mutism-1 }
      - { label: Trauma, url: /trauma }
  - label: Meet the Team
    url: /intro-1
    children:
      - { label: Intro, url: /intro-1 }
    # Each clinician is added automatically, in `order`.
    children_from: clinicians
  - label: Blog
    url: /blog

cta:
  label: Contact Us
  url: /contact-us
---
