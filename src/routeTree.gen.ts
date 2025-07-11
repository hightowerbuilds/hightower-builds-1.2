/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ZineTwoIndexImport } from './routes/zine-two/index'
import { Route as ZineOneIndexImport } from './routes/zine-one/index'
import { Route as StoreIndexImport } from './routes/store/index'
import { Route as PdfExtractorIndexImport } from './routes/pdf-extractor/index'
import { Route as MoneyModesIndexImport } from './routes/money-modes/index'
import { Route as ModalitiesIndexImport } from './routes/modalities/index'
import { Route as LifeNotesIndexImport } from './routes/life-notes/index'
import { Route as HomeIndexImport } from './routes/home/index'
import { Route as GeminiChatIndexImport } from './routes/gemini-chat/index'
import { Route as BalanceChartIndexImport } from './routes/balance-chart/index'

// Create/Update Routes

const ZineTwoIndexRoute = ZineTwoIndexImport.update({
  id: '/zine-two/',
  path: '/zine-two/',
  getParentRoute: () => rootRoute,
} as any)

const ZineOneIndexRoute = ZineOneIndexImport.update({
  id: '/zine-one/',
  path: '/zine-one/',
  getParentRoute: () => rootRoute,
} as any)

const StoreIndexRoute = StoreIndexImport.update({
  id: '/store/',
  path: '/store/',
  getParentRoute: () => rootRoute,
} as any)

const PdfExtractorIndexRoute = PdfExtractorIndexImport.update({
  id: '/pdf-extractor/',
  path: '/pdf-extractor/',
  getParentRoute: () => rootRoute,
} as any)

const MoneyModesIndexRoute = MoneyModesIndexImport.update({
  id: '/money-modes/',
  path: '/money-modes/',
  getParentRoute: () => rootRoute,
} as any)

const ModalitiesIndexRoute = ModalitiesIndexImport.update({
  id: '/modalities/',
  path: '/modalities/',
  getParentRoute: () => rootRoute,
} as any)

const LifeNotesIndexRoute = LifeNotesIndexImport.update({
  id: '/life-notes/',
  path: '/life-notes/',
  getParentRoute: () => rootRoute,
} as any)

const HomeIndexRoute = HomeIndexImport.update({
  id: '/home/',
  path: '/home/',
  getParentRoute: () => rootRoute,
} as any)

const GeminiChatIndexRoute = GeminiChatIndexImport.update({
  id: '/gemini-chat/',
  path: '/gemini-chat/',
  getParentRoute: () => rootRoute,
} as any)

