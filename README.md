# Softgym

_Sistema de gestión para un gimnasio_

### Pre-requisitos 📋

_Instalar los programas necesarios para llevar a cabo el desarrollo._

**NodeJS, MongoDB y Postman**

_Instalar las dependencias de NodeJS descritas en el package.json desde la terminal de VS Code. Se tiene que generar un archivo 
node_modules_

```
express: Para escribir código del servidor, y crear el servidor.
```

```
morgan: Es un middleware para visualizar por consola las peticiones http
```

```
dotenv: Para leer las variables de entorno de desarrollo en donde definimos la dirección de la bd
```

```
jsonwebtoken: Sirve para la autenticacion de usuarios para iniciar sesión, el token del usuario se va 
a almacenar en el LocalStorage del navegador
```

```
mongoose: Es un ODM para mongodb
```

```
mongoose-validator: Para customizar las validaciones en mongodb
```

```
cors: Permite la comunicacion segura entre el servidor y el cliente
```

```
bcrypt-nodejs: Para encriptar las contraseñas
```

### Instalación 🔧

```
npm i express morgan dotenv jsonwebtoken mongoose mongoose-validator cors bcrypt-nodejs
```

_Dependencia de desarrollo_

```
npm i nodemon -D
```

## Deployment 📦

_Para ejecutar el servidor acceder a la consola y a la ruta del backend - cd backend y escribir:_

```
npm run dev
```

## Autores ✒️

* **Juan Jarolin** - *Trabajo Inicial* - [juanrjarolin](https://github.com/juanrjarolin)
* **Jessica Matiauda**
* **Nilda Panderi**
