import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// CONFIGURAÇÃO TEMPORÁRIA PARA DESENVOLVIMENTO
// Quando receber as credenciais do cliente, adicione-as no arquivo .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "AIzaSyDEMO_TEMP_KEY_FOR_DEVELOPMENT",
  authDomain:
    import.meta.env.VITE_AUTH_DOMAIN || "demo-temp-project.firebaseapp.com",
  projectId: import.meta.env.VITE_PROJECT_ID || "demo-temp-project",
  storageBucket:
    import.meta.env.VITE_STORAGE_BUCKET || "demo-temp-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_APP_ID || "1:123456789012:web:demo123456",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export { app };

export default firebaseConfig;
