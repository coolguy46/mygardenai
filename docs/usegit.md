---
title: Beginner Git Guide
description: Learn how to use Git and collaborate on this repository.
author: Project Maintainer
date: 2025-05-13
tags: [git, guide, collaboration, beginners]
---

# 📘 Beginner Git Guide for This Project

## 👋 Welcome

If you're new to Git or collaborating on this project for the first time, this guide will walk you through everything you need to know to get started.

---

## 🔧 1. Install Git

1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Download and install Git for your system
3. Verify installation (open PowerShell or terminal):

   ```bash
   git --version
   ```

---

## 🧑‍💻 2. Set Up Git (One-Time Setup)

Configure your name and email so your commits are properly labeled:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📥 3. Clone the Repository (First Time Only)

Get a copy of this project onto your computer:

```bash
git clone https://github.com/<your-username>/<repo-name>.git
```

Then move into the project folder:

```bash
cd <repo-name>
```

---

## 🔄 4. Pull the Latest Changes

**Always do this before making any new changes:**

```bash
git pull
```

---

## 📝 5. Make Changes Locally

After editing files or adding new ones:

```bash
git add .
git commit -m "A clear message about what you changed"
```

---

## 🚀 6. Push Changes to GitHub

Send your committed changes to GitHub:

```bash
git push
```

---

## 🧠 7. Basic Git Workflow Summary

```bash
# Always start with the latest version
git pull

# Make your changes, then:
git add .
git commit -m "Descriptive message"
git push
```

---

## 💡 Tips for Clean Collaboration

- Pull before you start working
- Write clear commit messages
- Avoid committing temporary or personal files
- Ask for help if you're unsure about conflicts or errors

---

## 🔍 Useful Git Commands

| Command                      | Description                              |
|-----------------------------|------------------------------------------|
| `git status`                | See what has changed                     |
| `git pull`                  | Download latest changes from GitHub      |
| `git add .`                 | Stage all changes                        |
| `git commit -m "msg"`       | Save your changes with a message         |
| `git push`                  | Upload your changes to GitHub            |
| `git log`                   | View recent commits                      |
| `git clone [URL]`           | Copy a repo to your computer             |

---

## 🙋 Need Help?

If you're stuck, ask in the group or raise an issue on the repository. We're all learning!

🚀 Happy coding!
