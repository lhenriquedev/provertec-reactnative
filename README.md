# Provertec React Native

Aplicativo mobile/web com Expo Router para gestao de lojas e produtos.

## Sumario

- [Tecnologias](#tecnologias)
- [Pre-requisitos](#pre-requisitos)
- [Passo a passo para executar](#passo-a-passo-para-executar)
- [Scripts uteis](#scripts-uteis)
- [Arquitetura](#arquitetura)
- [Rotas](#rotas)
- [Camadas e fluxo de dados](#camadas-e-fluxo-de-dados)
- [API mock local (Mirage)](#api-mock-local-mirage)
- [Testes e qualidade](#testes-e-qualidade)
- [Troubleshooting](#troubleshooting)

## Tecnologias

- Expo SDK 54
- React 19 + React Native 0.81
- Expo Router (file-based routing)
- TypeScript (strict)
- React Query (TanStack Query)
- NativeWind + Tailwind
- Gluestack UI
- MirageJS (API fake local)
- Jest + Testing Library

## Pre-requisitos

- Node.js 20+ (recomendado LTS)
- npm 10+
- Um dos ambientes abaixo:
  - Expo Go no celular
  - Emulador Android (Android Studio)
  - Simulador iOS (Xcode, somente macOS)
  - Navegador (modo web)

## Passo a passo para executar

### 1) Clonar o projeto

```bash
git clone <url-do-repositorio>
cd provertec-reactnative
```

### 2) Instalar dependencias

```bash
npm install
```

Observacao: o projeto usa `.npmrc` com `legacy-peer-deps=true`.

### 3) Subir o app

```bash
npm run start
```

No terminal do Expo, escolha uma opcao:

- `a` para Android
- `i` para iOS
- `w` para Web
- ou escaneie o QR Code com Expo Go

### 4) Execucao direta por plataforma (opcional)

```bash
npm run android
npm run ios
npm run web
```

## Scripts uteis

| Script | Comando | Descricao |
| --- | --- | --- |
| Start | `npm run start` | Inicia Expo Dev Server |
| Android | `npm run android` | Abre no emulador Android |
| iOS | `npm run ios` | Abre no simulador iOS |
| Web | `npm run web` | Abre no navegador |
| Lint | `npm run lint` | Executa lint via Expo |
| Test | `npm run test` | Executa testes com Jest |

## Arquitetura

Estrutura principal do projeto:

```text
.
├── app/                         # Rotas Expo Router
│   ├── _layout.tsx             # Providers globais + Stack raiz
│   └── (tabs)/                 # Navegacao por abas
│       ├── _layout.tsx
│       ├── index.tsx           # Dashboard
│       └── stores/
│           ├── index.tsx       # Lista de lojas
│           └── [id]/
│               ├── index.tsx   # Detalhe da loja
│               └── products/
│                   ├── index.tsx
│                   └── [productId].tsx
├── src/
│   ├── features/               # UI e regras por feature
│   │   ├── dashboard/
│   │   ├── stores/
│   │   └── products/
│   ├── domain/                 # Contratos, schemas, servicos HTTP
│   ├── infra/                  # Cliente HTTP, queryClient, tema
│   ├── server/                 # MirageJS (rotas, seeds, serializers)
│   ├── mocks/                  # Inicializacao do mock server
│   ├── components/             # Componentes UI base
│   └── shared/                 # Componentes e utilitarios compartilhados
├── assets/
├── global.css
└── tailwind.config.js
```

## Rotas

As rotas sao definidas por arquivos em `app/`:

- `/` -> `app/(tabs)/index.tsx`
- `/stores` -> `app/(tabs)/stores/index.tsx`
- `/stores/:id` -> `app/(tabs)/stores/[id]/index.tsx`
- `/stores/:id/products` -> `app/(tabs)/stores/[id]/products/index.tsx`
- `/stores/:id/products/:productId` -> `app/(tabs)/stores/[id]/products/[productId].tsx`

## Camadas e fluxo de dados

Fluxo de requisicao da UI ate o mock server:

```text
Tela (features/*/screens)
  -> Hooks de query/mutation (features/*/queries)
    -> Repository (features/*/repository)
      -> Domain service (domain/*/service)
        -> apiClient (infra/http/api-client)
          -> MirageJS (/api/*)
```

Responsabilidade por camada:

- `features/`: composicao das telas e comportamento de UX
- `queries/`: integracao com React Query (cache e invalidacao)
- `repository/`: adaptacao entre DTO e modelo da aplicacao
- `domain/`: validacao (Zod) e chamadas HTTP
- `server/`: API local fake para desenvolvimento offline

## API mock local (Mirage)

O servidor mock e iniciado no `app/_layout.tsx` via `initializeMockServer()`.

Endpoints disponiveis:

- `GET /api/health`
- `GET /api/stores`
- `GET /api/stores/:id`
- `POST /api/stores`
- `PUT /api/stores/:id`
- `DELETE /api/stores/:id`
- `GET /api/products?storeId=...`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Seeds iniciais ficam em `src/server/seeds.ts`.

## Testes e qualidade

Executar testes:

```bash
npm run test
```

Executar lint:

```bash
npm run lint
```

Arquivos de configuracao:

- `jest.config.js`
- `jest.setup.ts`
- `eslint.config.js`

## Troubleshooting

### Erro ao abrir Android/iOS

- Verifique se o emulador/simulador esta aberto.
- Rode `npm run start` e depois use `a` ou `i` no terminal.

### Dependencias com conflito

- Remova `node_modules` e rode `npm install` novamente.

### Porta ocupada no Expo

- Feche processos antigos ou rode:

```bash
npx expo start --clear
```
