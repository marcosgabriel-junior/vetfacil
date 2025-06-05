import { Redirect, useRouter } from 'expo-router';
import React, { useEffect } from 'react'; // Importe useEffect
import { initDB } from './services/database'; // Importe a função initDB do seu serviço de banco de dados

export default function Index() {
  const router = useRouter();

  // Adicione este useEffect para inicializar o banco de dados
  useEffect(() => {
    initDB(); // Chama a função que verifica/cria suas tabelas
  }, []); // O array vazio [] garante que esta função execute apenas uma vez, na montagem do componente

  return <Redirect href={"/screens/loginScreen"}/>
 }