const BalanceChartIndexRoute = BalanceChartIndexImport.update({
  id: '/balance-chart/',
  path: '/balance-chart/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/balance-chart/': {
      id: '/balance-chart/'
      path: '/balance-chart'
      fullPath: '/balance-chart'
      preLoaderRoute: typeof BalanceChartIndexImport
      parentRoute: typeof rootRoute
    }
    '/gemini-chat/': {
      id: '/gemini-chat/'
      path: '/gemini-chat'
      fullPath: '/gemini-chat'
      preLoaderRoute: typeof GeminiChatIndexImport
      parentRoute: typeof rootRoute
    }
    '/home/': {
      id: '/home/'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeIndexImport
      parentRoute: typeof rootRoute
    }
    '/life-notes/': {
      id: '/life-notes/'
      path: '/life-notes'
      fullPath: '/life-notes'
      preLoaderRoute: typeof LifeNotesIndexImport
      parentRoute: typeof rootRoute
    }
    '/modalities/': {
      id: '/modalities/'
      path: '/modalities'
      fullPath: '/modalities'
      preLoaderRoute: typeof ModalitiesIndexImport
      parentRoute: typeof rootRoute
    }
    '/money-modes/': {
      id: '/money-modes/'
      path: '/money-modes'
      fullPath: '/money-modes'
      preLoaderRoute: typeof MoneyModesIndexImport
      parentRoute: typeof rootRoute
    }
    '/pdf-extractor/': {
      id: '/pdf-extractor/'
      path: '/pdf-extractor'
      fullPath: '/pdf-extractor'
      preLoaderRoute: typeof PdfExtractorIndexImport
      parentRoute: typeof rootRoute
    }
    '/store/': {
      id: '/store/'
      path: '/store'
      fullPath: '/store'
      preLoaderRoute: typeof StoreIndexImport
      parentRoute: typeof rootRoute
    }
    '/zine-one/': {
      id: '/zine-one/'
      path: '/zine-one'
      fullPath: '/zine-one'
      preLoaderRoute: typeof ZineOneIndexImport
      parentRoute: typeof rootRoute
    }
    '/zine-two/': {
      id: '/zine-two/'
      path: '/zine-two'
      fullPath: '/zine-two'
      preLoaderRoute: typeof ZineTwoIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/balance-chart': typeof BalanceChartIndexRoute
  '/gemini-chat': typeof GeminiChatIndexRoute
  '/home': typeof HomeIndexRoute
  '/life-notes': typeof LifeNotesIndexRoute
  '/modalities': typeof ModalitiesIndexRoute
  '/money-modes': typeof MoneyModesIndexRoute
  '/pdf-extractor': typeof PdfExtractorIndexRoute
  '/store': typeof StoreIndexRoute
  '/zine-one': typeof ZineOneIndexRoute
  '/zine-two': typeof ZineTwoIndexRoute
}

export interface FileRoutesByTo {
  '/balance-chart': typeof BalanceChartIndexRoute
  '/gemini-chat': typeof GeminiChatIndexRoute
  '/home': typeof HomeIndexRoute
  '/life-notes': typeof LifeNotesIndexRoute
  '/modalities': typeof ModalitiesIndexRoute
  '/money-modes': typeof MoneyModesIndexRoute
  '/pdf-extractor': typeof PdfExtractorIndexRoute
  '/store': typeof StoreIndexRoute
  '/zine-one': typeof ZineOneIndexRoute
  '/zine-two': typeof ZineTwoIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/balance-chart/': typeof BalanceChartIndexRoute
  '/gemini-chat/': typeof GeminiChatIndexRoute
  '/home/': typeof HomeIndexRoute
  '/life-notes/': typeof LifeNotesIndexRoute
  '/modalities/': typeof ModalitiesIndexRoute
  '/money-modes/': typeof MoneyModesIndexRoute
  '/pdf-extractor/': typeof PdfExtractorIndexRoute
  '/store/': typeof StoreIndexRoute
  '/zine-one/': typeof ZineOneIndexRoute
  '/zine-two/': typeof ZineTwoIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/balance-chart'
    | '/gemini-chat'
    | '/home'
    | '/life-notes'
    | '/modalities'
    | '/money-modes'
    | '/pdf-extractor'
    | '/store'
    | '/zine-one'
    | '/zine-two'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/balance-chart'
    | '/gemini-chat'
    | '/home'
    | '/life-notes'
    | '/modalities'
    | '/money-modes'
    | '/pdf-extractor'
    | '/store'
    | '/zine-one'
    | '/zine-two'
  id:
    | '__root__'
    | '/balance-chart/'
    | '/gemini-chat/'
    | '/home/'
    | '/life-notes/'
    | '/modalities/'
    | '/money-modes/'
    | '/pdf-extractor/'
    | '/store/'
    | '/zine-one/'
    | '/zine-two/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  BalanceChartIndexRoute: typeof BalanceChartIndexRoute
  GeminiChatIndexRoute: typeof GeminiChatIndexRoute
  HomeIndexRoute: typeof HomeIndexRoute
  LifeNotesIndexRoute: typeof LifeNotesIndexRoute
  ModalitiesIndexRoute: typeof ModalitiesIndexRoute
  MoneyModesIndexRoute: typeof MoneyModesIndexRoute
  PdfExtractorIndexRoute: typeof PdfExtractorIndexRoute
  StoreIndexRoute: typeof StoreIndexRoute
  ZineOneIndexRoute: typeof ZineOneIndexRoute
  ZineTwoIndexRoute: typeof ZineTwoIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  BalanceChartIndexRoute: BalanceChartIndexRoute,
  GeminiChatIndexRoute: GeminiChatIndexRoute,
  HomeIndexRoute: HomeIndexRoute,
  LifeNotesIndexRoute: LifeNotesIndexRoute,
  ModalitiesIndexRoute: ModalitiesIndexRoute,
  MoneyModesIndexRoute: MoneyModesIndexRoute,
  PdfExtractorIndexRoute: PdfExtractorIndexRoute,
  StoreIndexRoute: StoreIndexRoute,
  ZineOneIndexRoute: ZineOneIndexRoute,
  ZineTwoIndexRoute: ZineTwoIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/balance-chart/",
        "/gemini-chat/",
        "/home/",
        "/life-notes/",
        "/modalities/",
        "/money-modes/",
        "/pdf-extractor/",
        "/store/",
        "/zine-one/",
        "/zine-two/"
      ]
    },
    "/balance-chart/": {
      "filePath": "balance-chart/index.tsx"
    },
    "/gemini-chat/": {
      "filePath": "gemini-chat/index.tsx"
    },
    "/home/": {
      "filePath": "home/index.tsx"
    },
    "/life-notes/": {
      "filePath": "life-notes/index.tsx"
    },
    "/modalities/": {
      "filePath": "modalities/index.tsx"
    },
    "/money-modes/": {
      "filePath": "money-modes/index.tsx"
    },
    "/pdf-extractor/": {
      "filePath": "pdf-extractor/index.tsx"
    },
    "/store/": {
      "filePath": "store/index.tsx"
    },
    "/zine-one/": {
      "filePath": "zine-one/index.tsx"
    },
    "/zine-two/": {
      "filePath": "zine-two/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
