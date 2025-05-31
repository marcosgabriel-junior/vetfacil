-- SQLite
-- Tabela de Usuários
-- selecione botão direito em tudo e da run query e seleciona o banco.db
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT
);

-- Tabela de Animais (vinculada ao usuário)
CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, -- Chave estrangeira para o usuário dono do animal
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    breed TEXT,
    sex TEXT,
    date_of_birth TEXT, -- Armazenar como texto 'YYYY-MM-DD' ou 'DD/MM/YYYY'
    image_uri TEXT, -- Caminho para a imagem do animal (local ou URL)
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de Eventos (vinculada ao animal)
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL, -- Chave estrangeira para o animal
    event_name TEXT NOT NULL,
    event_type TEXT,
    location TEXT,
    notes TEXT, -- Para "motivo/observação"
    event_date TEXT NOT NULL, -- Data do evento (e.g., 'YYYY-MM-DD')
    event_time TEXT NOT NULL, -- Hora do evento (e.g., 'HH:MM')
    FOREIGN KEY (pet_id) REFERENCES pets(id)
);