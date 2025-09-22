# Prueba-tecnica

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
## Descripcion CRUD-parques

Administrador de Parques es una aplicación web desarrollada en Angular que permite gestionar parques de manera intuitiva. La aplicación incluye todas las operaciones básicas de un CRUD (Crear, Leer, Actualizar y Eliminar) y permite administrar información detallada de cada parque, incluyendo nombre, dirección, ciudad, estado, código postal, imágenes y ubicación geográfica. Además, integra visualización de mapas interactivos y datos climáticos para cada parque, ofreciendo una experiencia completa de administración y seguimiento.

## Tecnologías y Librerías Utilizadas

Angular CLI – Generación y gestión del proyecto.
TypeScript – Lenguaje principal del desarrollo.
RxJS – Manejo de programación reactiva y observables.
Leaflet – Visualización de mapas interactivos.
SweetAlert2 – Alertas y confirmaciones estilizadas.
OpenWeatherMap API – Obtención de datos climáticos para cada parque.
Tailwind CSS – Estilos y diseño responsivo.
Angular Forms – Gestión de formularios y validaciones.
Angular Router – Navegación entre componentes.

# Instrucciones para ejecutar el proyecto

## 1. Instalar dependencias
El proyecto utiliza npm para manejar dependencias. Ejecuta:

```bash
npm install
```

## 2. Levantar el servidor de desarrollo

Una vez instaladas las dependencias, puedes iniciar el servidor de desarrollo:

```bash
ng serve
```
Por defecto, la aplicación estará disponible en:

```bash
http://localhost:4200/
```



4. Compilación para producción (opcional)
Para generar la versión optimizada para producción:


```bash
ng build
```
