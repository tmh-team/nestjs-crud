## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

Clone the repo locally:

```bash
https://github.com/tmh-team/nestjs-crud.git
cd nestjs-crud
npm install
```

Copy env:

```bash
cp .env.example .env
```

Open env file and setup 
- databasename
- username 
- password

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Usage

- [Mysql](https://docs.nestjs.com/techniques/database) for database
- Nest [Configuration](https://docs.nestjs.com/techniques/configuration) for env
- Nest [Validation](https://docs.nestjs.com/techniques/validation)
- Nest [Hashing](https://docs.nestjs.com/security/encryption-and-hashing#hashing) for password hashing
- Nest [File] upload(https://docs.nestjs.com/techniques/file-upload)

## Nest cmd

Create module file (eg. nest g module users)
```bash
nest g module <module-name>
```

Create controller (eg. nest g controller /users/controllers/users)
```bash
nest g controller /<folder-name>/controllers/<controller-name>
```

Create service (eg. nest g service /users/services/users)
```bash
nest g service /<folder-name>/services/<service-name>
```

