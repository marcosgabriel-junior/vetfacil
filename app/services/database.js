import { Platform } from 'react-native';

let SQLite;

// Configuração do mock para ambiente web (navegador)
if (Platform.OS === "web") {
  console.warn("Rodando em ambiente web. O SQLite será mockado (dados não serão persistidos NO NAVEGADOR).");

  // Dados iniciais para o banco de dados em memória no ambiente web.
  // Estes dados serão reiniciados toda vez que a página do navegador for recarregada.
  let webDbData = {
    users: [
      { id: 1, email: 'teste@example.com', password: 'teste', name: 'Usuário de Teste', phone: '31999999999' },
      { id: 2, email: 'joana.pereira@example.com', password: 'joana123', name: 'Joana Pereira', phone: '31977777777' },
      { id: 3, email: 'pedro.almeida@example.com', password: 'pedro456', name: 'Pedro Almeida', phone: '31966666666' }
    ],
    pets: [
      { id: 1, user_id: 1, name: 'Max', species: 'Cachorro', breed: 'Pastor Alemão', sex: 'Macho', date_of_birth: '2021-08-15', image_uri: 'https://placehold.co/150x150/007BFF/FFFFFF?text=Max' },
      { id: 2, user_id: 1, name: 'Amora', species: 'Cachorro', breed: 'Border Collie', sex: 'Fêmea', date_of_birth: '2020-04-20', image_uri: 'https://placehold.co/150x150/FF6347/FFFFFF?text=Amora' },
      { id: 3, user_id: 2, name: 'Pingo', species: 'Gato', breed: 'Siamês', sex: 'Macho', date_of_birth: '2023-02-10', image_uri: 'https://placehold.co/150x150/4CAF50/FFFFFF?text=Pingo' },
      { id: 4, user_id: 3, name: 'Thor', species: 'Cachorro', breed: 'Pitbull', sex: 'Macho', date_of_birth: '2019-11-22', image_uri: 'https://placehold.co/150x150/FFD700/000000?text=Thor' }
    ],
    events: [
      { id: 1, pet_id: 1, event_name: 'Vacina Anual', event_type: 'Vacina', location: 'Clínica Pet Feliz', notes: 'Reforço contra raiva', event_date: '2025-09-01', event_time: '09:30' },
      { id: 2, pet_id: 1, event_name: 'Consulta de Rotina', event_type: 'Veterinário', location: 'VetCare Center', notes: 'Check-up anual', event_date: '2025-10-10', event_time: '15:00' },
      { id: 3, pet_id: 2, event_name: 'Banho e Tosa', event_type: 'Estética', location: 'Salon Pet Elegante', notes: 'Tosa da raça e banho completo', event_date: '2025-07-25', event_time: '14:00' },
      { id: 4, pet_id: 3, event_name: 'Corte de Unhas', event_type: 'Estética', location: 'Em Casa', notes: 'Usar cortador de gato', event_date: '2025-07-18', event_time: '10:00' }
    ]
  };
  // IDs para novas inserções no mock
  let nextUserId = Math.max(...webDbData.users.map(u => u.id)) + 1;
  let nextPetId = Math.max(...webDbData.pets.map(p => p.id)) + 1;
  let nextEventId = Math.max(...webDbData.events.map(e => e.id)) + 1;

  SQLite = {
    openDatabase: (dbName) => ({
      transaction: (callback) => {
        callback({
          executeSql: (sql, args, successCallback, errorCallback) => {
            // console.log(`[Web Mock DB] Executando SQL: ${sql} com args:`, args); // Descomente para debug detalhado

            // Simulação das operações SQL
            if (sql.includes('CREATE TABLE')) {
                successCallback && successCallback(null, { rowsAffected: 0, insertId: null, rows: { _array: [] } });
            } else if (sql.includes('INSERT INTO users')) {
                const newUser = { id: nextUserId++, email: args[0], password: args[1], name: args[2], phone: args[3] };
                webDbData.users.push(newUser);
                successCallback && successCallback(null, { rowsAffected: 1, insertId: newUser.id, rows: { _array: [newUser] } });
            } else if (sql.includes('INSERT INTO pets')) {
                const newPet = { id: nextPetId++, user_id: args[0], name: args[1], species: args[2], breed: args[3], sex: args[4], date_of_birth: args[5], image_uri: args[6] };
                webDbData.pets.push(newPet);
                successCallback && successCallback(null, { rowsAffected: 1, insertId: newPet.id, rows: { _array: [newPet] } });
            } else if (sql.includes('INSERT INTO events')) {
                const newEvent = { id: nextEventId++, pet_id: args[0], event_name: args[1], event_type: args[2], location: args[3], notes: args[4], event_date: args[5], event_time: args[6] };
                webDbData.events.push(newEvent);
                successCallback && successCallback(null, { rowsAffected: 1, insertId: newEvent.id, rows: { _array: [newEvent] } });
            } else if (sql.includes('SELECT * FROM users WHERE email = ? AND password = ?')) {
                const user = webDbData.users.find(u => u.email === args[0] && u.password === args[1]);
                successCallback && successCallback(null, { rows: { _array: user ? [user] : [] } });
            } else if (sql.includes('SELECT id FROM users WHERE email = ?')) { // Usado em initDB e signup
                const user = webDbData.users.find(u => u.email === args[0]);
                successCallback && successCallback(null, { rows: { _array: user ? [user] : [] } });
            } else if (sql.includes('SELECT COUNT(*) FROM users')) { // Usado em initDB para verificar se é a primeira vez
                successCallback && successCallback(null, { rows: { _array: [{ count: webDbData.users.length }] } });
            } else if (sql.includes('SELECT * FROM pets WHERE user_id = ?')) {
                const pets = webDbData.pets.filter(p => p.user_id === args[0]);
                successCallback && successCallback(null, { rows: { _array: pets } });
            } else if (sql.includes('SELECT * FROM pets WHERE id = ?')) {
                const pet = webDbData.pets.find(p => p.id === args[0]);
                successCallback && successCallback(null, { rows: { _array: pet ? [pet] : [] } });
            } else if (sql.includes('SELECT * FROM events WHERE pet_id = ?')) {
                const events = webDbData.events.filter(e => e.pet_id === args[0]);
                successCallback && successCallback(null, { rows: { _array: events } });
            } else if (sql.includes('SELECT e.*, p.name as pet_name FROM events e JOIN pets p ON e.pet_id = p.id WHERE p.user_id = ?')) {
                // Simula o JOIN para pegar o nome do pet no mock
                const userEvents = webDbData.events.filter(e => webDbData.pets.some(p => p.id === e.pet_id && p.user_id === args[0]));
                const eventsWithPetName = userEvents.map(event => ({
                    ...event,
                    pet_name: webDbData.pets.find(p => p.id === event.pet_id)?.name
                }));
                successCallback && successCallback(null, { rows: { _array: eventsWithPetName } });
            } else { // Default para outras operações ou SQL desconhecido
                successCallback && successCallback(null, { rowsAffected: 0, insertId: null, rows: { _array: [] } });
            }
          },
        });
      },
      closeAsync: () => Promise.resolve(),
      deleteAsync: () => Promise.resolve(),
      exec: (queries, readOnly, callback) => {
        console.warn("SQLite.exec não suportado na web (mock).");
        callback(null, []);
      }
    }),
    enablePromise: () => {},
  };
} else {
  // Para iOS/Android, importa o SQLite real (com persistência)
  SQLite = require('expo-sqlite');
}

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
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        species TEXT NOT NULL,
        breed TEXT,
        sex TEXT,
        date_of_birth TEXT,
        image_uri TEXT,
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
        pet_id INTEGER NOT NULL,
        event_name TEXT NOT NULL,
        event_type TEXT,
        location TEXT,
        notes TEXT,
        event_date TEXT NOT NULL,
        event_time TEXT NOT NULL,
        FOREIGN KEY (pet_id) REFERENCES pets(id)
      );`,
      [],
      () => console.log('Tabela events verificada/criada com sucesso!'),
      (_, error) => console.log('Erro ao criar tabela events:', error)
    );

    // --- Inserção do usuário "teste" E outros dados de exemplo, se eles não existirem ---
    // Esta lógica só é relevante para o ambiente nativo, pois o mock web já inicializa os dados.
    if (Platform.OS !== "web") {
        tx.executeSql(
            `SELECT id FROM users WHERE email = ?;`,
            ['teste@example.com'],
            (_, result) => {
                if (result && result.rows && result.rows.length === 0) {
                    console.log("Usuário 'teste@example.com' não encontrado (no nativo), inserindo dados de exemplo...");

                    // Inserir Usuário de Teste
                    tx.executeSql(
                        `INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?);`,
                        ['teste@example.com', 'teste', 'Usuário de Teste', '31999999999'],
                        (_, userResult) => {
                            if (userResult && userResult.insertId) {
                                console.log('Usuário "teste" adicionado com ID:', userResult.insertId);
                                const testeUserId = userResult.insertId;

                                // Inserir outros usuários de exemplo (para evitar conflitos de email se forem adicionados manualmente)
                                tx.executeSql(`INSERT OR IGNORE INTO users (email, password, name, phone) VALUES ('joana.pereira@example.com', 'joana123', 'Joana Pereira', '31977777777');`);
                                tx.executeSql(`INSERT OR IGNORE INTO users (email, password, name, phone) VALUES ('pedro.almeida@example.com', 'pedro456', 'Pedro Almeida', '31966666666');`);

                                // Inserir Cachorros Aleatórios para o Usuário de Teste
                                tx.executeSql(
                                    `INSERT INTO pets (user_id, name, species, breed, sex, date_of_birth, image_uri) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                    [testeUserId, 'Max', 'Cachorro', 'Pastor Alemão', 'Macho', '2021-08-15', 'https://placehold.co/150x150/007BFF/FFFFFF?text=Max'],
                                    (_, petMaxResult) => {
                                        if (petMaxResult && petMaxResult.insertId) {
                                            console.log('Pet "Max" adicionado com ID:', petMaxResult.insertId);
                                            const maxPetId = petMaxResult.insertId;
                                            // Agendamentos para Max
                                            tx.executeSql(`INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                                [maxPetId, 'Vacina Anual', 'Vacina', 'Clínica Pet Feliz', 'Reforço contra raiva', '2025-09-01', '09:30']);
                                            tx.executeSql(`INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                                [maxPetId, 'Consulta de Rotina', 'Veterinário', 'VetCare Center', 'Check-up anual', '2025-10-10', '15:00']);
                                        }
                                    }
                                );

                                tx.executeSql(
                                    `INSERT INTO pets (user_id, name, species, breed, sex, date_of_birth, image_uri) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                    [testeUserId, 'Amora', 'Cachorro', 'Border Collie', 'Fêmea', '2020-04-20', 'https://placehold.co/150x150/FF6347/FFFFFF?text=Amora'],
                                    (_, petAmoraResult) => {
                                        if (petAmoraResult && petAmoraResult.insertId) {
                                            console.log('Pet "Amora" adicionado com ID:', petAmoraResult.insertId);
                                            const amoraPetId = petAmoraResult.insertId;
                                            // Agendamentos para Amora
                                            tx.executeSql(`INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                                                [amoraPetId, 'Banho e Tosa', 'Estética', 'Salon Pet Elegante', 'Tosa da raça e banho completo', '2025-07-25', '14:00']);
                                        }
                                    }
                                );
                            }
                        },
                        (_, error) => console.log('Erro ao adicionar usuário "teste" ou dados de exemplo:', error)
                    );
                } else if (result && result.rows && result.rows.length > 0) {
                    console.log("Usuário 'teste@example.com' já existe (no nativo). Pulando inserção de dados de exemplo.");
                }
            },
            (_, error) => console.log('Erro ao verificar existência de usuário "teste":', error)
        );
    } // Fim do if (Platform.OS !== "web")
  });
};

