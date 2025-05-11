const contatosEmMemoria = [
    {
      id: '1',
      nome: 'Alice',
      email: 'alice@email.com',
      telefone: '11 99999-0001',
      avatar: 'https://i.pravatar.cc/150?img=1',
      favorito: true,
      categoria: 'amigo',
      sexo: 'feminino'
    },
    {
      id: '2',
      nome: 'Bruno',
      email: 'bruno@email.com',
      telefone: '11 99999-0002',
      avatar: 'https://i.pravatar.cc/150?img=2',
      favorito: false,
      categoria: 'trabalho',
      sexo: 'masculino'
    },
    {
      id: '3',
      nome: 'Carla',
      email: 'carla@email.com',
      telefone: '11 99999-0003',
      avatar: 'https://i.pravatar.cc/150?img=3',
      favorito: true,
      categoria: 'familia',
      sexo: 'feminino'
    },
    {
      id: '4',
      nome: 'Diego',
      email: 'diego@email.com',
      telefone: '11 99999-0004',
      avatar: 'https://i.pravatar.cc/150?img=4',
      favorito: false,
      categoria: 'trabalho',
      sexo: 'masculino'
    },
    {
      id: '5',
      nome: 'Elisa',
      email: 'elisa@email.com',
      telefone: '11 99999-0005',
      avatar: 'https://i.pravatar.cc/150?img=5',
      favorito: true,
      categoria: 'amigo',
      sexo: 'feminino'
    },
    {
      id: '6',
      nome: 'Felipe',
      email: 'felipe@email.com',
      telefone: '11 99999-0006',
      avatar: 'https://i.pravatar.cc/150?img=6',
      favorito: false,
      categoria: 'familia',
      sexo: 'masculino'
    }
  ];
  
  export async function salvarContato(contato) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novoContato = {
          ...contato,
          id: String(Date.now()),
          avatar: contato.avatar ?? `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        contatosEmMemoria.push(novoContato);
        console.log("Salvo em memória:", novoContato);
        resolve({ sucesso: true, contato: novoContato });
      }, 500);
    });
  }
  
  export async function buscarContatos() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...contatosEmMemoria]);
      }, 500);
    });
  }