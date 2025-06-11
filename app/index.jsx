// index.jsx
import { Redirect, useRouter } from 'expo-router';
import React from 'react'; // O useEffect foi removido pois não é mais usado aqui

export default function Index() {
  const router = useRouter();

  // O bloco useEffect que chamava initDB() foi removido.

  return <Redirect href="/screens/loginScreen"/>;
}