# GruTube
A simple YouTube-Clone Platform. The goal was / is to create a multiservice, node-based platform like YouTube to learn some more advanced coding skills,
specifically Redis.

---

Services:
1. Authentication-Service (17/02/2026)

More Services will be added based on the steps that have already been taken.

# Authentication-Service
Will be implemented using expressjs + prismajs with SSO (Google + GitHub for now). The following data shall be saved per user:
Name, Handle (unique), Profile Picture, Bio, E-Mail Adress (unique), Channel-ID (key, unique), User-ID (UUID, key, unique)

UUID & Channel-ID are independent Keys