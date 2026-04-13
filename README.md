# Softball-Stats-Final
# Softball Stats API

## Project Overview

This project is a REST API built using Node.js, Express, and Sequelize. It is designed to manage softball team data, including players, games, and player statistics. The API allows for creating, reading, updating, and deleting records to track player performance across multiple games.

The purpose of this project is to demonstrate backend development skills, including building RESTful APIs, working with relational databases, and implementing CRUD operations.

---

## Database Structure

The database includes the following models:

- Users
- Players
- Games
- PlayerStats

### Relationships

- A Player can have many PlayerStats records
- A Game can have many PlayerStats records
- PlayerStats belongs to both a Player and a Game

This structure allows tracking individual player performance in each game.

---

## Setup Instructions

1. Install dependencies

```bash
npm install