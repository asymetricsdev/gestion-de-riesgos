
## ⚡ Using this Vite template

1. Crear proyecto basado en esta plantilla base:


2. Correr la Aplicacion:
   1. `cd my-app`: Vaya al directorio raíz de su proyecto
   2. `npm install`: Instalar todas las dependencias del proyecto.
   3. `npm start`: Inicie el servidor de desarrollo en [localhost:5173](http://localhost:5173/)

## ✅ Testing

### Unit tests

`npm run test`: Ejecute pruebas unitarias con Jest y React Testing Library

### End-to-end tests

1. `npm start`: Inicie el servidor de desarrollo en [localhost:5173](http://localhost:5173/)
2. Ejecute pruebas de un extremo a otro con Cypress eligiendo una de las siguientes opciones:
  - `npm run cy:open`: Abrir Cypress in dev mode
  - `npm run cy:run`: Ejecutar Cypress in CLI

## 🔦 Linting

- `npm run lint`: Run linter
- `npm run lint:fix`: Fix lint issues


## 🤔 FAQ



### 👻 ¿Por qué no agregar? `.vscode` or `.idea` to the `.gitignore` template

Estas son carpetas creadas debido a las preferencias personales del entorno. Deberíamos ignorar estas preferencias del entorno de desarrollo personal para que se ignoren usando su archivo global `.gitignore` y dejar el archivo `.gitignore` del proyecto lo más limpio posible, es decir, que solo contenga las reglas específicas del proyecto.

Puedes crear un archivo `.gitignore_global` con reglas que se aplicarán a todos tus repositorios con:

```bash
touch ~/.gitignore_global
git config --global core.excludesfile ~/.gitignore_global
```