export const addUser = (email, password, name, phone) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)',
        [email, password, name, phone],
        (_, result) => resolve(result ? result.insertId : null),
        (_, error) => reject(error)
      );
    });
  });
};

export const getUserByEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, result) => resolve(result && result.rows && result.rows._array.length > 0 ? result.rows._array[0] : null),
        (_, error) => reject(error)
      );
    });
  });
};

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

export const getPetsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets WHERE user_id = ?',
        [userId],
        (_, result) => resolve(result && result.rows ? result.rows._array : []),
        (_, error) => reject(error)
      );
    });
  });
};

export const getPetById = (petId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets WHERE id = ?',
        [petId],
        (_, result) => resolve(result && result.rows ? result.rows._array[0] : null),
        (_, error) => reject(error)
      );
    });
  });
};

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

export const getEventsByPetId = (petId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM events WHERE pet_id = ? ORDER BY event_date DESC, event_time DESC',
        [petId],
        (_, result) => resolve(result && result.rows ? result.rows._array : []),
        (_, error) => reject(error)
      );
    });
  });
};

export const getAllEventsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT e.*, p.name as pet_name FROM events e JOIN pets p ON e.pet_id = p.id WHERE p.user_id = ? ORDER BY e.event_date ASC, e.event_time ASC;`,
        [userId],
        (_, result) => {
          const events = [];
          if (result && result.rows) {
            for (let i = 0; i < result.rows.length; i++) {
              events.push(result.rows.item(i));
            }
          }
          resolve(events);
        },
        (_, error) => reject(error)
      );
    });
  });
};

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

export const deletePet = (petId) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM events WHERE pet_id = ?',
        [petId],
        (_, eventsResult) => {
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
