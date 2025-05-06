## Stack

- Next.js (App Router) – [Documentación oficial](https://nextjs.org/docs)
- Bootstrap
- TypeScript
- OpenAi

# 💬 ChatBotAI – AI-Powered Chat App with Next.js

ChatBotAI es una aplicación de chat inteligente desarrollada con **Next.js 14 (App Router)**. Integra autenticación con JWT, almacenamiento local (JSON), respuestas automáticas mediante **la API de OpenAI**, y una interfaz atractiva con Bootstrap. 

## 🚀 Instrucciones para ejecutar el proyecto

1. **Clona el repositorio y crea env**
   ```bash
   git clone https://github.com/tu_usuario/chatbotai.git
   cd chatbotai
   touch .env con la variable OPENAI_API_KEY y agregar APIKEY

2. **Instala dependencias**
    npm install
3. **Estructura esperada**
    Asegúrate de tener los siguientes archivos y carpetas:

    - data/chats.json: contiene las conversaciones por usuario.

    - data/users.json: contiene usuarios para login.

    - src/app/api: contiene todos los endpoints API del sistema, incluyendo la API de ChatGPT.

    - components/: contiene componentes como ChatList, ChatConversation, UserSettings, etc.
    
    - hooks/: contiene hooks personalizados asi como un contexto global. 

    - services/: contiene configuracion de axios para JWT.

    - types/index.ts: contiene  interfaces TypeScript para garantizar una estructura clara y segura de los datos que se manejan.

    - midleware.ts: Protege las rutas para que solo puedas acceder con un login.

4. **Ejecuta el proyecto**

    npm run dev

5. **Accede en el navegador**

    http://localhost:3000

# 🧠 Decisiones técnicas y arquitectónicas
 
    - Next.js (App Router): Aprovechamos el soporte del App Router y API Routes para tener frontend y backend integrados en un solo repositorio.

    - JSON como base de datos: Para simplificar la persistencia de datos, las conversaciones se almacenan en archivos .json, evitando la necesidad de una base de datos completa.

    - JWT con cookies HTTP-only: Se implementa autenticación segura basada en JWT guardado en cookies httpOnly, usando jsonwebtoken.

    - Estado global con hooks personalizados: Se implementó useSelectedChat y useChatRefresh para compartir estado entre componentes.

    - UI con Bootstrap: Se eligió Bootstrap para una maquetación rápida y consistente.

    - Modal para logOut de usuario: Se utiliza un modal en lugar de navegación a /user para mostrar nombre, email y cerrar sesión.

    - OpenAI API para generación de respuestas inteligentes del bot.

# ✨ Funcionalidades principales
    - Autenticación de usuario con JWT.

    - Crear, editar y eliminar conversaciones.

    - Editar mensajes de usuario.

    - Retroalimentación a respuestas del bot (like, dislike).

    - Clasificación de chats por fecha (últimos 7 días y anteriores).

    - Búsqueda en chats.

    - Persistencia de datos en data/chats.json.

    - Modal de usuario con opción de logout.

    - Integración con la API de OpenAI para generar respuestas automáticas mediante inteligencia artificial.

# 🛠️ Posibles mejoras

    - Reemplazar fs + JSON por una base de datos real (PostgreSQL, MongoDB, etc.).

    - Añadir soporte a múltiples usuarios concurrentes con WebSockets o real-time.

    - Añadir tests unitarios con Jest o Vitest.

    - Implementar un sistema de suscripciones para monetización.

    - Soporte para subir imágenes o adjuntos.

    - Modo oscuro (Dark Mode).

    - Integración de JWT en las peticiones del frontend al backend.

    - Validaciones más robustas del lado del cliente y servidor.
    
    - Evaluar alternativas a la API de OpenAI para reducir costos a largo plazo:

        - Entrenar un modelo propio si el uso es intensivo.

        - Usar modelos open-source o en servidor privado.

        - Esto permitiría mayor personalización, control y ahorro en despliegues escalables.

# 👨‍💻 Autor
Desarrollado por Marcos – [https://www.linkedin.com/in/marcosazabache/]
