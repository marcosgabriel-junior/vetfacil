-- Dica: Execute esses comandos no seu cliente SQLite.
-- Certifique-se de que as tabelas 'users', 'pets', e 'events' já existem.

-- 1. Inserir o Usuário de Teste Específico
-- Este usuário terá o ID que será usado para os pets e eventos de teste.
INSERT INTO users (email, password, name, phone) VALUES
('teste@example.com', 'teste', 'Usuário de Teste', '31999999999');

-- 2. Inserir Dois Cachorros Aleatórios para o Usuário de Teste
-- Assumimos que o 'Usuário de Teste' acima receberá o ID 1, se for a primeira inserção.
-- Se já houver outros usuários, ajuste o user_id conforme o ID real do 'teste@example.com'.
-- Você pode fazer um SELECT id FROM users WHERE email = 'teste@example.com'; para confirmar o ID.
-- Para este exemplo, usaremos 1 como ID do usuário de teste.

INSERT INTO pets (user_id, name, species, breed, sex, date_of_birth, image_uri) VALUES
(1, 'Max', 'Cachorro', 'Pastor Alemão', 'Macho', '2021-08-15', 'https://placehold.co/150x150/007BFF/FFFFFF?text=Max'),
(1, 'Amora', 'Cachorro', 'Border Collie', 'Fêmea', '2020-04-20', 'https://placehold.co/150x150/FF6347/FFFFFF?text=Amora');

-- 3. Inserir Agendamentos Aleatórios para os Dois Cachorros
-- Assumimos que 'Max' é o pet_id 1 e 'Amora' é o pet_id 2 (se forem os próximos pets inseridos após o user_id 1).
-- Verifique os IDs reais dos pets se já tiver outros registros.
-- Você pode fazer um SELECT id FROM pets WHERE name = 'Max'; e SELECT id FROM pets WHERE name = 'Amora'; para confirmar os IDs.
-- Para este exemplo, usaremos pet_id 1 para Max e pet_id 2 para Amora.

-- Agendamentos para Max (pet_id=1)
INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES
(1, 'Vacina Anual', 'Vacina', 'Clínica Pet Feliz', 'Reforço contra raiva', '2025-09-01', '09:30'),
(1, 'Consulta de Rotina', 'Veterinário', 'VetCare Center', 'Check-up anual', '2025-10-10', '15:00'),
(1, 'Adestramento', 'Treinamento', 'Centro de Adestramento Cão Esperto', 'Sessão 3 de 5', '2025-07-20', '11:00');

-- Agendamentos para Amora (pet_id=2)
INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES
(2, 'Banho e Tosa', 'Estética', 'Salon Pet Elegante', 'Tosa da raça e banho completo', '2025-07-25', '14:00'),
(2, 'Remédio para Pulgas', 'Medicamento', 'Farmácia Veterinária Central', 'Dose mensal', '2025-08-05', '18:00'),
(2, 'Teste Alérgico', 'Veterinário', 'Laboratório PetVida', 'Investigação de coceira', '2025-11-12', '09:00');

-- 4. Inserir Dados Aleatórios Adicionais (Outros Usuários e Seus Pets/Eventos)
-- Para popular ainda mais o banco de dados.

-- Outros Usuários
INSERT INTO users (email, password, name, phone) VALUES
('joana.pereira@example.com', 'joana123', 'Joana Pereira', '31977777777'),
('pedro.almeida@example.com', 'pedro456', 'Pedro Almeida', '31966666666');

-- Pets para Joana Pereira (user_id 3, se forem os próximos IDs)
INSERT INTO pets (user_id, name, species, breed, sex, date_of_birth, image_uri) VALUES
(3, 'Pingo', 'Gato', 'Siamês', 'Macho', '2023-02-10', 'https://placehold.co/150x150/4CAF50/FFFFFF?text=Pingo'),
(3, 'Melody', 'Pássaro', 'Calopsita', 'Fêmea', '2024-01-05', 'https://placehold.co/150x150/8A2BE2/FFFFFF?text=Melody');

-- Pets para Pedro Almeida (user_id 4, se forem os próximos IDs)
INSERT INTO pets (user_id, name, species, breed, sex, date_of_birth, image_uri) VALUES
(4, 'Thor', 'Cachorro', 'Pitbull', 'Macho', '2019-11-22', 'https://placehold.co/150x150/FFD700/000000?text=Thor');

-- Eventos para Pingo (pet_id 3, se forem os próximos IDs)
INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES
(3, 'Corte de Unhas', 'Estética', 'Em Casa', 'Usar cortador de gato', '2025-07-18', '10:00'),
(3, 'Vacina Gripe Felina', 'Vacina', 'Clínica Gato Feliz', 'Primeira dose', '2025-08-03', '14:30');

-- Eventos para Thor (pet_id 5, se forem os próximos IDs)
INSERT INTO events (pet_id, event_name, event_type, location, notes, event_date, event_time) VALUES
(5, 'Revisão de Chip', 'Veterinário', 'Vet Clínica', 'Verificação de dados', '2025-09-05', '16:00'),
(5, 'Comportamento', 'Treinamento', 'Escola de Cães Amigos', 'Lidar com latidos excessivos', '2025-10-01', '10:00');
