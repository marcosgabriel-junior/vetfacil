import { Platform } from 'react-native';

// Declara a variável SQLite, que será o módulo real ou o mock
let SQLite;

// Define o comportamento de SQLite baseado na plataforma
if (Platform.OS === "web") {
  console.warn("Rodando em ambiente web. O SQLite será mockado (dados não serão persistidos).");
  // Objeto mock que simula o expo-sqlite para não quebrar na web
  SQLite = {
    openDatabase: (dbName) => ({
      transaction: (callback) => {
        console.log(`[Web Mock DB] Transaction iniciada para: ${dbName}`);
        callback({
          executeSql: (sql, args, successCallback, errorCallback) => {
            console.log(`[Web Mock DB] Executando SQL: ${sql}`);
            // Simula um sucesso vazio para não quebrar a aplicação
            // Em ambiente real, você faria algo aqui (ex: usar localStorage para mock de dados)
            successCallback && successCallback({ rowsAffected: 0, insertId: null, rows: { _array: [] } });
          },
        });
      },
      // Adicione outros métodos se forem chamados diretamente em seu código (ex: closeAsync, deleteAsync)
      closeAsync: () => Promise.resolve(),
      deleteAsync: () => Promise.resolve(),
    }),
    // Opcional: Adicionar outros métodos do SQLite que possam ser usados (ex: enablePromise)
    enablePromise: () => {},
  };
} else {
  // Para iOS/Android, importe o SQLite real
  SQLite = require('expo-sqlite');
}

// Nome do seu arquivo de banco de dados
const DATABASE_NAME = 'banco.db';

const db = SQLite.openDatabase(DATABASE_NAME);

// Função para inicializar as tabelas (cria se não existirem)
export const initDB = () => {
  db.transaction(tx => {
    // Tabela de Usuários
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT
      );`,
      [],
      () => console.log('Tabela users verificada/criada com sucesso!'),
      (_, error) => console.log('Erro ao criar tabela users:', error)
    );

    // Tabela de Animais (vinculada ao usuário)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL, -- Chave estrangeira para o usuário dono do animal
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        breed TEXT,
        sex TEXT,
        date_of_birth TEXT, -- Armazenar como texto 'YYYY-MM-DD'
        image_uri TEXT, -- Caminho para a imagem do animal (local ou URL)
        FOREIGN KEY (user_id) REFERENCES users(id)
      );`,
      [],
      () => console.log('Tabela pets verificada/criada com sucesso!'),
      (_, error) => console.log('Erro ao criar tabela pets:', error)
    );

    // Tabela de Eventos (vinculada ao animal)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pet_id INTEGER NOT NULL, -- Chave estrangeira para o animal
        event_name TEXT NOT NULL,
        event_type TEXT,
        location TEXT,
        notes TEXT, -- Para "motivo/observação"
        event_date TEXT NOT NULL, -- Data do evento (e.g., 'YYYY-MM-DD')
        event_time TEXT NOT NULL, -- Hora do evento (e.g., 'HH:MM')
        FOREIGN KEY (pet_id) REFERENCES pets(id)
      );`,
      [],
      () => console.log('Tabela events verificada/criada com sucesso!'),
      (_, error) => console.log('Erro ao criar tabela events:', error)
    );
  });
};

// --- Funções de Operação com o Banco de Dados ---

// Exemplo: Cadastrar um novo usuário
export const addUser = (email, password, name, phone) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
        [email, password, name, phone],
        (_, result) => resolve(result ? result.insertId : null), // Verifica se result existe no mock
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Buscar um usuário por email e senha (para login)
export const getUserByEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows }) => resolve(rows ? rows._array[0] : null), // Verifica se rows existe no mock
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Adicionar um novo pet
export const addPet = (userId, name, species, breed, sex, dateOfBirth, imageUri) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO pets (user_id, name, species, breed, sex, date_of_birth, image_uri) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, name, species, breed, sex, dateOfBirth, imageUri],
        (_, result) => resolve(result ? result.insertId : null),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Buscar todos os pets de um usuário
export const getPetsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets WHERE user_id = ?',
        [userId],
        (_, { rows }) => resolve(rows ? rows._array : []),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Buscar um pet específico pelo ID
export const getPetById = (petId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets WHERE id = ?',
        [petId],
        (_, { rows }) => resolve(rows ? rows._array[0] : null),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Adicionar um novo evento para um pet
export const addEvent = (petId, eventName, eventType, location, notes, eventDate, eventTime) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [petId, eventName, eventType, location, notes, eventDate, eventTime],
        (_, result) => resolve(result ? result.insertId : null),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Buscar todos os eventos de um pet
export const getEventsByPetId = (petId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events WHERE pet_id = ? ORDER BY event_date DESC, event_time DESC',
        [petId],
        (_, { rows }) => resolve(rows ? rows._array : []),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Atualizar informações de um usuário
export const updateUser = (id, email, name, phone) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET email = ?, name = ?, phone = ? WHERE id = ?',
        [email, name, phone, id],
        (_, result) => resolve(result ? result.rowsAffected : 0),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Atualizar senha de um usuário
export const updatePassword = (id, newPassword) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, id],
        (_, result) => resolve(result ? result.rowsAffected : 0),
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Deletar um pet (e seus eventos associados)
export const deletePet = (petId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Primeiro, deleta todos os eventos relacionados a este pet
      tx.executeSql(
        'DELETE FROM events WHERE pet_id = ?',
        [petId],
        (_, eventsResult) => {
          // Depois, deleta o pet
          tx.executeSql(
            'DELETE FROM pets WHERE id = ?',
            [petId],
            (_, petResult) => resolve({ eventsDeleted: eventsResult ? eventsResult.rowsAffected : 0, petsDeleted: petResult ? petResult.rowsAffected : 0 }),
            (_, error) => reject(error)
          );
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Exemplo: Deletar um evento
export const deleteEvent = (eventId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM events WHERE id = ?',
        [eventId],
        (_, result) => resolve(result ? result.rowsAffected : 0),
        (_, error) => reject(error)
      );
    });
  });
};