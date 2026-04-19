
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Categories
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type Categories = $Result.DefaultSelection<Prisma.$CategoriesPayload>
/**
 * Model HotSearchKeywords
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type HotSearchKeywords = $Result.DefaultSelection<Prisma.$HotSearchKeywordsPayload>
/**
 * Model Articles
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type Articles = $Result.DefaultSelection<Prisma.$ArticlesPayload>
/**
 * Model RefreshTokens
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type RefreshTokens = $Result.DefaultSelection<Prisma.$RefreshTokensPayload>
/**
 * Model Users
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type Users = $Result.DefaultSelection<Prisma.$UsersPayload>
/**
 * Model ArticleContentBlocks
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type ArticleContentBlocks = $Result.DefaultSelection<Prisma.$ArticleContentBlocksPayload>
/**
 * Model ArticleLikes
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 */
export type ArticleLikes = $Result.DefaultSelection<Prisma.$ArticleLikesPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Categories
 * const categories = await prisma.categories.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Categories
   * const categories = await prisma.categories.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.categories`: Exposes CRUD operations for the **Categories** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.categories.findMany()
    * ```
    */
  get categories(): Prisma.CategoriesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hotSearchKeywords`: Exposes CRUD operations for the **HotSearchKeywords** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HotSearchKeywords
    * const hotSearchKeywords = await prisma.hotSearchKeywords.findMany()
    * ```
    */
  get hotSearchKeywords(): Prisma.HotSearchKeywordsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articles`: Exposes CRUD operations for the **Articles** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Articles
    * const articles = await prisma.articles.findMany()
    * ```
    */
  get articles(): Prisma.ArticlesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshTokens`: Exposes CRUD operations for the **RefreshTokens** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshTokens.findMany()
    * ```
    */
  get refreshTokens(): Prisma.RefreshTokensDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.users`: Exposes CRUD operations for the **Users** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.users.findMany()
    * ```
    */
  get users(): Prisma.UsersDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleContentBlocks`: Exposes CRUD operations for the **ArticleContentBlocks** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleContentBlocks
    * const articleContentBlocks = await prisma.articleContentBlocks.findMany()
    * ```
    */
  get articleContentBlocks(): Prisma.ArticleContentBlocksDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.articleLikes`: Exposes CRUD operations for the **ArticleLikes** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ArticleLikes
    * const articleLikes = await prisma.articleLikes.findMany()
    * ```
    */
  get articleLikes(): Prisma.ArticleLikesDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Categories: 'Categories',
    HotSearchKeywords: 'HotSearchKeywords',
    Articles: 'Articles',
    RefreshTokens: 'RefreshTokens',
    Users: 'Users',
    ArticleContentBlocks: 'ArticleContentBlocks',
    ArticleLikes: 'ArticleLikes'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "categories" | "hotSearchKeywords" | "articles" | "refreshTokens" | "users" | "articleContentBlocks" | "articleLikes"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Categories: {
        payload: Prisma.$CategoriesPayload<ExtArgs>
        fields: Prisma.CategoriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>
          }
          findFirst: {
            args: Prisma.CategoriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>
          }
          findMany: {
            args: Prisma.CategoriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>[]
          }
          create: {
            args: Prisma.CategoriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>
          }
          createMany: {
            args: Prisma.CategoriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CategoriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>
          }
          update: {
            args: Prisma.CategoriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>
          }
          deleteMany: {
            args: Prisma.CategoriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoriesPayload>
          }
          aggregate: {
            args: Prisma.CategoriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategories>
          }
          groupBy: {
            args: Prisma.CategoriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoriesCountArgs<ExtArgs>
            result: $Utils.Optional<CategoriesCountAggregateOutputType> | number
          }
        }
      }
      HotSearchKeywords: {
        payload: Prisma.$HotSearchKeywordsPayload<ExtArgs>
        fields: Prisma.HotSearchKeywordsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HotSearchKeywordsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HotSearchKeywordsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>
          }
          findFirst: {
            args: Prisma.HotSearchKeywordsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HotSearchKeywordsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>
          }
          findMany: {
            args: Prisma.HotSearchKeywordsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>[]
          }
          create: {
            args: Prisma.HotSearchKeywordsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>
          }
          createMany: {
            args: Prisma.HotSearchKeywordsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.HotSearchKeywordsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>
          }
          update: {
            args: Prisma.HotSearchKeywordsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>
          }
          deleteMany: {
            args: Prisma.HotSearchKeywordsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HotSearchKeywordsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HotSearchKeywordsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HotSearchKeywordsPayload>
          }
          aggregate: {
            args: Prisma.HotSearchKeywordsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHotSearchKeywords>
          }
          groupBy: {
            args: Prisma.HotSearchKeywordsGroupByArgs<ExtArgs>
            result: $Utils.Optional<HotSearchKeywordsGroupByOutputType>[]
          }
          count: {
            args: Prisma.HotSearchKeywordsCountArgs<ExtArgs>
            result: $Utils.Optional<HotSearchKeywordsCountAggregateOutputType> | number
          }
        }
      }
      Articles: {
        payload: Prisma.$ArticlesPayload<ExtArgs>
        fields: Prisma.ArticlesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticlesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticlesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>
          }
          findFirst: {
            args: Prisma.ArticlesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticlesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>
          }
          findMany: {
            args: Prisma.ArticlesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>[]
          }
          create: {
            args: Prisma.ArticlesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>
          }
          createMany: {
            args: Prisma.ArticlesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ArticlesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>
          }
          update: {
            args: Prisma.ArticlesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>
          }
          deleteMany: {
            args: Prisma.ArticlesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticlesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ArticlesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticlesPayload>
          }
          aggregate: {
            args: Prisma.ArticlesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticles>
          }
          groupBy: {
            args: Prisma.ArticlesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticlesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticlesCountArgs<ExtArgs>
            result: $Utils.Optional<ArticlesCountAggregateOutputType> | number
          }
        }
      }
      RefreshTokens: {
        payload: Prisma.$RefreshTokensPayload<ExtArgs>
        fields: Prisma.RefreshTokensFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokensFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokensFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokensFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokensFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>
          }
          findMany: {
            args: Prisma.RefreshTokensFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>[]
          }
          create: {
            args: Prisma.RefreshTokensCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>
          }
          createMany: {
            args: Prisma.RefreshTokensCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RefreshTokensDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>
          }
          update: {
            args: Prisma.RefreshTokensUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokensDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokensUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RefreshTokensUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokensPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokensAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshTokens>
          }
          groupBy: {
            args: Prisma.RefreshTokensGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokensGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokensCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokensCountAggregateOutputType> | number
          }
        }
      }
      Users: {
        payload: Prisma.$UsersPayload<ExtArgs>
        fields: Prisma.UsersFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsersFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsersFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findFirst: {
            args: Prisma.UsersFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsersFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          findMany: {
            args: Prisma.UsersFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>[]
          }
          create: {
            args: Prisma.UsersCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          createMany: {
            args: Prisma.UsersCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UsersDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          update: {
            args: Prisma.UsersUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          deleteMany: {
            args: Prisma.UsersDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UsersUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UsersUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UsersPayload>
          }
          aggregate: {
            args: Prisma.UsersAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsers>
          }
          groupBy: {
            args: Prisma.UsersGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsersGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsersCountArgs<ExtArgs>
            result: $Utils.Optional<UsersCountAggregateOutputType> | number
          }
        }
      }
      ArticleContentBlocks: {
        payload: Prisma.$ArticleContentBlocksPayload<ExtArgs>
        fields: Prisma.ArticleContentBlocksFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleContentBlocksFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleContentBlocksFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>
          }
          findFirst: {
            args: Prisma.ArticleContentBlocksFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleContentBlocksFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>
          }
          findMany: {
            args: Prisma.ArticleContentBlocksFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>[]
          }
          create: {
            args: Prisma.ArticleContentBlocksCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>
          }
          createMany: {
            args: Prisma.ArticleContentBlocksCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ArticleContentBlocksDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>
          }
          update: {
            args: Prisma.ArticleContentBlocksUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>
          }
          deleteMany: {
            args: Prisma.ArticleContentBlocksDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleContentBlocksUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ArticleContentBlocksUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleContentBlocksPayload>
          }
          aggregate: {
            args: Prisma.ArticleContentBlocksAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleContentBlocks>
          }
          groupBy: {
            args: Prisma.ArticleContentBlocksGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleContentBlocksGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleContentBlocksCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleContentBlocksCountAggregateOutputType> | number
          }
        }
      }
      ArticleLikes: {
        payload: Prisma.$ArticleLikesPayload<ExtArgs>
        fields: Prisma.ArticleLikesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ArticleLikesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ArticleLikesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>
          }
          findFirst: {
            args: Prisma.ArticleLikesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ArticleLikesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>
          }
          findMany: {
            args: Prisma.ArticleLikesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>[]
          }
          create: {
            args: Prisma.ArticleLikesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>
          }
          createMany: {
            args: Prisma.ArticleLikesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ArticleLikesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>
          }
          update: {
            args: Prisma.ArticleLikesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>
          }
          deleteMany: {
            args: Prisma.ArticleLikesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ArticleLikesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ArticleLikesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ArticleLikesPayload>
          }
          aggregate: {
            args: Prisma.ArticleLikesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateArticleLikes>
          }
          groupBy: {
            args: Prisma.ArticleLikesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ArticleLikesGroupByOutputType>[]
          }
          count: {
            args: Prisma.ArticleLikesCountArgs<ExtArgs>
            result: $Utils.Optional<ArticleLikesCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    categories?: CategoriesOmit
    hotSearchKeywords?: HotSearchKeywordsOmit
    articles?: ArticlesOmit
    refreshTokens?: RefreshTokensOmit
    users?: UsersOmit
    articleContentBlocks?: ArticleContentBlocksOmit
    articleLikes?: ArticleLikesOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CategoriesCountOutputType
   */

  export type CategoriesCountOutputType = {
    articles: number
  }

  export type CategoriesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | CategoriesCountOutputTypeCountArticlesArgs
  }

  // Custom InputTypes
  /**
   * CategoriesCountOutputType without action
   */
  export type CategoriesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoriesCountOutputType
     */
    select?: CategoriesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoriesCountOutputType without action
   */
  export type CategoriesCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticlesWhereInput
  }


  /**
   * Count Type ArticlesCountOutputType
   */

  export type ArticlesCountOutputType = {
    article_content_blocks: number
    article_likes: number
  }

  export type ArticlesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    article_content_blocks?: boolean | ArticlesCountOutputTypeCountArticle_content_blocksArgs
    article_likes?: boolean | ArticlesCountOutputTypeCountArticle_likesArgs
  }

  // Custom InputTypes
  /**
   * ArticlesCountOutputType without action
   */
  export type ArticlesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticlesCountOutputType
     */
    select?: ArticlesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ArticlesCountOutputType without action
   */
  export type ArticlesCountOutputTypeCountArticle_content_blocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleContentBlocksWhereInput
  }

  /**
   * ArticlesCountOutputType without action
   */
  export type ArticlesCountOutputTypeCountArticle_likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleLikesWhereInput
  }


  /**
   * Count Type UsersCountOutputType
   */

  export type UsersCountOutputType = {
    articles: number
    refresh_tokens: number
    article_likes: number
  }

  export type UsersCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | UsersCountOutputTypeCountArticlesArgs
    refresh_tokens?: boolean | UsersCountOutputTypeCountRefresh_tokensArgs
    article_likes?: boolean | UsersCountOutputTypeCountArticle_likesArgs
  }

  // Custom InputTypes
  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsersCountOutputType
     */
    select?: UsersCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountArticlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticlesWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountRefresh_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokensWhereInput
  }

  /**
   * UsersCountOutputType without action
   */
  export type UsersCountOutputTypeCountArticle_likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleLikesWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Categories
   */

  export type AggregateCategories = {
    _count: CategoriesCountAggregateOutputType | null
    _avg: CategoriesAvgAggregateOutputType | null
    _sum: CategoriesSumAggregateOutputType | null
    _min: CategoriesMinAggregateOutputType | null
    _max: CategoriesMaxAggregateOutputType | null
  }

  export type CategoriesAvgAggregateOutputType = {
    article_count: number | null
    sort_order: number | null
    created_at: number | null
    updated_at: number | null
  }

  export type CategoriesSumAggregateOutputType = {
    article_count: number | null
    sort_order: number | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type CategoriesMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    image_url: string | null
    article_count: number | null
    sort_order: number | null
    is_active: boolean | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type CategoriesMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    image_url: string | null
    article_count: number | null
    sort_order: number | null
    is_active: boolean | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type CategoriesCountAggregateOutputType = {
    id: number
    name: number
    description: number
    image_url: number
    article_count: number
    sort_order: number
    is_active: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CategoriesAvgAggregateInputType = {
    article_count?: true
    sort_order?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoriesSumAggregateInputType = {
    article_count?: true
    sort_order?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoriesMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image_url?: true
    article_count?: true
    sort_order?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoriesMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image_url?: true
    article_count?: true
    sort_order?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type CategoriesCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    image_url?: true
    article_count?: true
    sort_order?: true
    is_active?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CategoriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to aggregate.
     */
    where?: CategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoriesOrderByWithRelationInput | CategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategoriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategoriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoriesMaxAggregateInputType
  }

  export type GetCategoriesAggregateType<T extends CategoriesAggregateArgs> = {
        [P in keyof T & keyof AggregateCategories]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategories[P]>
      : GetScalarType<T[P], AggregateCategories[P]>
  }




  export type CategoriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoriesWhereInput
    orderBy?: CategoriesOrderByWithAggregationInput | CategoriesOrderByWithAggregationInput[]
    by: CategoriesScalarFieldEnum[] | CategoriesScalarFieldEnum
    having?: CategoriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoriesCountAggregateInputType | true
    _avg?: CategoriesAvgAggregateInputType
    _sum?: CategoriesSumAggregateInputType
    _min?: CategoriesMinAggregateInputType
    _max?: CategoriesMaxAggregateInputType
  }

  export type CategoriesGroupByOutputType = {
    id: string
    name: string
    description: string | null
    image_url: string | null
    article_count: number
    sort_order: number | null
    is_active: boolean
    created_at: bigint
    updated_at: bigint
    _count: CategoriesCountAggregateOutputType | null
    _avg: CategoriesAvgAggregateOutputType | null
    _sum: CategoriesSumAggregateOutputType | null
    _min: CategoriesMinAggregateOutputType | null
    _max: CategoriesMaxAggregateOutputType | null
  }

  type GetCategoriesGroupByPayload<T extends CategoriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoriesGroupByOutputType[P]>
            : GetScalarType<T[P], CategoriesGroupByOutputType[P]>
        }
      >
    >


  export type CategoriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    article_count?: boolean
    sort_order?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
    articles?: boolean | Categories$articlesArgs<ExtArgs>
    _count?: boolean | CategoriesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categories"]>



  export type CategoriesSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    image_url?: boolean
    article_count?: boolean
    sort_order?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CategoriesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "image_url" | "article_count" | "sort_order" | "is_active" | "created_at" | "updated_at", ExtArgs["result"]["categories"]>
  export type CategoriesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | Categories$articlesArgs<ExtArgs>
    _count?: boolean | CategoriesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CategoriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Categories"
    objects: {
      articles: Prisma.$ArticlesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      image_url: string | null
      article_count: number
      sort_order: number | null
      is_active: boolean
      created_at: bigint
      updated_at: bigint
    }, ExtArgs["result"]["categories"]>
    composites: {}
  }

  type CategoriesGetPayload<S extends boolean | null | undefined | CategoriesDefaultArgs> = $Result.GetResult<Prisma.$CategoriesPayload, S>

  type CategoriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CategoriesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategoriesCountAggregateInputType | true
    }

  export interface CategoriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Categories'], meta: { name: 'Categories' } }
    /**
     * Find zero or one Categories that matches the filter.
     * @param {CategoriesFindUniqueArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoriesFindUniqueArgs>(args: SelectSubset<T, CategoriesFindUniqueArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Categories that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CategoriesFindUniqueOrThrowArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoriesFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesFindFirstArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoriesFindFirstArgs>(args?: SelectSubset<T, CategoriesFindFirstArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categories that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesFindFirstOrThrowArgs} args - Arguments to find a Categories
     * @example
     * // Get one Categories
     * const categories = await prisma.categories.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoriesFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.categories.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.categories.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoriesWithIdOnly = await prisma.categories.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoriesFindManyArgs>(args?: SelectSubset<T, CategoriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Categories.
     * @param {CategoriesCreateArgs} args - Arguments to create a Categories.
     * @example
     * // Create one Categories
     * const Categories = await prisma.categories.create({
     *   data: {
     *     // ... data to create a Categories
     *   }
     * })
     * 
     */
    create<T extends CategoriesCreateArgs>(args: SelectSubset<T, CategoriesCreateArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {CategoriesCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const categories = await prisma.categories.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoriesCreateManyArgs>(args?: SelectSubset<T, CategoriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Categories.
     * @param {CategoriesDeleteArgs} args - Arguments to delete one Categories.
     * @example
     * // Delete one Categories
     * const Categories = await prisma.categories.delete({
     *   where: {
     *     // ... filter to delete one Categories
     *   }
     * })
     * 
     */
    delete<T extends CategoriesDeleteArgs>(args: SelectSubset<T, CategoriesDeleteArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Categories.
     * @param {CategoriesUpdateArgs} args - Arguments to update one Categories.
     * @example
     * // Update one Categories
     * const categories = await prisma.categories.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoriesUpdateArgs>(args: SelectSubset<T, CategoriesUpdateArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {CategoriesDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.categories.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoriesDeleteManyArgs>(args?: SelectSubset<T, CategoriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const categories = await prisma.categories.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoriesUpdateManyArgs>(args: SelectSubset<T, CategoriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Categories.
     * @param {CategoriesUpsertArgs} args - Arguments to update or create a Categories.
     * @example
     * // Update or create a Categories
     * const categories = await prisma.categories.upsert({
     *   create: {
     *     // ... data to create a Categories
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categories we want to update
     *   }
     * })
     */
    upsert<T extends CategoriesUpsertArgs>(args: SelectSubset<T, CategoriesUpsertArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.categories.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoriesCountArgs>(
      args?: Subset<T, CategoriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoriesAggregateArgs>(args: Subset<T, CategoriesAggregateArgs>): Prisma.PrismaPromise<GetCategoriesAggregateType<T>>

    /**
     * Group by Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoriesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoriesGroupByArgs['orderBy'] }
        : { orderBy?: CategoriesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Categories model
   */
  readonly fields: CategoriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Categories.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    articles<T extends Categories$articlesArgs<ExtArgs> = {}>(args?: Subset<T, Categories$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Categories model
   */
  interface CategoriesFieldRefs {
    readonly id: FieldRef<"Categories", 'String'>
    readonly name: FieldRef<"Categories", 'String'>
    readonly description: FieldRef<"Categories", 'String'>
    readonly image_url: FieldRef<"Categories", 'String'>
    readonly article_count: FieldRef<"Categories", 'Int'>
    readonly sort_order: FieldRef<"Categories", 'Int'>
    readonly is_active: FieldRef<"Categories", 'Boolean'>
    readonly created_at: FieldRef<"Categories", 'BigInt'>
    readonly updated_at: FieldRef<"Categories", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * Categories findUnique
   */
  export type CategoriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where: CategoriesWhereUniqueInput
  }

  /**
   * Categories findUniqueOrThrow
   */
  export type CategoriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where: CategoriesWhereUniqueInput
  }

  /**
   * Categories findFirst
   */
  export type CategoriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoriesOrderByWithRelationInput | CategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }

  /**
   * Categories findFirstOrThrow
   */
  export type CategoriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoriesOrderByWithRelationInput | CategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }

  /**
   * Categories findMany
   */
  export type CategoriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoriesOrderByWithRelationInput | CategoriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoriesScalarFieldEnum | CategoriesScalarFieldEnum[]
  }

  /**
   * Categories create
   */
  export type CategoriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * The data needed to create a Categories.
     */
    data: XOR<CategoriesCreateInput, CategoriesUncheckedCreateInput>
  }

  /**
   * Categories createMany
   */
  export type CategoriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoriesCreateManyInput | CategoriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Categories update
   */
  export type CategoriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * The data needed to update a Categories.
     */
    data: XOR<CategoriesUpdateInput, CategoriesUncheckedUpdateInput>
    /**
     * Choose, which Categories to update.
     */
    where: CategoriesWhereUniqueInput
  }

  /**
   * Categories updateMany
   */
  export type CategoriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoriesUpdateManyMutationInput, CategoriesUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoriesWhereInput
    /**
     * Limit how many Categories to update.
     */
    limit?: number
  }

  /**
   * Categories upsert
   */
  export type CategoriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * The filter to search for the Categories to update in case it exists.
     */
    where: CategoriesWhereUniqueInput
    /**
     * In case the Categories found by the `where` argument doesn't exist, create a new Categories with this data.
     */
    create: XOR<CategoriesCreateInput, CategoriesUncheckedCreateInput>
    /**
     * In case the Categories was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoriesUpdateInput, CategoriesUncheckedUpdateInput>
  }

  /**
   * Categories delete
   */
  export type CategoriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
    /**
     * Filter which Categories to delete.
     */
    where: CategoriesWhereUniqueInput
  }

  /**
   * Categories deleteMany
   */
  export type CategoriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoriesWhereInput
    /**
     * Limit how many Categories to delete.
     */
    limit?: number
  }

  /**
   * Categories.articles
   */
  export type Categories$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    where?: ArticlesWhereInput
    orderBy?: ArticlesOrderByWithRelationInput | ArticlesOrderByWithRelationInput[]
    cursor?: ArticlesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticlesScalarFieldEnum | ArticlesScalarFieldEnum[]
  }

  /**
   * Categories without action
   */
  export type CategoriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Categories
     */
    select?: CategoriesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Categories
     */
    omit?: CategoriesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoriesInclude<ExtArgs> | null
  }


  /**
   * Model HotSearchKeywords
   */

  export type AggregateHotSearchKeywords = {
    _count: HotSearchKeywordsCountAggregateOutputType | null
    _avg: HotSearchKeywordsAvgAggregateOutputType | null
    _sum: HotSearchKeywordsSumAggregateOutputType | null
    _min: HotSearchKeywordsMinAggregateOutputType | null
    _max: HotSearchKeywordsMaxAggregateOutputType | null
  }

  export type HotSearchKeywordsAvgAggregateOutputType = {
    hot_score: number | null
    sort_order: number | null
    created_at: number | null
  }

  export type HotSearchKeywordsSumAggregateOutputType = {
    hot_score: number | null
    sort_order: number | null
    created_at: bigint | null
  }

  export type HotSearchKeywordsMinAggregateOutputType = {
    id: string | null
    keyword: string | null
    hot_score: number | null
    is_active: boolean | null
    sort_order: number | null
    created_at: bigint | null
  }

  export type HotSearchKeywordsMaxAggregateOutputType = {
    id: string | null
    keyword: string | null
    hot_score: number | null
    is_active: boolean | null
    sort_order: number | null
    created_at: bigint | null
  }

  export type HotSearchKeywordsCountAggregateOutputType = {
    id: number
    keyword: number
    hot_score: number
    is_active: number
    sort_order: number
    created_at: number
    _all: number
  }


  export type HotSearchKeywordsAvgAggregateInputType = {
    hot_score?: true
    sort_order?: true
    created_at?: true
  }

  export type HotSearchKeywordsSumAggregateInputType = {
    hot_score?: true
    sort_order?: true
    created_at?: true
  }

  export type HotSearchKeywordsMinAggregateInputType = {
    id?: true
    keyword?: true
    hot_score?: true
    is_active?: true
    sort_order?: true
    created_at?: true
  }

  export type HotSearchKeywordsMaxAggregateInputType = {
    id?: true
    keyword?: true
    hot_score?: true
    is_active?: true
    sort_order?: true
    created_at?: true
  }

  export type HotSearchKeywordsCountAggregateInputType = {
    id?: true
    keyword?: true
    hot_score?: true
    is_active?: true
    sort_order?: true
    created_at?: true
    _all?: true
  }

  export type HotSearchKeywordsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HotSearchKeywords to aggregate.
     */
    where?: HotSearchKeywordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotSearchKeywords to fetch.
     */
    orderBy?: HotSearchKeywordsOrderByWithRelationInput | HotSearchKeywordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HotSearchKeywordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotSearchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotSearchKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HotSearchKeywords
    **/
    _count?: true | HotSearchKeywordsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HotSearchKeywordsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HotSearchKeywordsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HotSearchKeywordsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HotSearchKeywordsMaxAggregateInputType
  }

  export type GetHotSearchKeywordsAggregateType<T extends HotSearchKeywordsAggregateArgs> = {
        [P in keyof T & keyof AggregateHotSearchKeywords]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHotSearchKeywords[P]>
      : GetScalarType<T[P], AggregateHotSearchKeywords[P]>
  }




  export type HotSearchKeywordsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HotSearchKeywordsWhereInput
    orderBy?: HotSearchKeywordsOrderByWithAggregationInput | HotSearchKeywordsOrderByWithAggregationInput[]
    by: HotSearchKeywordsScalarFieldEnum[] | HotSearchKeywordsScalarFieldEnum
    having?: HotSearchKeywordsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HotSearchKeywordsCountAggregateInputType | true
    _avg?: HotSearchKeywordsAvgAggregateInputType
    _sum?: HotSearchKeywordsSumAggregateInputType
    _min?: HotSearchKeywordsMinAggregateInputType
    _max?: HotSearchKeywordsMaxAggregateInputType
  }

  export type HotSearchKeywordsGroupByOutputType = {
    id: string
    keyword: string
    hot_score: number
    is_active: boolean
    sort_order: number | null
    created_at: bigint
    _count: HotSearchKeywordsCountAggregateOutputType | null
    _avg: HotSearchKeywordsAvgAggregateOutputType | null
    _sum: HotSearchKeywordsSumAggregateOutputType | null
    _min: HotSearchKeywordsMinAggregateOutputType | null
    _max: HotSearchKeywordsMaxAggregateOutputType | null
  }

  type GetHotSearchKeywordsGroupByPayload<T extends HotSearchKeywordsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HotSearchKeywordsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HotSearchKeywordsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HotSearchKeywordsGroupByOutputType[P]>
            : GetScalarType<T[P], HotSearchKeywordsGroupByOutputType[P]>
        }
      >
    >


  export type HotSearchKeywordsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    keyword?: boolean
    hot_score?: boolean
    is_active?: boolean
    sort_order?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["hotSearchKeywords"]>



  export type HotSearchKeywordsSelectScalar = {
    id?: boolean
    keyword?: boolean
    hot_score?: boolean
    is_active?: boolean
    sort_order?: boolean
    created_at?: boolean
  }

  export type HotSearchKeywordsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "keyword" | "hot_score" | "is_active" | "sort_order" | "created_at", ExtArgs["result"]["hotSearchKeywords"]>

  export type $HotSearchKeywordsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HotSearchKeywords"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      keyword: string
      hot_score: number
      is_active: boolean
      sort_order: number | null
      created_at: bigint
    }, ExtArgs["result"]["hotSearchKeywords"]>
    composites: {}
  }

  type HotSearchKeywordsGetPayload<S extends boolean | null | undefined | HotSearchKeywordsDefaultArgs> = $Result.GetResult<Prisma.$HotSearchKeywordsPayload, S>

  type HotSearchKeywordsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HotSearchKeywordsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HotSearchKeywordsCountAggregateInputType | true
    }

  export interface HotSearchKeywordsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HotSearchKeywords'], meta: { name: 'HotSearchKeywords' } }
    /**
     * Find zero or one HotSearchKeywords that matches the filter.
     * @param {HotSearchKeywordsFindUniqueArgs} args - Arguments to find a HotSearchKeywords
     * @example
     * // Get one HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HotSearchKeywordsFindUniqueArgs>(args: SelectSubset<T, HotSearchKeywordsFindUniqueArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HotSearchKeywords that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HotSearchKeywordsFindUniqueOrThrowArgs} args - Arguments to find a HotSearchKeywords
     * @example
     * // Get one HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HotSearchKeywordsFindUniqueOrThrowArgs>(args: SelectSubset<T, HotSearchKeywordsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HotSearchKeywords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsFindFirstArgs} args - Arguments to find a HotSearchKeywords
     * @example
     * // Get one HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HotSearchKeywordsFindFirstArgs>(args?: SelectSubset<T, HotSearchKeywordsFindFirstArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HotSearchKeywords that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsFindFirstOrThrowArgs} args - Arguments to find a HotSearchKeywords
     * @example
     * // Get one HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HotSearchKeywordsFindFirstOrThrowArgs>(args?: SelectSubset<T, HotSearchKeywordsFindFirstOrThrowArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HotSearchKeywords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.findMany()
     * 
     * // Get first 10 HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hotSearchKeywordsWithIdOnly = await prisma.hotSearchKeywords.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HotSearchKeywordsFindManyArgs>(args?: SelectSubset<T, HotSearchKeywordsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HotSearchKeywords.
     * @param {HotSearchKeywordsCreateArgs} args - Arguments to create a HotSearchKeywords.
     * @example
     * // Create one HotSearchKeywords
     * const HotSearchKeywords = await prisma.hotSearchKeywords.create({
     *   data: {
     *     // ... data to create a HotSearchKeywords
     *   }
     * })
     * 
     */
    create<T extends HotSearchKeywordsCreateArgs>(args: SelectSubset<T, HotSearchKeywordsCreateArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HotSearchKeywords.
     * @param {HotSearchKeywordsCreateManyArgs} args - Arguments to create many HotSearchKeywords.
     * @example
     * // Create many HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HotSearchKeywordsCreateManyArgs>(args?: SelectSubset<T, HotSearchKeywordsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a HotSearchKeywords.
     * @param {HotSearchKeywordsDeleteArgs} args - Arguments to delete one HotSearchKeywords.
     * @example
     * // Delete one HotSearchKeywords
     * const HotSearchKeywords = await prisma.hotSearchKeywords.delete({
     *   where: {
     *     // ... filter to delete one HotSearchKeywords
     *   }
     * })
     * 
     */
    delete<T extends HotSearchKeywordsDeleteArgs>(args: SelectSubset<T, HotSearchKeywordsDeleteArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HotSearchKeywords.
     * @param {HotSearchKeywordsUpdateArgs} args - Arguments to update one HotSearchKeywords.
     * @example
     * // Update one HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HotSearchKeywordsUpdateArgs>(args: SelectSubset<T, HotSearchKeywordsUpdateArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HotSearchKeywords.
     * @param {HotSearchKeywordsDeleteManyArgs} args - Arguments to filter HotSearchKeywords to delete.
     * @example
     * // Delete a few HotSearchKeywords
     * const { count } = await prisma.hotSearchKeywords.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HotSearchKeywordsDeleteManyArgs>(args?: SelectSubset<T, HotSearchKeywordsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HotSearchKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HotSearchKeywordsUpdateManyArgs>(args: SelectSubset<T, HotSearchKeywordsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HotSearchKeywords.
     * @param {HotSearchKeywordsUpsertArgs} args - Arguments to update or create a HotSearchKeywords.
     * @example
     * // Update or create a HotSearchKeywords
     * const hotSearchKeywords = await prisma.hotSearchKeywords.upsert({
     *   create: {
     *     // ... data to create a HotSearchKeywords
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HotSearchKeywords we want to update
     *   }
     * })
     */
    upsert<T extends HotSearchKeywordsUpsertArgs>(args: SelectSubset<T, HotSearchKeywordsUpsertArgs<ExtArgs>>): Prisma__HotSearchKeywordsClient<$Result.GetResult<Prisma.$HotSearchKeywordsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HotSearchKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsCountArgs} args - Arguments to filter HotSearchKeywords to count.
     * @example
     * // Count the number of HotSearchKeywords
     * const count = await prisma.hotSearchKeywords.count({
     *   where: {
     *     // ... the filter for the HotSearchKeywords we want to count
     *   }
     * })
    **/
    count<T extends HotSearchKeywordsCountArgs>(
      args?: Subset<T, HotSearchKeywordsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HotSearchKeywordsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HotSearchKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HotSearchKeywordsAggregateArgs>(args: Subset<T, HotSearchKeywordsAggregateArgs>): Prisma.PrismaPromise<GetHotSearchKeywordsAggregateType<T>>

    /**
     * Group by HotSearchKeywords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HotSearchKeywordsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HotSearchKeywordsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HotSearchKeywordsGroupByArgs['orderBy'] }
        : { orderBy?: HotSearchKeywordsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HotSearchKeywordsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHotSearchKeywordsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HotSearchKeywords model
   */
  readonly fields: HotSearchKeywordsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HotSearchKeywords.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HotSearchKeywordsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the HotSearchKeywords model
   */
  interface HotSearchKeywordsFieldRefs {
    readonly id: FieldRef<"HotSearchKeywords", 'String'>
    readonly keyword: FieldRef<"HotSearchKeywords", 'String'>
    readonly hot_score: FieldRef<"HotSearchKeywords", 'Int'>
    readonly is_active: FieldRef<"HotSearchKeywords", 'Boolean'>
    readonly sort_order: FieldRef<"HotSearchKeywords", 'Int'>
    readonly created_at: FieldRef<"HotSearchKeywords", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * HotSearchKeywords findUnique
   */
  export type HotSearchKeywordsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * Filter, which HotSearchKeywords to fetch.
     */
    where: HotSearchKeywordsWhereUniqueInput
  }

  /**
   * HotSearchKeywords findUniqueOrThrow
   */
  export type HotSearchKeywordsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * Filter, which HotSearchKeywords to fetch.
     */
    where: HotSearchKeywordsWhereUniqueInput
  }

  /**
   * HotSearchKeywords findFirst
   */
  export type HotSearchKeywordsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * Filter, which HotSearchKeywords to fetch.
     */
    where?: HotSearchKeywordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotSearchKeywords to fetch.
     */
    orderBy?: HotSearchKeywordsOrderByWithRelationInput | HotSearchKeywordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HotSearchKeywords.
     */
    cursor?: HotSearchKeywordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotSearchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotSearchKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HotSearchKeywords.
     */
    distinct?: HotSearchKeywordsScalarFieldEnum | HotSearchKeywordsScalarFieldEnum[]
  }

  /**
   * HotSearchKeywords findFirstOrThrow
   */
  export type HotSearchKeywordsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * Filter, which HotSearchKeywords to fetch.
     */
    where?: HotSearchKeywordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotSearchKeywords to fetch.
     */
    orderBy?: HotSearchKeywordsOrderByWithRelationInput | HotSearchKeywordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HotSearchKeywords.
     */
    cursor?: HotSearchKeywordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotSearchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotSearchKeywords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HotSearchKeywords.
     */
    distinct?: HotSearchKeywordsScalarFieldEnum | HotSearchKeywordsScalarFieldEnum[]
  }

  /**
   * HotSearchKeywords findMany
   */
  export type HotSearchKeywordsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * Filter, which HotSearchKeywords to fetch.
     */
    where?: HotSearchKeywordsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HotSearchKeywords to fetch.
     */
    orderBy?: HotSearchKeywordsOrderByWithRelationInput | HotSearchKeywordsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HotSearchKeywords.
     */
    cursor?: HotSearchKeywordsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HotSearchKeywords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HotSearchKeywords.
     */
    skip?: number
    distinct?: HotSearchKeywordsScalarFieldEnum | HotSearchKeywordsScalarFieldEnum[]
  }

  /**
   * HotSearchKeywords create
   */
  export type HotSearchKeywordsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * The data needed to create a HotSearchKeywords.
     */
    data: XOR<HotSearchKeywordsCreateInput, HotSearchKeywordsUncheckedCreateInput>
  }

  /**
   * HotSearchKeywords createMany
   */
  export type HotSearchKeywordsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HotSearchKeywords.
     */
    data: HotSearchKeywordsCreateManyInput | HotSearchKeywordsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HotSearchKeywords update
   */
  export type HotSearchKeywordsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * The data needed to update a HotSearchKeywords.
     */
    data: XOR<HotSearchKeywordsUpdateInput, HotSearchKeywordsUncheckedUpdateInput>
    /**
     * Choose, which HotSearchKeywords to update.
     */
    where: HotSearchKeywordsWhereUniqueInput
  }

  /**
   * HotSearchKeywords updateMany
   */
  export type HotSearchKeywordsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HotSearchKeywords.
     */
    data: XOR<HotSearchKeywordsUpdateManyMutationInput, HotSearchKeywordsUncheckedUpdateManyInput>
    /**
     * Filter which HotSearchKeywords to update
     */
    where?: HotSearchKeywordsWhereInput
    /**
     * Limit how many HotSearchKeywords to update.
     */
    limit?: number
  }

  /**
   * HotSearchKeywords upsert
   */
  export type HotSearchKeywordsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * The filter to search for the HotSearchKeywords to update in case it exists.
     */
    where: HotSearchKeywordsWhereUniqueInput
    /**
     * In case the HotSearchKeywords found by the `where` argument doesn't exist, create a new HotSearchKeywords with this data.
     */
    create: XOR<HotSearchKeywordsCreateInput, HotSearchKeywordsUncheckedCreateInput>
    /**
     * In case the HotSearchKeywords was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HotSearchKeywordsUpdateInput, HotSearchKeywordsUncheckedUpdateInput>
  }

  /**
   * HotSearchKeywords delete
   */
  export type HotSearchKeywordsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
    /**
     * Filter which HotSearchKeywords to delete.
     */
    where: HotSearchKeywordsWhereUniqueInput
  }

  /**
   * HotSearchKeywords deleteMany
   */
  export type HotSearchKeywordsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HotSearchKeywords to delete
     */
    where?: HotSearchKeywordsWhereInput
    /**
     * Limit how many HotSearchKeywords to delete.
     */
    limit?: number
  }

  /**
   * HotSearchKeywords without action
   */
  export type HotSearchKeywordsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HotSearchKeywords
     */
    select?: HotSearchKeywordsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HotSearchKeywords
     */
    omit?: HotSearchKeywordsOmit<ExtArgs> | null
  }


  /**
   * Model Articles
   */

  export type AggregateArticles = {
    _count: ArticlesCountAggregateOutputType | null
    _avg: ArticlesAvgAggregateOutputType | null
    _sum: ArticlesSumAggregateOutputType | null
    _min: ArticlesMinAggregateOutputType | null
    _max: ArticlesMaxAggregateOutputType | null
  }

  export type ArticlesAvgAggregateOutputType = {
    views: number | null
    likes: number | null
    comments_count: number | null
    read_time: number | null
    published_at: number | null
    created_at: number | null
    updated_at: number | null
  }

  export type ArticlesSumAggregateOutputType = {
    views: number | null
    likes: number | null
    comments_count: number | null
    read_time: number | null
    published_at: bigint | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type ArticlesMinAggregateOutputType = {
    id: string | null
    title: string | null
    summary: string | null
    cover_url: string | null
    category_id: string | null
    author_id: string | null
    author_name: string | null
    author_avatar: string | null
    tags: string | null
    views: number | null
    likes: number | null
    comments_count: number | null
    is_top: boolean | null
    read_time: number | null
    published_at: bigint | null
    is_published: boolean | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type ArticlesMaxAggregateOutputType = {
    id: string | null
    title: string | null
    summary: string | null
    cover_url: string | null
    category_id: string | null
    author_id: string | null
    author_name: string | null
    author_avatar: string | null
    tags: string | null
    views: number | null
    likes: number | null
    comments_count: number | null
    is_top: boolean | null
    read_time: number | null
    published_at: bigint | null
    is_published: boolean | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type ArticlesCountAggregateOutputType = {
    id: number
    title: number
    summary: number
    cover_url: number
    category_id: number
    author_id: number
    author_name: number
    author_avatar: number
    tags: number
    views: number
    likes: number
    comments_count: number
    is_top: number
    read_time: number
    published_at: number
    is_published: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ArticlesAvgAggregateInputType = {
    views?: true
    likes?: true
    comments_count?: true
    read_time?: true
    published_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticlesSumAggregateInputType = {
    views?: true
    likes?: true
    comments_count?: true
    read_time?: true
    published_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticlesMinAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    cover_url?: true
    category_id?: true
    author_id?: true
    author_name?: true
    author_avatar?: true
    tags?: true
    views?: true
    likes?: true
    comments_count?: true
    is_top?: true
    read_time?: true
    published_at?: true
    is_published?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticlesMaxAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    cover_url?: true
    category_id?: true
    author_id?: true
    author_name?: true
    author_avatar?: true
    tags?: true
    views?: true
    likes?: true
    comments_count?: true
    is_top?: true
    read_time?: true
    published_at?: true
    is_published?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticlesCountAggregateInputType = {
    id?: true
    title?: true
    summary?: true
    cover_url?: true
    category_id?: true
    author_id?: true
    author_name?: true
    author_avatar?: true
    tags?: true
    views?: true
    likes?: true
    comments_count?: true
    is_top?: true
    read_time?: true
    published_at?: true
    is_published?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ArticlesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to aggregate.
     */
    where?: ArticlesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticlesOrderByWithRelationInput | ArticlesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticlesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Articles
    **/
    _count?: true | ArticlesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticlesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticlesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticlesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticlesMaxAggregateInputType
  }

  export type GetArticlesAggregateType<T extends ArticlesAggregateArgs> = {
        [P in keyof T & keyof AggregateArticles]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticles[P]>
      : GetScalarType<T[P], AggregateArticles[P]>
  }




  export type ArticlesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticlesWhereInput
    orderBy?: ArticlesOrderByWithAggregationInput | ArticlesOrderByWithAggregationInput[]
    by: ArticlesScalarFieldEnum[] | ArticlesScalarFieldEnum
    having?: ArticlesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticlesCountAggregateInputType | true
    _avg?: ArticlesAvgAggregateInputType
    _sum?: ArticlesSumAggregateInputType
    _min?: ArticlesMinAggregateInputType
    _max?: ArticlesMaxAggregateInputType
  }

  export type ArticlesGroupByOutputType = {
    id: string
    title: string
    summary: string | null
    cover_url: string | null
    category_id: string
    author_id: string
    author_name: string | null
    author_avatar: string | null
    tags: string | null
    views: number
    likes: number
    comments_count: number
    is_top: boolean
    read_time: number | null
    published_at: bigint
    is_published: boolean
    created_at: bigint
    updated_at: bigint
    _count: ArticlesCountAggregateOutputType | null
    _avg: ArticlesAvgAggregateOutputType | null
    _sum: ArticlesSumAggregateOutputType | null
    _min: ArticlesMinAggregateOutputType | null
    _max: ArticlesMaxAggregateOutputType | null
  }

  type GetArticlesGroupByPayload<T extends ArticlesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticlesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticlesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticlesGroupByOutputType[P]>
            : GetScalarType<T[P], ArticlesGroupByOutputType[P]>
        }
      >
    >


  export type ArticlesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    summary?: boolean
    cover_url?: boolean
    category_id?: boolean
    author_id?: boolean
    author_name?: boolean
    author_avatar?: boolean
    tags?: boolean
    views?: boolean
    likes?: boolean
    comments_count?: boolean
    is_top?: boolean
    read_time?: boolean
    published_at?: boolean
    is_published?: boolean
    created_at?: boolean
    updated_at?: boolean
    categories?: boolean | CategoriesDefaultArgs<ExtArgs>
    users?: boolean | UsersDefaultArgs<ExtArgs>
    article_content_blocks?: boolean | Articles$article_content_blocksArgs<ExtArgs>
    article_likes?: boolean | Articles$article_likesArgs<ExtArgs>
    _count?: boolean | ArticlesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articles"]>



  export type ArticlesSelectScalar = {
    id?: boolean
    title?: boolean
    summary?: boolean
    cover_url?: boolean
    category_id?: boolean
    author_id?: boolean
    author_name?: boolean
    author_avatar?: boolean
    tags?: boolean
    views?: boolean
    likes?: boolean
    comments_count?: boolean
    is_top?: boolean
    read_time?: boolean
    published_at?: boolean
    is_published?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ArticlesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "summary" | "cover_url" | "category_id" | "author_id" | "author_name" | "author_avatar" | "tags" | "views" | "likes" | "comments_count" | "is_top" | "read_time" | "published_at" | "is_published" | "created_at" | "updated_at", ExtArgs["result"]["articles"]>
  export type ArticlesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categories?: boolean | CategoriesDefaultArgs<ExtArgs>
    users?: boolean | UsersDefaultArgs<ExtArgs>
    article_content_blocks?: boolean | Articles$article_content_blocksArgs<ExtArgs>
    article_likes?: boolean | Articles$article_likesArgs<ExtArgs>
    _count?: boolean | ArticlesCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ArticlesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Articles"
    objects: {
      categories: Prisma.$CategoriesPayload<ExtArgs>
      users: Prisma.$UsersPayload<ExtArgs>
      article_content_blocks: Prisma.$ArticleContentBlocksPayload<ExtArgs>[]
      article_likes: Prisma.$ArticleLikesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      summary: string | null
      cover_url: string | null
      category_id: string
      author_id: string
      author_name: string | null
      author_avatar: string | null
      tags: string | null
      views: number
      likes: number
      comments_count: number
      is_top: boolean
      read_time: number | null
      published_at: bigint
      is_published: boolean
      created_at: bigint
      updated_at: bigint
    }, ExtArgs["result"]["articles"]>
    composites: {}
  }

  type ArticlesGetPayload<S extends boolean | null | undefined | ArticlesDefaultArgs> = $Result.GetResult<Prisma.$ArticlesPayload, S>

  type ArticlesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticlesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticlesCountAggregateInputType | true
    }

  export interface ArticlesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Articles'], meta: { name: 'Articles' } }
    /**
     * Find zero or one Articles that matches the filter.
     * @param {ArticlesFindUniqueArgs} args - Arguments to find a Articles
     * @example
     * // Get one Articles
     * const articles = await prisma.articles.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticlesFindUniqueArgs>(args: SelectSubset<T, ArticlesFindUniqueArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Articles that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticlesFindUniqueOrThrowArgs} args - Arguments to find a Articles
     * @example
     * // Get one Articles
     * const articles = await prisma.articles.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticlesFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticlesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesFindFirstArgs} args - Arguments to find a Articles
     * @example
     * // Get one Articles
     * const articles = await prisma.articles.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticlesFindFirstArgs>(args?: SelectSubset<T, ArticlesFindFirstArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Articles that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesFindFirstOrThrowArgs} args - Arguments to find a Articles
     * @example
     * // Get one Articles
     * const articles = await prisma.articles.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticlesFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticlesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Articles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Articles
     * const articles = await prisma.articles.findMany()
     * 
     * // Get first 10 Articles
     * const articles = await prisma.articles.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articlesWithIdOnly = await prisma.articles.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticlesFindManyArgs>(args?: SelectSubset<T, ArticlesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Articles.
     * @param {ArticlesCreateArgs} args - Arguments to create a Articles.
     * @example
     * // Create one Articles
     * const Articles = await prisma.articles.create({
     *   data: {
     *     // ... data to create a Articles
     *   }
     * })
     * 
     */
    create<T extends ArticlesCreateArgs>(args: SelectSubset<T, ArticlesCreateArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Articles.
     * @param {ArticlesCreateManyArgs} args - Arguments to create many Articles.
     * @example
     * // Create many Articles
     * const articles = await prisma.articles.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticlesCreateManyArgs>(args?: SelectSubset<T, ArticlesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Articles.
     * @param {ArticlesDeleteArgs} args - Arguments to delete one Articles.
     * @example
     * // Delete one Articles
     * const Articles = await prisma.articles.delete({
     *   where: {
     *     // ... filter to delete one Articles
     *   }
     * })
     * 
     */
    delete<T extends ArticlesDeleteArgs>(args: SelectSubset<T, ArticlesDeleteArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Articles.
     * @param {ArticlesUpdateArgs} args - Arguments to update one Articles.
     * @example
     * // Update one Articles
     * const articles = await prisma.articles.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticlesUpdateArgs>(args: SelectSubset<T, ArticlesUpdateArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Articles.
     * @param {ArticlesDeleteManyArgs} args - Arguments to filter Articles to delete.
     * @example
     * // Delete a few Articles
     * const { count } = await prisma.articles.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticlesDeleteManyArgs>(args?: SelectSubset<T, ArticlesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Articles
     * const articles = await prisma.articles.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticlesUpdateManyArgs>(args: SelectSubset<T, ArticlesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Articles.
     * @param {ArticlesUpsertArgs} args - Arguments to update or create a Articles.
     * @example
     * // Update or create a Articles
     * const articles = await prisma.articles.upsert({
     *   create: {
     *     // ... data to create a Articles
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Articles we want to update
     *   }
     * })
     */
    upsert<T extends ArticlesUpsertArgs>(args: SelectSubset<T, ArticlesUpsertArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesCountArgs} args - Arguments to filter Articles to count.
     * @example
     * // Count the number of Articles
     * const count = await prisma.articles.count({
     *   where: {
     *     // ... the filter for the Articles we want to count
     *   }
     * })
    **/
    count<T extends ArticlesCountArgs>(
      args?: Subset<T, ArticlesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticlesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticlesAggregateArgs>(args: Subset<T, ArticlesAggregateArgs>): Prisma.PrismaPromise<GetArticlesAggregateType<T>>

    /**
     * Group by Articles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticlesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticlesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticlesGroupByArgs['orderBy'] }
        : { orderBy?: ArticlesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticlesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticlesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Articles model
   */
  readonly fields: ArticlesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Articles.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticlesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categories<T extends CategoriesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoriesDefaultArgs<ExtArgs>>): Prisma__CategoriesClient<$Result.GetResult<Prisma.$CategoriesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    article_content_blocks<T extends Articles$article_content_blocksArgs<ExtArgs> = {}>(args?: Subset<T, Articles$article_content_blocksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    article_likes<T extends Articles$article_likesArgs<ExtArgs> = {}>(args?: Subset<T, Articles$article_likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Articles model
   */
  interface ArticlesFieldRefs {
    readonly id: FieldRef<"Articles", 'String'>
    readonly title: FieldRef<"Articles", 'String'>
    readonly summary: FieldRef<"Articles", 'String'>
    readonly cover_url: FieldRef<"Articles", 'String'>
    readonly category_id: FieldRef<"Articles", 'String'>
    readonly author_id: FieldRef<"Articles", 'String'>
    readonly author_name: FieldRef<"Articles", 'String'>
    readonly author_avatar: FieldRef<"Articles", 'String'>
    readonly tags: FieldRef<"Articles", 'String'>
    readonly views: FieldRef<"Articles", 'Int'>
    readonly likes: FieldRef<"Articles", 'Int'>
    readonly comments_count: FieldRef<"Articles", 'Int'>
    readonly is_top: FieldRef<"Articles", 'Boolean'>
    readonly read_time: FieldRef<"Articles", 'Int'>
    readonly published_at: FieldRef<"Articles", 'BigInt'>
    readonly is_published: FieldRef<"Articles", 'Boolean'>
    readonly created_at: FieldRef<"Articles", 'BigInt'>
    readonly updated_at: FieldRef<"Articles", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * Articles findUnique
   */
  export type ArticlesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where: ArticlesWhereUniqueInput
  }

  /**
   * Articles findUniqueOrThrow
   */
  export type ArticlesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where: ArticlesWhereUniqueInput
  }

  /**
   * Articles findFirst
   */
  export type ArticlesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticlesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticlesOrderByWithRelationInput | ArticlesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticlesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticlesScalarFieldEnum | ArticlesScalarFieldEnum[]
  }

  /**
   * Articles findFirstOrThrow
   */
  export type ArticlesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticlesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticlesOrderByWithRelationInput | ArticlesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Articles.
     */
    cursor?: ArticlesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Articles.
     */
    distinct?: ArticlesScalarFieldEnum | ArticlesScalarFieldEnum[]
  }

  /**
   * Articles findMany
   */
  export type ArticlesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * Filter, which Articles to fetch.
     */
    where?: ArticlesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Articles to fetch.
     */
    orderBy?: ArticlesOrderByWithRelationInput | ArticlesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Articles.
     */
    cursor?: ArticlesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Articles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Articles.
     */
    skip?: number
    distinct?: ArticlesScalarFieldEnum | ArticlesScalarFieldEnum[]
  }

  /**
   * Articles create
   */
  export type ArticlesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * The data needed to create a Articles.
     */
    data: XOR<ArticlesCreateInput, ArticlesUncheckedCreateInput>
  }

  /**
   * Articles createMany
   */
  export type ArticlesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Articles.
     */
    data: ArticlesCreateManyInput | ArticlesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Articles update
   */
  export type ArticlesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * The data needed to update a Articles.
     */
    data: XOR<ArticlesUpdateInput, ArticlesUncheckedUpdateInput>
    /**
     * Choose, which Articles to update.
     */
    where: ArticlesWhereUniqueInput
  }

  /**
   * Articles updateMany
   */
  export type ArticlesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Articles.
     */
    data: XOR<ArticlesUpdateManyMutationInput, ArticlesUncheckedUpdateManyInput>
    /**
     * Filter which Articles to update
     */
    where?: ArticlesWhereInput
    /**
     * Limit how many Articles to update.
     */
    limit?: number
  }

  /**
   * Articles upsert
   */
  export type ArticlesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * The filter to search for the Articles to update in case it exists.
     */
    where: ArticlesWhereUniqueInput
    /**
     * In case the Articles found by the `where` argument doesn't exist, create a new Articles with this data.
     */
    create: XOR<ArticlesCreateInput, ArticlesUncheckedCreateInput>
    /**
     * In case the Articles was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticlesUpdateInput, ArticlesUncheckedUpdateInput>
  }

  /**
   * Articles delete
   */
  export type ArticlesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    /**
     * Filter which Articles to delete.
     */
    where: ArticlesWhereUniqueInput
  }

  /**
   * Articles deleteMany
   */
  export type ArticlesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Articles to delete
     */
    where?: ArticlesWhereInput
    /**
     * Limit how many Articles to delete.
     */
    limit?: number
  }

  /**
   * Articles.article_content_blocks
   */
  export type Articles$article_content_blocksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    where?: ArticleContentBlocksWhereInput
    orderBy?: ArticleContentBlocksOrderByWithRelationInput | ArticleContentBlocksOrderByWithRelationInput[]
    cursor?: ArticleContentBlocksWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleContentBlocksScalarFieldEnum | ArticleContentBlocksScalarFieldEnum[]
  }

  /**
   * Articles.article_likes
   */
  export type Articles$article_likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    where?: ArticleLikesWhereInput
    orderBy?: ArticleLikesOrderByWithRelationInput | ArticleLikesOrderByWithRelationInput[]
    cursor?: ArticleLikesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleLikesScalarFieldEnum | ArticleLikesScalarFieldEnum[]
  }

  /**
   * Articles without action
   */
  export type ArticlesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
  }


  /**
   * Model RefreshTokens
   */

  export type AggregateRefreshTokens = {
    _count: RefreshTokensCountAggregateOutputType | null
    _avg: RefreshTokensAvgAggregateOutputType | null
    _sum: RefreshTokensSumAggregateOutputType | null
    _min: RefreshTokensMinAggregateOutputType | null
    _max: RefreshTokensMaxAggregateOutputType | null
  }

  export type RefreshTokensAvgAggregateOutputType = {
    expires_at: number | null
    created_at: number | null
  }

  export type RefreshTokensSumAggregateOutputType = {
    expires_at: bigint | null
    created_at: bigint | null
  }

  export type RefreshTokensMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    refresh_token: string | null
    client_ip: string | null
    expires_at: bigint | null
    revoked: boolean | null
    created_at: bigint | null
  }

  export type RefreshTokensMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    refresh_token: string | null
    client_ip: string | null
    expires_at: bigint | null
    revoked: boolean | null
    created_at: bigint | null
  }

  export type RefreshTokensCountAggregateOutputType = {
    id: number
    user_id: number
    refresh_token: number
    client_ip: number
    expires_at: number
    revoked: number
    created_at: number
    _all: number
  }


  export type RefreshTokensAvgAggregateInputType = {
    expires_at?: true
    created_at?: true
  }

  export type RefreshTokensSumAggregateInputType = {
    expires_at?: true
    created_at?: true
  }

  export type RefreshTokensMinAggregateInputType = {
    id?: true
    user_id?: true
    refresh_token?: true
    client_ip?: true
    expires_at?: true
    revoked?: true
    created_at?: true
  }

  export type RefreshTokensMaxAggregateInputType = {
    id?: true
    user_id?: true
    refresh_token?: true
    client_ip?: true
    expires_at?: true
    revoked?: true
    created_at?: true
  }

  export type RefreshTokensCountAggregateInputType = {
    id?: true
    user_id?: true
    refresh_token?: true
    client_ip?: true
    expires_at?: true
    revoked?: true
    created_at?: true
    _all?: true
  }

  export type RefreshTokensAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to aggregate.
     */
    where?: RefreshTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokensOrderByWithRelationInput | RefreshTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokensCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RefreshTokensAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RefreshTokensSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokensMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokensMaxAggregateInputType
  }

  export type GetRefreshTokensAggregateType<T extends RefreshTokensAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshTokens]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshTokens[P]>
      : GetScalarType<T[P], AggregateRefreshTokens[P]>
  }




  export type RefreshTokensGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokensWhereInput
    orderBy?: RefreshTokensOrderByWithAggregationInput | RefreshTokensOrderByWithAggregationInput[]
    by: RefreshTokensScalarFieldEnum[] | RefreshTokensScalarFieldEnum
    having?: RefreshTokensScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokensCountAggregateInputType | true
    _avg?: RefreshTokensAvgAggregateInputType
    _sum?: RefreshTokensSumAggregateInputType
    _min?: RefreshTokensMinAggregateInputType
    _max?: RefreshTokensMaxAggregateInputType
  }

  export type RefreshTokensGroupByOutputType = {
    id: string
    user_id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint
    revoked: boolean
    created_at: bigint
    _count: RefreshTokensCountAggregateOutputType | null
    _avg: RefreshTokensAvgAggregateOutputType | null
    _sum: RefreshTokensSumAggregateOutputType | null
    _min: RefreshTokensMinAggregateOutputType | null
    _max: RefreshTokensMaxAggregateOutputType | null
  }

  type GetRefreshTokensGroupByPayload<T extends RefreshTokensGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokensGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokensGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokensGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokensGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokensSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    refresh_token?: boolean
    client_ip?: boolean
    expires_at?: boolean
    revoked?: boolean
    created_at?: boolean
    users?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshTokens"]>



  export type RefreshTokensSelectScalar = {
    id?: boolean
    user_id?: boolean
    refresh_token?: boolean
    client_ip?: boolean
    expires_at?: boolean
    revoked?: boolean
    created_at?: boolean
  }

  export type RefreshTokensOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "refresh_token" | "client_ip" | "expires_at" | "revoked" | "created_at", ExtArgs["result"]["refreshTokens"]>
  export type RefreshTokensInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $RefreshTokensPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshTokens"
    objects: {
      users: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      refresh_token: string
      client_ip: string
      expires_at: bigint
      revoked: boolean
      created_at: bigint
    }, ExtArgs["result"]["refreshTokens"]>
    composites: {}
  }

  type RefreshTokensGetPayload<S extends boolean | null | undefined | RefreshTokensDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokensPayload, S>

  type RefreshTokensCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokensFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokensCountAggregateInputType | true
    }

  export interface RefreshTokensDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshTokens'], meta: { name: 'RefreshTokens' } }
    /**
     * Find zero or one RefreshTokens that matches the filter.
     * @param {RefreshTokensFindUniqueArgs} args - Arguments to find a RefreshTokens
     * @example
     * // Get one RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokensFindUniqueArgs>(args: SelectSubset<T, RefreshTokensFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshTokens that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokensFindUniqueOrThrowArgs} args - Arguments to find a RefreshTokens
     * @example
     * // Get one RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokensFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokensFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensFindFirstArgs} args - Arguments to find a RefreshTokens
     * @example
     * // Get one RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokensFindFirstArgs>(args?: SelectSubset<T, RefreshTokensFindFirstArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshTokens that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensFindFirstOrThrowArgs} args - Arguments to find a RefreshTokens
     * @example
     * // Get one RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokensFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokensFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokensWithIdOnly = await prisma.refreshTokens.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokensFindManyArgs>(args?: SelectSubset<T, RefreshTokensFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshTokens.
     * @param {RefreshTokensCreateArgs} args - Arguments to create a RefreshTokens.
     * @example
     * // Create one RefreshTokens
     * const RefreshTokens = await prisma.refreshTokens.create({
     *   data: {
     *     // ... data to create a RefreshTokens
     *   }
     * })
     * 
     */
    create<T extends RefreshTokensCreateArgs>(args: SelectSubset<T, RefreshTokensCreateArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokensCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokensCreateManyArgs>(args?: SelectSubset<T, RefreshTokensCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a RefreshTokens.
     * @param {RefreshTokensDeleteArgs} args - Arguments to delete one RefreshTokens.
     * @example
     * // Delete one RefreshTokens
     * const RefreshTokens = await prisma.refreshTokens.delete({
     *   where: {
     *     // ... filter to delete one RefreshTokens
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokensDeleteArgs>(args: SelectSubset<T, RefreshTokensDeleteArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshTokens.
     * @param {RefreshTokensUpdateArgs} args - Arguments to update one RefreshTokens.
     * @example
     * // Update one RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokensUpdateArgs>(args: SelectSubset<T, RefreshTokensUpdateArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokensDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshTokens.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokensDeleteManyArgs>(args?: SelectSubset<T, RefreshTokensDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokensUpdateManyArgs>(args: SelectSubset<T, RefreshTokensUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one RefreshTokens.
     * @param {RefreshTokensUpsertArgs} args - Arguments to update or create a RefreshTokens.
     * @example
     * // Update or create a RefreshTokens
     * const refreshTokens = await prisma.refreshTokens.upsert({
     *   create: {
     *     // ... data to create a RefreshTokens
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshTokens we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokensUpsertArgs>(args: SelectSubset<T, RefreshTokensUpsertArgs<ExtArgs>>): Prisma__RefreshTokensClient<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshTokens.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokensCountArgs>(
      args?: Subset<T, RefreshTokensCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokensCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokensAggregateArgs>(args: Subset<T, RefreshTokensAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokensAggregateType<T>>

    /**
     * Group by RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokensGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokensGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokensGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokensGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokensGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokensGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshTokens model
   */
  readonly fields: RefreshTokensFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshTokens.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokensClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshTokens model
   */
  interface RefreshTokensFieldRefs {
    readonly id: FieldRef<"RefreshTokens", 'String'>
    readonly user_id: FieldRef<"RefreshTokens", 'String'>
    readonly refresh_token: FieldRef<"RefreshTokens", 'String'>
    readonly client_ip: FieldRef<"RefreshTokens", 'String'>
    readonly expires_at: FieldRef<"RefreshTokens", 'BigInt'>
    readonly revoked: FieldRef<"RefreshTokens", 'Boolean'>
    readonly created_at: FieldRef<"RefreshTokens", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * RefreshTokens findUnique
   */
  export type RefreshTokensFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where: RefreshTokensWhereUniqueInput
  }

  /**
   * RefreshTokens findUniqueOrThrow
   */
  export type RefreshTokensFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where: RefreshTokensWhereUniqueInput
  }

  /**
   * RefreshTokens findFirst
   */
  export type RefreshTokensFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokensOrderByWithRelationInput | RefreshTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokensScalarFieldEnum | RefreshTokensScalarFieldEnum[]
  }

  /**
   * RefreshTokens findFirstOrThrow
   */
  export type RefreshTokensFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokensOrderByWithRelationInput | RefreshTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokensScalarFieldEnum | RefreshTokensScalarFieldEnum[]
  }

  /**
   * RefreshTokens findMany
   */
  export type RefreshTokensFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokensOrderByWithRelationInput | RefreshTokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokensScalarFieldEnum | RefreshTokensScalarFieldEnum[]
  }

  /**
   * RefreshTokens create
   */
  export type RefreshTokensCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshTokens.
     */
    data: XOR<RefreshTokensCreateInput, RefreshTokensUncheckedCreateInput>
  }

  /**
   * RefreshTokens createMany
   */
  export type RefreshTokensCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokensCreateManyInput | RefreshTokensCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshTokens update
   */
  export type RefreshTokensUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshTokens.
     */
    data: XOR<RefreshTokensUpdateInput, RefreshTokensUncheckedUpdateInput>
    /**
     * Choose, which RefreshTokens to update.
     */
    where: RefreshTokensWhereUniqueInput
  }

  /**
   * RefreshTokens updateMany
   */
  export type RefreshTokensUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokensUpdateManyMutationInput, RefreshTokensUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokensWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshTokens upsert
   */
  export type RefreshTokensUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshTokens to update in case it exists.
     */
    where: RefreshTokensWhereUniqueInput
    /**
     * In case the RefreshTokens found by the `where` argument doesn't exist, create a new RefreshTokens with this data.
     */
    create: XOR<RefreshTokensCreateInput, RefreshTokensUncheckedCreateInput>
    /**
     * In case the RefreshTokens was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokensUpdateInput, RefreshTokensUncheckedUpdateInput>
  }

  /**
   * RefreshTokens delete
   */
  export type RefreshTokensDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    /**
     * Filter which RefreshTokens to delete.
     */
    where: RefreshTokensWhereUniqueInput
  }

  /**
   * RefreshTokens deleteMany
   */
  export type RefreshTokensDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokensWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshTokens without action
   */
  export type RefreshTokensDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
  }


  /**
   * Model Users
   */

  export type AggregateUsers = {
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  export type UsersAvgAggregateOutputType = {
    created_at: number | null
    updated_at: number | null
  }

  export type UsersSumAggregateOutputType = {
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type UsersMinAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    password_algorithm: string | null
    email: string | null
    nickname: string | null
    avatar: string | null
    is_active: boolean | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type UsersMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password_hash: string | null
    password_algorithm: string | null
    email: string | null
    nickname: string | null
    avatar: string | null
    is_active: boolean | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type UsersCountAggregateOutputType = {
    id: number
    username: number
    password_hash: number
    password_algorithm: number
    email: number
    nickname: number
    avatar: number
    is_active: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UsersAvgAggregateInputType = {
    created_at?: true
    updated_at?: true
  }

  export type UsersSumAggregateInputType = {
    created_at?: true
    updated_at?: true
  }

  export type UsersMinAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    password_algorithm?: true
    email?: true
    nickname?: true
    avatar?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersMaxAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    password_algorithm?: true
    email?: true
    nickname?: true
    avatar?: true
    is_active?: true
    created_at?: true
    updated_at?: true
  }

  export type UsersCountAggregateInputType = {
    id?: true
    username?: true
    password_hash?: true
    password_algorithm?: true
    email?: true
    nickname?: true
    avatar?: true
    is_active?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UsersAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to aggregate.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UsersCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsersAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsersSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsersMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsersMaxAggregateInputType
  }

  export type GetUsersAggregateType<T extends UsersAggregateArgs> = {
        [P in keyof T & keyof AggregateUsers]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsers[P]>
      : GetScalarType<T[P], AggregateUsers[P]>
  }




  export type UsersGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsersWhereInput
    orderBy?: UsersOrderByWithAggregationInput | UsersOrderByWithAggregationInput[]
    by: UsersScalarFieldEnum[] | UsersScalarFieldEnum
    having?: UsersScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsersCountAggregateInputType | true
    _avg?: UsersAvgAggregateInputType
    _sum?: UsersSumAggregateInputType
    _min?: UsersMinAggregateInputType
    _max?: UsersMaxAggregateInputType
  }

  export type UsersGroupByOutputType = {
    id: string
    username: string
    password_hash: string
    password_algorithm: string | null
    email: string | null
    nickname: string | null
    avatar: string | null
    is_active: boolean
    created_at: bigint
    updated_at: bigint
    _count: UsersCountAggregateOutputType | null
    _avg: UsersAvgAggregateOutputType | null
    _sum: UsersSumAggregateOutputType | null
    _min: UsersMinAggregateOutputType | null
    _max: UsersMaxAggregateOutputType | null
  }

  type GetUsersGroupByPayload<T extends UsersGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsersGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsersGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsersGroupByOutputType[P]>
            : GetScalarType<T[P], UsersGroupByOutputType[P]>
        }
      >
    >


  export type UsersSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password_hash?: boolean
    password_algorithm?: boolean
    email?: boolean
    nickname?: boolean
    avatar?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
    articles?: boolean | Users$articlesArgs<ExtArgs>
    refresh_tokens?: boolean | Users$refresh_tokensArgs<ExtArgs>
    article_likes?: boolean | Users$article_likesArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["users"]>



  export type UsersSelectScalar = {
    id?: boolean
    username?: boolean
    password_hash?: boolean
    password_algorithm?: boolean
    email?: boolean
    nickname?: boolean
    avatar?: boolean
    is_active?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UsersOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password_hash" | "password_algorithm" | "email" | "nickname" | "avatar" | "is_active" | "created_at" | "updated_at", ExtArgs["result"]["users"]>
  export type UsersInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | Users$articlesArgs<ExtArgs>
    refresh_tokens?: boolean | Users$refresh_tokensArgs<ExtArgs>
    article_likes?: boolean | Users$article_likesArgs<ExtArgs>
    _count?: boolean | UsersCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UsersPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Users"
    objects: {
      articles: Prisma.$ArticlesPayload<ExtArgs>[]
      refresh_tokens: Prisma.$RefreshTokensPayload<ExtArgs>[]
      article_likes: Prisma.$ArticleLikesPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password_hash: string
      password_algorithm: string | null
      email: string | null
      nickname: string | null
      avatar: string | null
      is_active: boolean
      created_at: bigint
      updated_at: bigint
    }, ExtArgs["result"]["users"]>
    composites: {}
  }

  type UsersGetPayload<S extends boolean | null | undefined | UsersDefaultArgs> = $Result.GetResult<Prisma.$UsersPayload, S>

  type UsersCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UsersFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsersCountAggregateInputType | true
    }

  export interface UsersDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Users'], meta: { name: 'Users' } }
    /**
     * Find zero or one Users that matches the filter.
     * @param {UsersFindUniqueArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UsersFindUniqueArgs>(args: SelectSubset<T, UsersFindUniqueArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Users that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UsersFindUniqueOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UsersFindUniqueOrThrowArgs>(args: SelectSubset<T, UsersFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UsersFindFirstArgs>(args?: SelectSubset<T, UsersFindFirstArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Users that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindFirstOrThrowArgs} args - Arguments to find a Users
     * @example
     * // Get one Users
     * const users = await prisma.users.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UsersFindFirstOrThrowArgs>(args?: SelectSubset<T, UsersFindFirstOrThrowArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.users.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.users.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usersWithIdOnly = await prisma.users.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UsersFindManyArgs>(args?: SelectSubset<T, UsersFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Users.
     * @param {UsersCreateArgs} args - Arguments to create a Users.
     * @example
     * // Create one Users
     * const Users = await prisma.users.create({
     *   data: {
     *     // ... data to create a Users
     *   }
     * })
     * 
     */
    create<T extends UsersCreateArgs>(args: SelectSubset<T, UsersCreateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UsersCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const users = await prisma.users.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UsersCreateManyArgs>(args?: SelectSubset<T, UsersCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Users.
     * @param {UsersDeleteArgs} args - Arguments to delete one Users.
     * @example
     * // Delete one Users
     * const Users = await prisma.users.delete({
     *   where: {
     *     // ... filter to delete one Users
     *   }
     * })
     * 
     */
    delete<T extends UsersDeleteArgs>(args: SelectSubset<T, UsersDeleteArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Users.
     * @param {UsersUpdateArgs} args - Arguments to update one Users.
     * @example
     * // Update one Users
     * const users = await prisma.users.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UsersUpdateArgs>(args: SelectSubset<T, UsersUpdateArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UsersDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.users.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UsersDeleteManyArgs>(args?: SelectSubset<T, UsersDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const users = await prisma.users.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UsersUpdateManyArgs>(args: SelectSubset<T, UsersUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Users.
     * @param {UsersUpsertArgs} args - Arguments to update or create a Users.
     * @example
     * // Update or create a Users
     * const users = await prisma.users.upsert({
     *   create: {
     *     // ... data to create a Users
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Users we want to update
     *   }
     * })
     */
    upsert<T extends UsersUpsertArgs>(args: SelectSubset<T, UsersUpsertArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.users.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UsersCountArgs>(
      args?: Subset<T, UsersCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsersCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsersAggregateArgs>(args: Subset<T, UsersAggregateArgs>): Prisma.PrismaPromise<GetUsersAggregateType<T>>

    /**
     * Group by Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsersGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsersGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsersGroupByArgs['orderBy'] }
        : { orderBy?: UsersGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsersGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsersGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Users model
   */
  readonly fields: UsersFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Users.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsersClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    articles<T extends Users$articlesArgs<ExtArgs> = {}>(args?: Subset<T, Users$articlesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    refresh_tokens<T extends Users$refresh_tokensArgs<ExtArgs> = {}>(args?: Subset<T, Users$refresh_tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokensPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    article_likes<T extends Users$article_likesArgs<ExtArgs> = {}>(args?: Subset<T, Users$article_likesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Users model
   */
  interface UsersFieldRefs {
    readonly id: FieldRef<"Users", 'String'>
    readonly username: FieldRef<"Users", 'String'>
    readonly password_hash: FieldRef<"Users", 'String'>
    readonly password_algorithm: FieldRef<"Users", 'String'>
    readonly email: FieldRef<"Users", 'String'>
    readonly nickname: FieldRef<"Users", 'String'>
    readonly avatar: FieldRef<"Users", 'String'>
    readonly is_active: FieldRef<"Users", 'Boolean'>
    readonly created_at: FieldRef<"Users", 'BigInt'>
    readonly updated_at: FieldRef<"Users", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * Users findUnique
   */
  export type UsersFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findUniqueOrThrow
   */
  export type UsersFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users findFirst
   */
  export type UsersFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findFirstOrThrow
   */
  export type UsersFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users findMany
   */
  export type UsersFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UsersWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UsersOrderByWithRelationInput | UsersOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UsersWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UsersScalarFieldEnum | UsersScalarFieldEnum[]
  }

  /**
   * Users create
   */
  export type UsersCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to create a Users.
     */
    data: XOR<UsersCreateInput, UsersUncheckedCreateInput>
  }

  /**
   * Users createMany
   */
  export type UsersCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UsersCreateManyInput | UsersCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Users update
   */
  export type UsersUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The data needed to update a Users.
     */
    data: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
    /**
     * Choose, which Users to update.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users updateMany
   */
  export type UsersUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UsersUpdateManyMutationInput, UsersUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * Users upsert
   */
  export type UsersUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * The filter to search for the Users to update in case it exists.
     */
    where: UsersWhereUniqueInput
    /**
     * In case the Users found by the `where` argument doesn't exist, create a new Users with this data.
     */
    create: XOR<UsersCreateInput, UsersUncheckedCreateInput>
    /**
     * In case the Users was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsersUpdateInput, UsersUncheckedUpdateInput>
  }

  /**
   * Users delete
   */
  export type UsersDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
    /**
     * Filter which Users to delete.
     */
    where: UsersWhereUniqueInput
  }

  /**
   * Users deleteMany
   */
  export type UsersDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UsersWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * Users.articles
   */
  export type Users$articlesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Articles
     */
    select?: ArticlesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Articles
     */
    omit?: ArticlesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticlesInclude<ExtArgs> | null
    where?: ArticlesWhereInput
    orderBy?: ArticlesOrderByWithRelationInput | ArticlesOrderByWithRelationInput[]
    cursor?: ArticlesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticlesScalarFieldEnum | ArticlesScalarFieldEnum[]
  }

  /**
   * Users.refresh_tokens
   */
  export type Users$refresh_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshTokens
     */
    select?: RefreshTokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshTokens
     */
    omit?: RefreshTokensOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokensInclude<ExtArgs> | null
    where?: RefreshTokensWhereInput
    orderBy?: RefreshTokensOrderByWithRelationInput | RefreshTokensOrderByWithRelationInput[]
    cursor?: RefreshTokensWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokensScalarFieldEnum | RefreshTokensScalarFieldEnum[]
  }

  /**
   * Users.article_likes
   */
  export type Users$article_likesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    where?: ArticleLikesWhereInput
    orderBy?: ArticleLikesOrderByWithRelationInput | ArticleLikesOrderByWithRelationInput[]
    cursor?: ArticleLikesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ArticleLikesScalarFieldEnum | ArticleLikesScalarFieldEnum[]
  }

  /**
   * Users without action
   */
  export type UsersDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Users
     */
    select?: UsersSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Users
     */
    omit?: UsersOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsersInclude<ExtArgs> | null
  }


  /**
   * Model ArticleContentBlocks
   */

  export type AggregateArticleContentBlocks = {
    _count: ArticleContentBlocksCountAggregateOutputType | null
    _avg: ArticleContentBlocksAvgAggregateOutputType | null
    _sum: ArticleContentBlocksSumAggregateOutputType | null
    _min: ArticleContentBlocksMinAggregateOutputType | null
    _max: ArticleContentBlocksMaxAggregateOutputType | null
  }

  export type ArticleContentBlocksAvgAggregateOutputType = {
    sort_order: number | null
    created_at: number | null
    updated_at: number | null
  }

  export type ArticleContentBlocksSumAggregateOutputType = {
    sort_order: number | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type ArticleContentBlocksMinAggregateOutputType = {
    id: string | null
    article_id: string | null
    block_type: string | null
    content: string | null
    sort_order: number | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type ArticleContentBlocksMaxAggregateOutputType = {
    id: string | null
    article_id: string | null
    block_type: string | null
    content: string | null
    sort_order: number | null
    created_at: bigint | null
    updated_at: bigint | null
  }

  export type ArticleContentBlocksCountAggregateOutputType = {
    id: number
    article_id: number
    block_type: number
    content: number
    sort_order: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ArticleContentBlocksAvgAggregateInputType = {
    sort_order?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleContentBlocksSumAggregateInputType = {
    sort_order?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleContentBlocksMinAggregateInputType = {
    id?: true
    article_id?: true
    block_type?: true
    content?: true
    sort_order?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleContentBlocksMaxAggregateInputType = {
    id?: true
    article_id?: true
    block_type?: true
    content?: true
    sort_order?: true
    created_at?: true
    updated_at?: true
  }

  export type ArticleContentBlocksCountAggregateInputType = {
    id?: true
    article_id?: true
    block_type?: true
    content?: true
    sort_order?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ArticleContentBlocksAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleContentBlocks to aggregate.
     */
    where?: ArticleContentBlocksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleContentBlocks to fetch.
     */
    orderBy?: ArticleContentBlocksOrderByWithRelationInput | ArticleContentBlocksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleContentBlocksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleContentBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleContentBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleContentBlocks
    **/
    _count?: true | ArticleContentBlocksCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleContentBlocksAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleContentBlocksSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleContentBlocksMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleContentBlocksMaxAggregateInputType
  }

  export type GetArticleContentBlocksAggregateType<T extends ArticleContentBlocksAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleContentBlocks]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleContentBlocks[P]>
      : GetScalarType<T[P], AggregateArticleContentBlocks[P]>
  }




  export type ArticleContentBlocksGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleContentBlocksWhereInput
    orderBy?: ArticleContentBlocksOrderByWithAggregationInput | ArticleContentBlocksOrderByWithAggregationInput[]
    by: ArticleContentBlocksScalarFieldEnum[] | ArticleContentBlocksScalarFieldEnum
    having?: ArticleContentBlocksScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleContentBlocksCountAggregateInputType | true
    _avg?: ArticleContentBlocksAvgAggregateInputType
    _sum?: ArticleContentBlocksSumAggregateInputType
    _min?: ArticleContentBlocksMinAggregateInputType
    _max?: ArticleContentBlocksMaxAggregateInputType
  }

  export type ArticleContentBlocksGroupByOutputType = {
    id: string
    article_id: string
    block_type: string
    content: string
    sort_order: number
    created_at: bigint
    updated_at: bigint
    _count: ArticleContentBlocksCountAggregateOutputType | null
    _avg: ArticleContentBlocksAvgAggregateOutputType | null
    _sum: ArticleContentBlocksSumAggregateOutputType | null
    _min: ArticleContentBlocksMinAggregateOutputType | null
    _max: ArticleContentBlocksMaxAggregateOutputType | null
  }

  type GetArticleContentBlocksGroupByPayload<T extends ArticleContentBlocksGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleContentBlocksGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleContentBlocksGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleContentBlocksGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleContentBlocksGroupByOutputType[P]>
        }
      >
    >


  export type ArticleContentBlocksSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    article_id?: boolean
    block_type?: boolean
    content?: boolean
    sort_order?: boolean
    created_at?: boolean
    updated_at?: boolean
    articles?: boolean | ArticlesDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleContentBlocks"]>



  export type ArticleContentBlocksSelectScalar = {
    id?: boolean
    article_id?: boolean
    block_type?: boolean
    content?: boolean
    sort_order?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ArticleContentBlocksOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "article_id" | "block_type" | "content" | "sort_order" | "created_at" | "updated_at", ExtArgs["result"]["articleContentBlocks"]>
  export type ArticleContentBlocksInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | ArticlesDefaultArgs<ExtArgs>
  }

  export type $ArticleContentBlocksPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleContentBlocks"
    objects: {
      articles: Prisma.$ArticlesPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      article_id: string
      block_type: string
      content: string
      sort_order: number
      created_at: bigint
      updated_at: bigint
    }, ExtArgs["result"]["articleContentBlocks"]>
    composites: {}
  }

  type ArticleContentBlocksGetPayload<S extends boolean | null | undefined | ArticleContentBlocksDefaultArgs> = $Result.GetResult<Prisma.$ArticleContentBlocksPayload, S>

  type ArticleContentBlocksCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleContentBlocksFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleContentBlocksCountAggregateInputType | true
    }

  export interface ArticleContentBlocksDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleContentBlocks'], meta: { name: 'ArticleContentBlocks' } }
    /**
     * Find zero or one ArticleContentBlocks that matches the filter.
     * @param {ArticleContentBlocksFindUniqueArgs} args - Arguments to find a ArticleContentBlocks
     * @example
     * // Get one ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleContentBlocksFindUniqueArgs>(args: SelectSubset<T, ArticleContentBlocksFindUniqueArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleContentBlocks that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleContentBlocksFindUniqueOrThrowArgs} args - Arguments to find a ArticleContentBlocks
     * @example
     * // Get one ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleContentBlocksFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleContentBlocksFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleContentBlocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksFindFirstArgs} args - Arguments to find a ArticleContentBlocks
     * @example
     * // Get one ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleContentBlocksFindFirstArgs>(args?: SelectSubset<T, ArticleContentBlocksFindFirstArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleContentBlocks that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksFindFirstOrThrowArgs} args - Arguments to find a ArticleContentBlocks
     * @example
     * // Get one ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleContentBlocksFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleContentBlocksFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleContentBlocks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.findMany()
     * 
     * // Get first 10 ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleContentBlocksWithIdOnly = await prisma.articleContentBlocks.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleContentBlocksFindManyArgs>(args?: SelectSubset<T, ArticleContentBlocksFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleContentBlocks.
     * @param {ArticleContentBlocksCreateArgs} args - Arguments to create a ArticleContentBlocks.
     * @example
     * // Create one ArticleContentBlocks
     * const ArticleContentBlocks = await prisma.articleContentBlocks.create({
     *   data: {
     *     // ... data to create a ArticleContentBlocks
     *   }
     * })
     * 
     */
    create<T extends ArticleContentBlocksCreateArgs>(args: SelectSubset<T, ArticleContentBlocksCreateArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleContentBlocks.
     * @param {ArticleContentBlocksCreateManyArgs} args - Arguments to create many ArticleContentBlocks.
     * @example
     * // Create many ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleContentBlocksCreateManyArgs>(args?: SelectSubset<T, ArticleContentBlocksCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ArticleContentBlocks.
     * @param {ArticleContentBlocksDeleteArgs} args - Arguments to delete one ArticleContentBlocks.
     * @example
     * // Delete one ArticleContentBlocks
     * const ArticleContentBlocks = await prisma.articleContentBlocks.delete({
     *   where: {
     *     // ... filter to delete one ArticleContentBlocks
     *   }
     * })
     * 
     */
    delete<T extends ArticleContentBlocksDeleteArgs>(args: SelectSubset<T, ArticleContentBlocksDeleteArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleContentBlocks.
     * @param {ArticleContentBlocksUpdateArgs} args - Arguments to update one ArticleContentBlocks.
     * @example
     * // Update one ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleContentBlocksUpdateArgs>(args: SelectSubset<T, ArticleContentBlocksUpdateArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleContentBlocks.
     * @param {ArticleContentBlocksDeleteManyArgs} args - Arguments to filter ArticleContentBlocks to delete.
     * @example
     * // Delete a few ArticleContentBlocks
     * const { count } = await prisma.articleContentBlocks.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleContentBlocksDeleteManyArgs>(args?: SelectSubset<T, ArticleContentBlocksDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleContentBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleContentBlocksUpdateManyArgs>(args: SelectSubset<T, ArticleContentBlocksUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ArticleContentBlocks.
     * @param {ArticleContentBlocksUpsertArgs} args - Arguments to update or create a ArticleContentBlocks.
     * @example
     * // Update or create a ArticleContentBlocks
     * const articleContentBlocks = await prisma.articleContentBlocks.upsert({
     *   create: {
     *     // ... data to create a ArticleContentBlocks
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleContentBlocks we want to update
     *   }
     * })
     */
    upsert<T extends ArticleContentBlocksUpsertArgs>(args: SelectSubset<T, ArticleContentBlocksUpsertArgs<ExtArgs>>): Prisma__ArticleContentBlocksClient<$Result.GetResult<Prisma.$ArticleContentBlocksPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleContentBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksCountArgs} args - Arguments to filter ArticleContentBlocks to count.
     * @example
     * // Count the number of ArticleContentBlocks
     * const count = await prisma.articleContentBlocks.count({
     *   where: {
     *     // ... the filter for the ArticleContentBlocks we want to count
     *   }
     * })
    **/
    count<T extends ArticleContentBlocksCountArgs>(
      args?: Subset<T, ArticleContentBlocksCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleContentBlocksCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleContentBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleContentBlocksAggregateArgs>(args: Subset<T, ArticleContentBlocksAggregateArgs>): Prisma.PrismaPromise<GetArticleContentBlocksAggregateType<T>>

    /**
     * Group by ArticleContentBlocks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleContentBlocksGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleContentBlocksGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleContentBlocksGroupByArgs['orderBy'] }
        : { orderBy?: ArticleContentBlocksGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleContentBlocksGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleContentBlocksGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleContentBlocks model
   */
  readonly fields: ArticleContentBlocksFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleContentBlocks.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleContentBlocksClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    articles<T extends ArticlesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticlesDefaultArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleContentBlocks model
   */
  interface ArticleContentBlocksFieldRefs {
    readonly id: FieldRef<"ArticleContentBlocks", 'String'>
    readonly article_id: FieldRef<"ArticleContentBlocks", 'String'>
    readonly block_type: FieldRef<"ArticleContentBlocks", 'String'>
    readonly content: FieldRef<"ArticleContentBlocks", 'String'>
    readonly sort_order: FieldRef<"ArticleContentBlocks", 'Int'>
    readonly created_at: FieldRef<"ArticleContentBlocks", 'BigInt'>
    readonly updated_at: FieldRef<"ArticleContentBlocks", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * ArticleContentBlocks findUnique
   */
  export type ArticleContentBlocksFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * Filter, which ArticleContentBlocks to fetch.
     */
    where: ArticleContentBlocksWhereUniqueInput
  }

  /**
   * ArticleContentBlocks findUniqueOrThrow
   */
  export type ArticleContentBlocksFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * Filter, which ArticleContentBlocks to fetch.
     */
    where: ArticleContentBlocksWhereUniqueInput
  }

  /**
   * ArticleContentBlocks findFirst
   */
  export type ArticleContentBlocksFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * Filter, which ArticleContentBlocks to fetch.
     */
    where?: ArticleContentBlocksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleContentBlocks to fetch.
     */
    orderBy?: ArticleContentBlocksOrderByWithRelationInput | ArticleContentBlocksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleContentBlocks.
     */
    cursor?: ArticleContentBlocksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleContentBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleContentBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleContentBlocks.
     */
    distinct?: ArticleContentBlocksScalarFieldEnum | ArticleContentBlocksScalarFieldEnum[]
  }

  /**
   * ArticleContentBlocks findFirstOrThrow
   */
  export type ArticleContentBlocksFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * Filter, which ArticleContentBlocks to fetch.
     */
    where?: ArticleContentBlocksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleContentBlocks to fetch.
     */
    orderBy?: ArticleContentBlocksOrderByWithRelationInput | ArticleContentBlocksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleContentBlocks.
     */
    cursor?: ArticleContentBlocksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleContentBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleContentBlocks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleContentBlocks.
     */
    distinct?: ArticleContentBlocksScalarFieldEnum | ArticleContentBlocksScalarFieldEnum[]
  }

  /**
   * ArticleContentBlocks findMany
   */
  export type ArticleContentBlocksFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * Filter, which ArticleContentBlocks to fetch.
     */
    where?: ArticleContentBlocksWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleContentBlocks to fetch.
     */
    orderBy?: ArticleContentBlocksOrderByWithRelationInput | ArticleContentBlocksOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleContentBlocks.
     */
    cursor?: ArticleContentBlocksWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleContentBlocks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleContentBlocks.
     */
    skip?: number
    distinct?: ArticleContentBlocksScalarFieldEnum | ArticleContentBlocksScalarFieldEnum[]
  }

  /**
   * ArticleContentBlocks create
   */
  export type ArticleContentBlocksCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleContentBlocks.
     */
    data: XOR<ArticleContentBlocksCreateInput, ArticleContentBlocksUncheckedCreateInput>
  }

  /**
   * ArticleContentBlocks createMany
   */
  export type ArticleContentBlocksCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleContentBlocks.
     */
    data: ArticleContentBlocksCreateManyInput | ArticleContentBlocksCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ArticleContentBlocks update
   */
  export type ArticleContentBlocksUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleContentBlocks.
     */
    data: XOR<ArticleContentBlocksUpdateInput, ArticleContentBlocksUncheckedUpdateInput>
    /**
     * Choose, which ArticleContentBlocks to update.
     */
    where: ArticleContentBlocksWhereUniqueInput
  }

  /**
   * ArticleContentBlocks updateMany
   */
  export type ArticleContentBlocksUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleContentBlocks.
     */
    data: XOR<ArticleContentBlocksUpdateManyMutationInput, ArticleContentBlocksUncheckedUpdateManyInput>
    /**
     * Filter which ArticleContentBlocks to update
     */
    where?: ArticleContentBlocksWhereInput
    /**
     * Limit how many ArticleContentBlocks to update.
     */
    limit?: number
  }

  /**
   * ArticleContentBlocks upsert
   */
  export type ArticleContentBlocksUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleContentBlocks to update in case it exists.
     */
    where: ArticleContentBlocksWhereUniqueInput
    /**
     * In case the ArticleContentBlocks found by the `where` argument doesn't exist, create a new ArticleContentBlocks with this data.
     */
    create: XOR<ArticleContentBlocksCreateInput, ArticleContentBlocksUncheckedCreateInput>
    /**
     * In case the ArticleContentBlocks was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleContentBlocksUpdateInput, ArticleContentBlocksUncheckedUpdateInput>
  }

  /**
   * ArticleContentBlocks delete
   */
  export type ArticleContentBlocksDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
    /**
     * Filter which ArticleContentBlocks to delete.
     */
    where: ArticleContentBlocksWhereUniqueInput
  }

  /**
   * ArticleContentBlocks deleteMany
   */
  export type ArticleContentBlocksDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleContentBlocks to delete
     */
    where?: ArticleContentBlocksWhereInput
    /**
     * Limit how many ArticleContentBlocks to delete.
     */
    limit?: number
  }

  /**
   * ArticleContentBlocks without action
   */
  export type ArticleContentBlocksDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleContentBlocks
     */
    select?: ArticleContentBlocksSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleContentBlocks
     */
    omit?: ArticleContentBlocksOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleContentBlocksInclude<ExtArgs> | null
  }


  /**
   * Model ArticleLikes
   */

  export type AggregateArticleLikes = {
    _count: ArticleLikesCountAggregateOutputType | null
    _avg: ArticleLikesAvgAggregateOutputType | null
    _sum: ArticleLikesSumAggregateOutputType | null
    _min: ArticleLikesMinAggregateOutputType | null
    _max: ArticleLikesMaxAggregateOutputType | null
  }

  export type ArticleLikesAvgAggregateOutputType = {
    created_at: number | null
  }

  export type ArticleLikesSumAggregateOutputType = {
    created_at: bigint | null
  }

  export type ArticleLikesMinAggregateOutputType = {
    id: string | null
    article_id: string | null
    user_id: string | null
    created_at: bigint | null
  }

  export type ArticleLikesMaxAggregateOutputType = {
    id: string | null
    article_id: string | null
    user_id: string | null
    created_at: bigint | null
  }

  export type ArticleLikesCountAggregateOutputType = {
    id: number
    article_id: number
    user_id: number
    created_at: number
    _all: number
  }


  export type ArticleLikesAvgAggregateInputType = {
    created_at?: true
  }

  export type ArticleLikesSumAggregateInputType = {
    created_at?: true
  }

  export type ArticleLikesMinAggregateInputType = {
    id?: true
    article_id?: true
    user_id?: true
    created_at?: true
  }

  export type ArticleLikesMaxAggregateInputType = {
    id?: true
    article_id?: true
    user_id?: true
    created_at?: true
  }

  export type ArticleLikesCountAggregateInputType = {
    id?: true
    article_id?: true
    user_id?: true
    created_at?: true
    _all?: true
  }

  export type ArticleLikesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleLikes to aggregate.
     */
    where?: ArticleLikesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikesOrderByWithRelationInput | ArticleLikesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ArticleLikesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ArticleLikes
    **/
    _count?: true | ArticleLikesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ArticleLikesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ArticleLikesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ArticleLikesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ArticleLikesMaxAggregateInputType
  }

  export type GetArticleLikesAggregateType<T extends ArticleLikesAggregateArgs> = {
        [P in keyof T & keyof AggregateArticleLikes]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateArticleLikes[P]>
      : GetScalarType<T[P], AggregateArticleLikes[P]>
  }




  export type ArticleLikesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ArticleLikesWhereInput
    orderBy?: ArticleLikesOrderByWithAggregationInput | ArticleLikesOrderByWithAggregationInput[]
    by: ArticleLikesScalarFieldEnum[] | ArticleLikesScalarFieldEnum
    having?: ArticleLikesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ArticleLikesCountAggregateInputType | true
    _avg?: ArticleLikesAvgAggregateInputType
    _sum?: ArticleLikesSumAggregateInputType
    _min?: ArticleLikesMinAggregateInputType
    _max?: ArticleLikesMaxAggregateInputType
  }

  export type ArticleLikesGroupByOutputType = {
    id: string
    article_id: string
    user_id: string
    created_at: bigint
    _count: ArticleLikesCountAggregateOutputType | null
    _avg: ArticleLikesAvgAggregateOutputType | null
    _sum: ArticleLikesSumAggregateOutputType | null
    _min: ArticleLikesMinAggregateOutputType | null
    _max: ArticleLikesMaxAggregateOutputType | null
  }

  type GetArticleLikesGroupByPayload<T extends ArticleLikesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ArticleLikesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ArticleLikesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ArticleLikesGroupByOutputType[P]>
            : GetScalarType<T[P], ArticleLikesGroupByOutputType[P]>
        }
      >
    >


  export type ArticleLikesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    article_id?: boolean
    user_id?: boolean
    created_at?: boolean
    articles?: boolean | ArticlesDefaultArgs<ExtArgs>
    users?: boolean | UsersDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["articleLikes"]>



  export type ArticleLikesSelectScalar = {
    id?: boolean
    article_id?: boolean
    user_id?: boolean
    created_at?: boolean
  }

  export type ArticleLikesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "article_id" | "user_id" | "created_at", ExtArgs["result"]["articleLikes"]>
  export type ArticleLikesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    articles?: boolean | ArticlesDefaultArgs<ExtArgs>
    users?: boolean | UsersDefaultArgs<ExtArgs>
  }

  export type $ArticleLikesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ArticleLikes"
    objects: {
      articles: Prisma.$ArticlesPayload<ExtArgs>
      users: Prisma.$UsersPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      article_id: string
      user_id: string
      created_at: bigint
    }, ExtArgs["result"]["articleLikes"]>
    composites: {}
  }

  type ArticleLikesGetPayload<S extends boolean | null | undefined | ArticleLikesDefaultArgs> = $Result.GetResult<Prisma.$ArticleLikesPayload, S>

  type ArticleLikesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ArticleLikesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ArticleLikesCountAggregateInputType | true
    }

  export interface ArticleLikesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ArticleLikes'], meta: { name: 'ArticleLikes' } }
    /**
     * Find zero or one ArticleLikes that matches the filter.
     * @param {ArticleLikesFindUniqueArgs} args - Arguments to find a ArticleLikes
     * @example
     * // Get one ArticleLikes
     * const articleLikes = await prisma.articleLikes.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ArticleLikesFindUniqueArgs>(args: SelectSubset<T, ArticleLikesFindUniqueArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ArticleLikes that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ArticleLikesFindUniqueOrThrowArgs} args - Arguments to find a ArticleLikes
     * @example
     * // Get one ArticleLikes
     * const articleLikes = await prisma.articleLikes.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ArticleLikesFindUniqueOrThrowArgs>(args: SelectSubset<T, ArticleLikesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesFindFirstArgs} args - Arguments to find a ArticleLikes
     * @example
     * // Get one ArticleLikes
     * const articleLikes = await prisma.articleLikes.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ArticleLikesFindFirstArgs>(args?: SelectSubset<T, ArticleLikesFindFirstArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ArticleLikes that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesFindFirstOrThrowArgs} args - Arguments to find a ArticleLikes
     * @example
     * // Get one ArticleLikes
     * const articleLikes = await prisma.articleLikes.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ArticleLikesFindFirstOrThrowArgs>(args?: SelectSubset<T, ArticleLikesFindFirstOrThrowArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ArticleLikes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ArticleLikes
     * const articleLikes = await prisma.articleLikes.findMany()
     * 
     * // Get first 10 ArticleLikes
     * const articleLikes = await prisma.articleLikes.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const articleLikesWithIdOnly = await prisma.articleLikes.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ArticleLikesFindManyArgs>(args?: SelectSubset<T, ArticleLikesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ArticleLikes.
     * @param {ArticleLikesCreateArgs} args - Arguments to create a ArticleLikes.
     * @example
     * // Create one ArticleLikes
     * const ArticleLikes = await prisma.articleLikes.create({
     *   data: {
     *     // ... data to create a ArticleLikes
     *   }
     * })
     * 
     */
    create<T extends ArticleLikesCreateArgs>(args: SelectSubset<T, ArticleLikesCreateArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ArticleLikes.
     * @param {ArticleLikesCreateManyArgs} args - Arguments to create many ArticleLikes.
     * @example
     * // Create many ArticleLikes
     * const articleLikes = await prisma.articleLikes.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ArticleLikesCreateManyArgs>(args?: SelectSubset<T, ArticleLikesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ArticleLikes.
     * @param {ArticleLikesDeleteArgs} args - Arguments to delete one ArticleLikes.
     * @example
     * // Delete one ArticleLikes
     * const ArticleLikes = await prisma.articleLikes.delete({
     *   where: {
     *     // ... filter to delete one ArticleLikes
     *   }
     * })
     * 
     */
    delete<T extends ArticleLikesDeleteArgs>(args: SelectSubset<T, ArticleLikesDeleteArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ArticleLikes.
     * @param {ArticleLikesUpdateArgs} args - Arguments to update one ArticleLikes.
     * @example
     * // Update one ArticleLikes
     * const articleLikes = await prisma.articleLikes.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ArticleLikesUpdateArgs>(args: SelectSubset<T, ArticleLikesUpdateArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ArticleLikes.
     * @param {ArticleLikesDeleteManyArgs} args - Arguments to filter ArticleLikes to delete.
     * @example
     * // Delete a few ArticleLikes
     * const { count } = await prisma.articleLikes.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ArticleLikesDeleteManyArgs>(args?: SelectSubset<T, ArticleLikesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ArticleLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ArticleLikes
     * const articleLikes = await prisma.articleLikes.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ArticleLikesUpdateManyArgs>(args: SelectSubset<T, ArticleLikesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ArticleLikes.
     * @param {ArticleLikesUpsertArgs} args - Arguments to update or create a ArticleLikes.
     * @example
     * // Update or create a ArticleLikes
     * const articleLikes = await prisma.articleLikes.upsert({
     *   create: {
     *     // ... data to create a ArticleLikes
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ArticleLikes we want to update
     *   }
     * })
     */
    upsert<T extends ArticleLikesUpsertArgs>(args: SelectSubset<T, ArticleLikesUpsertArgs<ExtArgs>>): Prisma__ArticleLikesClient<$Result.GetResult<Prisma.$ArticleLikesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ArticleLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesCountArgs} args - Arguments to filter ArticleLikes to count.
     * @example
     * // Count the number of ArticleLikes
     * const count = await prisma.articleLikes.count({
     *   where: {
     *     // ... the filter for the ArticleLikes we want to count
     *   }
     * })
    **/
    count<T extends ArticleLikesCountArgs>(
      args?: Subset<T, ArticleLikesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ArticleLikesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ArticleLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ArticleLikesAggregateArgs>(args: Subset<T, ArticleLikesAggregateArgs>): Prisma.PrismaPromise<GetArticleLikesAggregateType<T>>

    /**
     * Group by ArticleLikes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ArticleLikesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ArticleLikesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ArticleLikesGroupByArgs['orderBy'] }
        : { orderBy?: ArticleLikesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ArticleLikesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetArticleLikesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ArticleLikes model
   */
  readonly fields: ArticleLikesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ArticleLikes.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ArticleLikesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    articles<T extends ArticlesDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ArticlesDefaultArgs<ExtArgs>>): Prisma__ArticlesClient<$Result.GetResult<Prisma.$ArticlesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users<T extends UsersDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UsersDefaultArgs<ExtArgs>>): Prisma__UsersClient<$Result.GetResult<Prisma.$UsersPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ArticleLikes model
   */
  interface ArticleLikesFieldRefs {
    readonly id: FieldRef<"ArticleLikes", 'String'>
    readonly article_id: FieldRef<"ArticleLikes", 'String'>
    readonly user_id: FieldRef<"ArticleLikes", 'String'>
    readonly created_at: FieldRef<"ArticleLikes", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * ArticleLikes findUnique
   */
  export type ArticleLikesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLikes to fetch.
     */
    where: ArticleLikesWhereUniqueInput
  }

  /**
   * ArticleLikes findUniqueOrThrow
   */
  export type ArticleLikesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLikes to fetch.
     */
    where: ArticleLikesWhereUniqueInput
  }

  /**
   * ArticleLikes findFirst
   */
  export type ArticleLikesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLikes to fetch.
     */
    where?: ArticleLikesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikesOrderByWithRelationInput | ArticleLikesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleLikes.
     */
    cursor?: ArticleLikesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleLikes.
     */
    distinct?: ArticleLikesScalarFieldEnum | ArticleLikesScalarFieldEnum[]
  }

  /**
   * ArticleLikes findFirstOrThrow
   */
  export type ArticleLikesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLikes to fetch.
     */
    where?: ArticleLikesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikesOrderByWithRelationInput | ArticleLikesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ArticleLikes.
     */
    cursor?: ArticleLikesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ArticleLikes.
     */
    distinct?: ArticleLikesScalarFieldEnum | ArticleLikesScalarFieldEnum[]
  }

  /**
   * ArticleLikes findMany
   */
  export type ArticleLikesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * Filter, which ArticleLikes to fetch.
     */
    where?: ArticleLikesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ArticleLikes to fetch.
     */
    orderBy?: ArticleLikesOrderByWithRelationInput | ArticleLikesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ArticleLikes.
     */
    cursor?: ArticleLikesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ArticleLikes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ArticleLikes.
     */
    skip?: number
    distinct?: ArticleLikesScalarFieldEnum | ArticleLikesScalarFieldEnum[]
  }

  /**
   * ArticleLikes create
   */
  export type ArticleLikesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * The data needed to create a ArticleLikes.
     */
    data: XOR<ArticleLikesCreateInput, ArticleLikesUncheckedCreateInput>
  }

  /**
   * ArticleLikes createMany
   */
  export type ArticleLikesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ArticleLikes.
     */
    data: ArticleLikesCreateManyInput | ArticleLikesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ArticleLikes update
   */
  export type ArticleLikesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * The data needed to update a ArticleLikes.
     */
    data: XOR<ArticleLikesUpdateInput, ArticleLikesUncheckedUpdateInput>
    /**
     * Choose, which ArticleLikes to update.
     */
    where: ArticleLikesWhereUniqueInput
  }

  /**
   * ArticleLikes updateMany
   */
  export type ArticleLikesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ArticleLikes.
     */
    data: XOR<ArticleLikesUpdateManyMutationInput, ArticleLikesUncheckedUpdateManyInput>
    /**
     * Filter which ArticleLikes to update
     */
    where?: ArticleLikesWhereInput
    /**
     * Limit how many ArticleLikes to update.
     */
    limit?: number
  }

  /**
   * ArticleLikes upsert
   */
  export type ArticleLikesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * The filter to search for the ArticleLikes to update in case it exists.
     */
    where: ArticleLikesWhereUniqueInput
    /**
     * In case the ArticleLikes found by the `where` argument doesn't exist, create a new ArticleLikes with this data.
     */
    create: XOR<ArticleLikesCreateInput, ArticleLikesUncheckedCreateInput>
    /**
     * In case the ArticleLikes was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ArticleLikesUpdateInput, ArticleLikesUncheckedUpdateInput>
  }

  /**
   * ArticleLikes delete
   */
  export type ArticleLikesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
    /**
     * Filter which ArticleLikes to delete.
     */
    where: ArticleLikesWhereUniqueInput
  }

  /**
   * ArticleLikes deleteMany
   */
  export type ArticleLikesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ArticleLikes to delete
     */
    where?: ArticleLikesWhereInput
    /**
     * Limit how many ArticleLikes to delete.
     */
    limit?: number
  }

  /**
   * ArticleLikes without action
   */
  export type ArticleLikesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ArticleLikes
     */
    select?: ArticleLikesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ArticleLikes
     */
    omit?: ArticleLikesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ArticleLikesInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CategoriesScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    image_url: 'image_url',
    article_count: 'article_count',
    sort_order: 'sort_order',
    is_active: 'is_active',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CategoriesScalarFieldEnum = (typeof CategoriesScalarFieldEnum)[keyof typeof CategoriesScalarFieldEnum]


  export const HotSearchKeywordsScalarFieldEnum: {
    id: 'id',
    keyword: 'keyword',
    hot_score: 'hot_score',
    is_active: 'is_active',
    sort_order: 'sort_order',
    created_at: 'created_at'
  };

  export type HotSearchKeywordsScalarFieldEnum = (typeof HotSearchKeywordsScalarFieldEnum)[keyof typeof HotSearchKeywordsScalarFieldEnum]


  export const ArticlesScalarFieldEnum: {
    id: 'id',
    title: 'title',
    summary: 'summary',
    cover_url: 'cover_url',
    category_id: 'category_id',
    author_id: 'author_id',
    author_name: 'author_name',
    author_avatar: 'author_avatar',
    tags: 'tags',
    views: 'views',
    likes: 'likes',
    comments_count: 'comments_count',
    is_top: 'is_top',
    read_time: 'read_time',
    published_at: 'published_at',
    is_published: 'is_published',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ArticlesScalarFieldEnum = (typeof ArticlesScalarFieldEnum)[keyof typeof ArticlesScalarFieldEnum]


  export const RefreshTokensScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    refresh_token: 'refresh_token',
    client_ip: 'client_ip',
    expires_at: 'expires_at',
    revoked: 'revoked',
    created_at: 'created_at'
  };

  export type RefreshTokensScalarFieldEnum = (typeof RefreshTokensScalarFieldEnum)[keyof typeof RefreshTokensScalarFieldEnum]


  export const UsersScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password_hash: 'password_hash',
    password_algorithm: 'password_algorithm',
    email: 'email',
    nickname: 'nickname',
    avatar: 'avatar',
    is_active: 'is_active',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UsersScalarFieldEnum = (typeof UsersScalarFieldEnum)[keyof typeof UsersScalarFieldEnum]


  export const ArticleContentBlocksScalarFieldEnum: {
    id: 'id',
    article_id: 'article_id',
    block_type: 'block_type',
    content: 'content',
    sort_order: 'sort_order',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ArticleContentBlocksScalarFieldEnum = (typeof ArticleContentBlocksScalarFieldEnum)[keyof typeof ArticleContentBlocksScalarFieldEnum]


  export const ArticleLikesScalarFieldEnum: {
    id: 'id',
    article_id: 'article_id',
    user_id: 'user_id',
    created_at: 'created_at'
  };

  export type ArticleLikesScalarFieldEnum = (typeof ArticleLikesScalarFieldEnum)[keyof typeof ArticleLikesScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const CategoriesOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    image_url: 'image_url'
  };

  export type CategoriesOrderByRelevanceFieldEnum = (typeof CategoriesOrderByRelevanceFieldEnum)[keyof typeof CategoriesOrderByRelevanceFieldEnum]


  export const HotSearchKeywordsOrderByRelevanceFieldEnum: {
    id: 'id',
    keyword: 'keyword'
  };

  export type HotSearchKeywordsOrderByRelevanceFieldEnum = (typeof HotSearchKeywordsOrderByRelevanceFieldEnum)[keyof typeof HotSearchKeywordsOrderByRelevanceFieldEnum]


  export const ArticlesOrderByRelevanceFieldEnum: {
    id: 'id',
    title: 'title',
    summary: 'summary',
    cover_url: 'cover_url',
    category_id: 'category_id',
    author_id: 'author_id',
    author_name: 'author_name',
    author_avatar: 'author_avatar',
    tags: 'tags'
  };

  export type ArticlesOrderByRelevanceFieldEnum = (typeof ArticlesOrderByRelevanceFieldEnum)[keyof typeof ArticlesOrderByRelevanceFieldEnum]


  export const RefreshTokensOrderByRelevanceFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    refresh_token: 'refresh_token',
    client_ip: 'client_ip'
  };

  export type RefreshTokensOrderByRelevanceFieldEnum = (typeof RefreshTokensOrderByRelevanceFieldEnum)[keyof typeof RefreshTokensOrderByRelevanceFieldEnum]


  export const UsersOrderByRelevanceFieldEnum: {
    id: 'id',
    username: 'username',
    password_hash: 'password_hash',
    password_algorithm: 'password_algorithm',
    email: 'email',
    nickname: 'nickname',
    avatar: 'avatar'
  };

  export type UsersOrderByRelevanceFieldEnum = (typeof UsersOrderByRelevanceFieldEnum)[keyof typeof UsersOrderByRelevanceFieldEnum]


  export const ArticleContentBlocksOrderByRelevanceFieldEnum: {
    id: 'id',
    article_id: 'article_id',
    block_type: 'block_type',
    content: 'content'
  };

  export type ArticleContentBlocksOrderByRelevanceFieldEnum = (typeof ArticleContentBlocksOrderByRelevanceFieldEnum)[keyof typeof ArticleContentBlocksOrderByRelevanceFieldEnum]


  export const ArticleLikesOrderByRelevanceFieldEnum: {
    id: 'id',
    article_id: 'article_id',
    user_id: 'user_id'
  };

  export type ArticleLikesOrderByRelevanceFieldEnum = (typeof ArticleLikesOrderByRelevanceFieldEnum)[keyof typeof ArticleLikesOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type CategoriesWhereInput = {
    AND?: CategoriesWhereInput | CategoriesWhereInput[]
    OR?: CategoriesWhereInput[]
    NOT?: CategoriesWhereInput | CategoriesWhereInput[]
    id?: StringFilter<"Categories"> | string
    name?: StringFilter<"Categories"> | string
    description?: StringNullableFilter<"Categories"> | string | null
    image_url?: StringNullableFilter<"Categories"> | string | null
    article_count?: IntFilter<"Categories"> | number
    sort_order?: IntNullableFilter<"Categories"> | number | null
    is_active?: BoolFilter<"Categories"> | boolean
    created_at?: BigIntFilter<"Categories"> | bigint | number
    updated_at?: BigIntFilter<"Categories"> | bigint | number
    articles?: ArticlesListRelationFilter
  }

  export type CategoriesOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    article_count?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    articles?: ArticlesOrderByRelationAggregateInput
    _relevance?: CategoriesOrderByRelevanceInput
  }

  export type CategoriesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CategoriesWhereInput | CategoriesWhereInput[]
    OR?: CategoriesWhereInput[]
    NOT?: CategoriesWhereInput | CategoriesWhereInput[]
    name?: StringFilter<"Categories"> | string
    description?: StringNullableFilter<"Categories"> | string | null
    image_url?: StringNullableFilter<"Categories"> | string | null
    article_count?: IntFilter<"Categories"> | number
    sort_order?: IntNullableFilter<"Categories"> | number | null
    is_active?: BoolFilter<"Categories"> | boolean
    created_at?: BigIntFilter<"Categories"> | bigint | number
    updated_at?: BigIntFilter<"Categories"> | bigint | number
    articles?: ArticlesListRelationFilter
  }, "id">

  export type CategoriesOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    image_url?: SortOrderInput | SortOrder
    article_count?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: CategoriesCountOrderByAggregateInput
    _avg?: CategoriesAvgOrderByAggregateInput
    _max?: CategoriesMaxOrderByAggregateInput
    _min?: CategoriesMinOrderByAggregateInput
    _sum?: CategoriesSumOrderByAggregateInput
  }

  export type CategoriesScalarWhereWithAggregatesInput = {
    AND?: CategoriesScalarWhereWithAggregatesInput | CategoriesScalarWhereWithAggregatesInput[]
    OR?: CategoriesScalarWhereWithAggregatesInput[]
    NOT?: CategoriesScalarWhereWithAggregatesInput | CategoriesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Categories"> | string
    name?: StringWithAggregatesFilter<"Categories"> | string
    description?: StringNullableWithAggregatesFilter<"Categories"> | string | null
    image_url?: StringNullableWithAggregatesFilter<"Categories"> | string | null
    article_count?: IntWithAggregatesFilter<"Categories"> | number
    sort_order?: IntNullableWithAggregatesFilter<"Categories"> | number | null
    is_active?: BoolWithAggregatesFilter<"Categories"> | boolean
    created_at?: BigIntWithAggregatesFilter<"Categories"> | bigint | number
    updated_at?: BigIntWithAggregatesFilter<"Categories"> | bigint | number
  }

  export type HotSearchKeywordsWhereInput = {
    AND?: HotSearchKeywordsWhereInput | HotSearchKeywordsWhereInput[]
    OR?: HotSearchKeywordsWhereInput[]
    NOT?: HotSearchKeywordsWhereInput | HotSearchKeywordsWhereInput[]
    id?: StringFilter<"HotSearchKeywords"> | string
    keyword?: StringFilter<"HotSearchKeywords"> | string
    hot_score?: IntFilter<"HotSearchKeywords"> | number
    is_active?: BoolFilter<"HotSearchKeywords"> | boolean
    sort_order?: IntNullableFilter<"HotSearchKeywords"> | number | null
    created_at?: BigIntFilter<"HotSearchKeywords"> | bigint | number
  }

  export type HotSearchKeywordsOrderByWithRelationInput = {
    id?: SortOrder
    keyword?: SortOrder
    hot_score?: SortOrder
    is_active?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _relevance?: HotSearchKeywordsOrderByRelevanceInput
  }

  export type HotSearchKeywordsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HotSearchKeywordsWhereInput | HotSearchKeywordsWhereInput[]
    OR?: HotSearchKeywordsWhereInput[]
    NOT?: HotSearchKeywordsWhereInput | HotSearchKeywordsWhereInput[]
    keyword?: StringFilter<"HotSearchKeywords"> | string
    hot_score?: IntFilter<"HotSearchKeywords"> | number
    is_active?: BoolFilter<"HotSearchKeywords"> | boolean
    sort_order?: IntNullableFilter<"HotSearchKeywords"> | number | null
    created_at?: BigIntFilter<"HotSearchKeywords"> | bigint | number
  }, "id">

  export type HotSearchKeywordsOrderByWithAggregationInput = {
    id?: SortOrder
    keyword?: SortOrder
    hot_score?: SortOrder
    is_active?: SortOrder
    sort_order?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: HotSearchKeywordsCountOrderByAggregateInput
    _avg?: HotSearchKeywordsAvgOrderByAggregateInput
    _max?: HotSearchKeywordsMaxOrderByAggregateInput
    _min?: HotSearchKeywordsMinOrderByAggregateInput
    _sum?: HotSearchKeywordsSumOrderByAggregateInput
  }

  export type HotSearchKeywordsScalarWhereWithAggregatesInput = {
    AND?: HotSearchKeywordsScalarWhereWithAggregatesInput | HotSearchKeywordsScalarWhereWithAggregatesInput[]
    OR?: HotSearchKeywordsScalarWhereWithAggregatesInput[]
    NOT?: HotSearchKeywordsScalarWhereWithAggregatesInput | HotSearchKeywordsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"HotSearchKeywords"> | string
    keyword?: StringWithAggregatesFilter<"HotSearchKeywords"> | string
    hot_score?: IntWithAggregatesFilter<"HotSearchKeywords"> | number
    is_active?: BoolWithAggregatesFilter<"HotSearchKeywords"> | boolean
    sort_order?: IntNullableWithAggregatesFilter<"HotSearchKeywords"> | number | null
    created_at?: BigIntWithAggregatesFilter<"HotSearchKeywords"> | bigint | number
  }

  export type ArticlesWhereInput = {
    AND?: ArticlesWhereInput | ArticlesWhereInput[]
    OR?: ArticlesWhereInput[]
    NOT?: ArticlesWhereInput | ArticlesWhereInput[]
    id?: StringFilter<"Articles"> | string
    title?: StringFilter<"Articles"> | string
    summary?: StringNullableFilter<"Articles"> | string | null
    cover_url?: StringNullableFilter<"Articles"> | string | null
    category_id?: StringFilter<"Articles"> | string
    author_id?: StringFilter<"Articles"> | string
    author_name?: StringNullableFilter<"Articles"> | string | null
    author_avatar?: StringNullableFilter<"Articles"> | string | null
    tags?: StringNullableFilter<"Articles"> | string | null
    views?: IntFilter<"Articles"> | number
    likes?: IntFilter<"Articles"> | number
    comments_count?: IntFilter<"Articles"> | number
    is_top?: BoolFilter<"Articles"> | boolean
    read_time?: IntNullableFilter<"Articles"> | number | null
    published_at?: BigIntFilter<"Articles"> | bigint | number
    is_published?: BoolFilter<"Articles"> | boolean
    created_at?: BigIntFilter<"Articles"> | bigint | number
    updated_at?: BigIntFilter<"Articles"> | bigint | number
    categories?: XOR<CategoriesScalarRelationFilter, CategoriesWhereInput>
    users?: XOR<UsersScalarRelationFilter, UsersWhereInput>
    article_content_blocks?: ArticleContentBlocksListRelationFilter
    article_likes?: ArticleLikesListRelationFilter
  }

  export type ArticlesOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrderInput | SortOrder
    cover_url?: SortOrderInput | SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    author_name?: SortOrderInput | SortOrder
    author_avatar?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    is_top?: SortOrder
    read_time?: SortOrderInput | SortOrder
    published_at?: SortOrder
    is_published?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    categories?: CategoriesOrderByWithRelationInput
    users?: UsersOrderByWithRelationInput
    article_content_blocks?: ArticleContentBlocksOrderByRelationAggregateInput
    article_likes?: ArticleLikesOrderByRelationAggregateInput
    _relevance?: ArticlesOrderByRelevanceInput
  }

  export type ArticlesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticlesWhereInput | ArticlesWhereInput[]
    OR?: ArticlesWhereInput[]
    NOT?: ArticlesWhereInput | ArticlesWhereInput[]
    title?: StringFilter<"Articles"> | string
    summary?: StringNullableFilter<"Articles"> | string | null
    cover_url?: StringNullableFilter<"Articles"> | string | null
    category_id?: StringFilter<"Articles"> | string
    author_id?: StringFilter<"Articles"> | string
    author_name?: StringNullableFilter<"Articles"> | string | null
    author_avatar?: StringNullableFilter<"Articles"> | string | null
    tags?: StringNullableFilter<"Articles"> | string | null
    views?: IntFilter<"Articles"> | number
    likes?: IntFilter<"Articles"> | number
    comments_count?: IntFilter<"Articles"> | number
    is_top?: BoolFilter<"Articles"> | boolean
    read_time?: IntNullableFilter<"Articles"> | number | null
    published_at?: BigIntFilter<"Articles"> | bigint | number
    is_published?: BoolFilter<"Articles"> | boolean
    created_at?: BigIntFilter<"Articles"> | bigint | number
    updated_at?: BigIntFilter<"Articles"> | bigint | number
    categories?: XOR<CategoriesScalarRelationFilter, CategoriesWhereInput>
    users?: XOR<UsersScalarRelationFilter, UsersWhereInput>
    article_content_blocks?: ArticleContentBlocksListRelationFilter
    article_likes?: ArticleLikesListRelationFilter
  }, "id">

  export type ArticlesOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrderInput | SortOrder
    cover_url?: SortOrderInput | SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    author_name?: SortOrderInput | SortOrder
    author_avatar?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    is_top?: SortOrder
    read_time?: SortOrderInput | SortOrder
    published_at?: SortOrder
    is_published?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ArticlesCountOrderByAggregateInput
    _avg?: ArticlesAvgOrderByAggregateInput
    _max?: ArticlesMaxOrderByAggregateInput
    _min?: ArticlesMinOrderByAggregateInput
    _sum?: ArticlesSumOrderByAggregateInput
  }

  export type ArticlesScalarWhereWithAggregatesInput = {
    AND?: ArticlesScalarWhereWithAggregatesInput | ArticlesScalarWhereWithAggregatesInput[]
    OR?: ArticlesScalarWhereWithAggregatesInput[]
    NOT?: ArticlesScalarWhereWithAggregatesInput | ArticlesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Articles"> | string
    title?: StringWithAggregatesFilter<"Articles"> | string
    summary?: StringNullableWithAggregatesFilter<"Articles"> | string | null
    cover_url?: StringNullableWithAggregatesFilter<"Articles"> | string | null
    category_id?: StringWithAggregatesFilter<"Articles"> | string
    author_id?: StringWithAggregatesFilter<"Articles"> | string
    author_name?: StringNullableWithAggregatesFilter<"Articles"> | string | null
    author_avatar?: StringNullableWithAggregatesFilter<"Articles"> | string | null
    tags?: StringNullableWithAggregatesFilter<"Articles"> | string | null
    views?: IntWithAggregatesFilter<"Articles"> | number
    likes?: IntWithAggregatesFilter<"Articles"> | number
    comments_count?: IntWithAggregatesFilter<"Articles"> | number
    is_top?: BoolWithAggregatesFilter<"Articles"> | boolean
    read_time?: IntNullableWithAggregatesFilter<"Articles"> | number | null
    published_at?: BigIntWithAggregatesFilter<"Articles"> | bigint | number
    is_published?: BoolWithAggregatesFilter<"Articles"> | boolean
    created_at?: BigIntWithAggregatesFilter<"Articles"> | bigint | number
    updated_at?: BigIntWithAggregatesFilter<"Articles"> | bigint | number
  }

  export type RefreshTokensWhereInput = {
    AND?: RefreshTokensWhereInput | RefreshTokensWhereInput[]
    OR?: RefreshTokensWhereInput[]
    NOT?: RefreshTokensWhereInput | RefreshTokensWhereInput[]
    id?: StringFilter<"RefreshTokens"> | string
    user_id?: StringFilter<"RefreshTokens"> | string
    refresh_token?: StringFilter<"RefreshTokens"> | string
    client_ip?: StringFilter<"RefreshTokens"> | string
    expires_at?: BigIntFilter<"RefreshTokens"> | bigint | number
    revoked?: BoolFilter<"RefreshTokens"> | boolean
    created_at?: BigIntFilter<"RefreshTokens"> | bigint | number
    users?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type RefreshTokensOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    refresh_token?: SortOrder
    client_ip?: SortOrder
    expires_at?: SortOrder
    revoked?: SortOrder
    created_at?: SortOrder
    users?: UsersOrderByWithRelationInput
    _relevance?: RefreshTokensOrderByRelevanceInput
  }

  export type RefreshTokensWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    refresh_token?: string
    AND?: RefreshTokensWhereInput | RefreshTokensWhereInput[]
    OR?: RefreshTokensWhereInput[]
    NOT?: RefreshTokensWhereInput | RefreshTokensWhereInput[]
    user_id?: StringFilter<"RefreshTokens"> | string
    client_ip?: StringFilter<"RefreshTokens"> | string
    expires_at?: BigIntFilter<"RefreshTokens"> | bigint | number
    revoked?: BoolFilter<"RefreshTokens"> | boolean
    created_at?: BigIntFilter<"RefreshTokens"> | bigint | number
    users?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id" | "refresh_token">

  export type RefreshTokensOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    refresh_token?: SortOrder
    client_ip?: SortOrder
    expires_at?: SortOrder
    revoked?: SortOrder
    created_at?: SortOrder
    _count?: RefreshTokensCountOrderByAggregateInput
    _avg?: RefreshTokensAvgOrderByAggregateInput
    _max?: RefreshTokensMaxOrderByAggregateInput
    _min?: RefreshTokensMinOrderByAggregateInput
    _sum?: RefreshTokensSumOrderByAggregateInput
  }

  export type RefreshTokensScalarWhereWithAggregatesInput = {
    AND?: RefreshTokensScalarWhereWithAggregatesInput | RefreshTokensScalarWhereWithAggregatesInput[]
    OR?: RefreshTokensScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokensScalarWhereWithAggregatesInput | RefreshTokensScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshTokens"> | string
    user_id?: StringWithAggregatesFilter<"RefreshTokens"> | string
    refresh_token?: StringWithAggregatesFilter<"RefreshTokens"> | string
    client_ip?: StringWithAggregatesFilter<"RefreshTokens"> | string
    expires_at?: BigIntWithAggregatesFilter<"RefreshTokens"> | bigint | number
    revoked?: BoolWithAggregatesFilter<"RefreshTokens"> | boolean
    created_at?: BigIntWithAggregatesFilter<"RefreshTokens"> | bigint | number
  }

  export type UsersWhereInput = {
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    id?: StringFilter<"Users"> | string
    username?: StringFilter<"Users"> | string
    password_hash?: StringFilter<"Users"> | string
    password_algorithm?: StringNullableFilter<"Users"> | string | null
    email?: StringNullableFilter<"Users"> | string | null
    nickname?: StringNullableFilter<"Users"> | string | null
    avatar?: StringNullableFilter<"Users"> | string | null
    is_active?: BoolFilter<"Users"> | boolean
    created_at?: BigIntFilter<"Users"> | bigint | number
    updated_at?: BigIntFilter<"Users"> | bigint | number
    articles?: ArticlesListRelationFilter
    refresh_tokens?: RefreshTokensListRelationFilter
    article_likes?: ArticleLikesListRelationFilter
  }

  export type UsersOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    password_algorithm?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    nickname?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    articles?: ArticlesOrderByRelationAggregateInput
    refresh_tokens?: RefreshTokensOrderByRelationAggregateInput
    article_likes?: ArticleLikesOrderByRelationAggregateInput
    _relevance?: UsersOrderByRelevanceInput
  }

  export type UsersWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UsersWhereInput | UsersWhereInput[]
    OR?: UsersWhereInput[]
    NOT?: UsersWhereInput | UsersWhereInput[]
    password_hash?: StringFilter<"Users"> | string
    password_algorithm?: StringNullableFilter<"Users"> | string | null
    email?: StringNullableFilter<"Users"> | string | null
    nickname?: StringNullableFilter<"Users"> | string | null
    avatar?: StringNullableFilter<"Users"> | string | null
    is_active?: BoolFilter<"Users"> | boolean
    created_at?: BigIntFilter<"Users"> | bigint | number
    updated_at?: BigIntFilter<"Users"> | bigint | number
    articles?: ArticlesListRelationFilter
    refresh_tokens?: RefreshTokensListRelationFilter
    article_likes?: ArticleLikesListRelationFilter
  }, "id" | "username">

  export type UsersOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    password_algorithm?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    nickname?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UsersCountOrderByAggregateInput
    _avg?: UsersAvgOrderByAggregateInput
    _max?: UsersMaxOrderByAggregateInput
    _min?: UsersMinOrderByAggregateInput
    _sum?: UsersSumOrderByAggregateInput
  }

  export type UsersScalarWhereWithAggregatesInput = {
    AND?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    OR?: UsersScalarWhereWithAggregatesInput[]
    NOT?: UsersScalarWhereWithAggregatesInput | UsersScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Users"> | string
    username?: StringWithAggregatesFilter<"Users"> | string
    password_hash?: StringWithAggregatesFilter<"Users"> | string
    password_algorithm?: StringNullableWithAggregatesFilter<"Users"> | string | null
    email?: StringNullableWithAggregatesFilter<"Users"> | string | null
    nickname?: StringNullableWithAggregatesFilter<"Users"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"Users"> | string | null
    is_active?: BoolWithAggregatesFilter<"Users"> | boolean
    created_at?: BigIntWithAggregatesFilter<"Users"> | bigint | number
    updated_at?: BigIntWithAggregatesFilter<"Users"> | bigint | number
  }

  export type ArticleContentBlocksWhereInput = {
    AND?: ArticleContentBlocksWhereInput | ArticleContentBlocksWhereInput[]
    OR?: ArticleContentBlocksWhereInput[]
    NOT?: ArticleContentBlocksWhereInput | ArticleContentBlocksWhereInput[]
    id?: StringFilter<"ArticleContentBlocks"> | string
    article_id?: StringFilter<"ArticleContentBlocks"> | string
    block_type?: StringFilter<"ArticleContentBlocks"> | string
    content?: StringFilter<"ArticleContentBlocks"> | string
    sort_order?: IntFilter<"ArticleContentBlocks"> | number
    created_at?: BigIntFilter<"ArticleContentBlocks"> | bigint | number
    updated_at?: BigIntFilter<"ArticleContentBlocks"> | bigint | number
    articles?: XOR<ArticlesScalarRelationFilter, ArticlesWhereInput>
  }

  export type ArticleContentBlocksOrderByWithRelationInput = {
    id?: SortOrder
    article_id?: SortOrder
    block_type?: SortOrder
    content?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    articles?: ArticlesOrderByWithRelationInput
    _relevance?: ArticleContentBlocksOrderByRelevanceInput
  }

  export type ArticleContentBlocksWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ArticleContentBlocksWhereInput | ArticleContentBlocksWhereInput[]
    OR?: ArticleContentBlocksWhereInput[]
    NOT?: ArticleContentBlocksWhereInput | ArticleContentBlocksWhereInput[]
    article_id?: StringFilter<"ArticleContentBlocks"> | string
    block_type?: StringFilter<"ArticleContentBlocks"> | string
    content?: StringFilter<"ArticleContentBlocks"> | string
    sort_order?: IntFilter<"ArticleContentBlocks"> | number
    created_at?: BigIntFilter<"ArticleContentBlocks"> | bigint | number
    updated_at?: BigIntFilter<"ArticleContentBlocks"> | bigint | number
    articles?: XOR<ArticlesScalarRelationFilter, ArticlesWhereInput>
  }, "id">

  export type ArticleContentBlocksOrderByWithAggregationInput = {
    id?: SortOrder
    article_id?: SortOrder
    block_type?: SortOrder
    content?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ArticleContentBlocksCountOrderByAggregateInput
    _avg?: ArticleContentBlocksAvgOrderByAggregateInput
    _max?: ArticleContentBlocksMaxOrderByAggregateInput
    _min?: ArticleContentBlocksMinOrderByAggregateInput
    _sum?: ArticleContentBlocksSumOrderByAggregateInput
  }

  export type ArticleContentBlocksScalarWhereWithAggregatesInput = {
    AND?: ArticleContentBlocksScalarWhereWithAggregatesInput | ArticleContentBlocksScalarWhereWithAggregatesInput[]
    OR?: ArticleContentBlocksScalarWhereWithAggregatesInput[]
    NOT?: ArticleContentBlocksScalarWhereWithAggregatesInput | ArticleContentBlocksScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleContentBlocks"> | string
    article_id?: StringWithAggregatesFilter<"ArticleContentBlocks"> | string
    block_type?: StringWithAggregatesFilter<"ArticleContentBlocks"> | string
    content?: StringWithAggregatesFilter<"ArticleContentBlocks"> | string
    sort_order?: IntWithAggregatesFilter<"ArticleContentBlocks"> | number
    created_at?: BigIntWithAggregatesFilter<"ArticleContentBlocks"> | bigint | number
    updated_at?: BigIntWithAggregatesFilter<"ArticleContentBlocks"> | bigint | number
  }

  export type ArticleLikesWhereInput = {
    AND?: ArticleLikesWhereInput | ArticleLikesWhereInput[]
    OR?: ArticleLikesWhereInput[]
    NOT?: ArticleLikesWhereInput | ArticleLikesWhereInput[]
    id?: StringFilter<"ArticleLikes"> | string
    article_id?: StringFilter<"ArticleLikes"> | string
    user_id?: StringFilter<"ArticleLikes"> | string
    created_at?: BigIntFilter<"ArticleLikes"> | bigint | number
    articles?: XOR<ArticlesScalarRelationFilter, ArticlesWhereInput>
    users?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }

  export type ArticleLikesOrderByWithRelationInput = {
    id?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    articles?: ArticlesOrderByWithRelationInput
    users?: UsersOrderByWithRelationInput
    _relevance?: ArticleLikesOrderByRelevanceInput
  }

  export type ArticleLikesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    article_id_user_id?: ArticleLikesArticle_idUser_idCompoundUniqueInput
    AND?: ArticleLikesWhereInput | ArticleLikesWhereInput[]
    OR?: ArticleLikesWhereInput[]
    NOT?: ArticleLikesWhereInput | ArticleLikesWhereInput[]
    article_id?: StringFilter<"ArticleLikes"> | string
    user_id?: StringFilter<"ArticleLikes"> | string
    created_at?: BigIntFilter<"ArticleLikes"> | bigint | number
    articles?: XOR<ArticlesScalarRelationFilter, ArticlesWhereInput>
    users?: XOR<UsersScalarRelationFilter, UsersWhereInput>
  }, "id" | "article_id_user_id">

  export type ArticleLikesOrderByWithAggregationInput = {
    id?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    _count?: ArticleLikesCountOrderByAggregateInput
    _avg?: ArticleLikesAvgOrderByAggregateInput
    _max?: ArticleLikesMaxOrderByAggregateInput
    _min?: ArticleLikesMinOrderByAggregateInput
    _sum?: ArticleLikesSumOrderByAggregateInput
  }

  export type ArticleLikesScalarWhereWithAggregatesInput = {
    AND?: ArticleLikesScalarWhereWithAggregatesInput | ArticleLikesScalarWhereWithAggregatesInput[]
    OR?: ArticleLikesScalarWhereWithAggregatesInput[]
    NOT?: ArticleLikesScalarWhereWithAggregatesInput | ArticleLikesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ArticleLikes"> | string
    article_id?: StringWithAggregatesFilter<"ArticleLikes"> | string
    user_id?: StringWithAggregatesFilter<"ArticleLikes"> | string
    created_at?: BigIntWithAggregatesFilter<"ArticleLikes"> | bigint | number
  }

  export type CategoriesCreateInput = {
    id: string
    name: string
    description?: string | null
    image_url?: string | null
    article_count?: number
    sort_order?: number | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesCreateNestedManyWithoutCategoriesInput
  }

  export type CategoriesUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    image_url?: string | null
    article_count?: number
    sort_order?: number | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesUncheckedCreateNestedManyWithoutCategoriesInput
  }

  export type CategoriesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    article_count?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateManyWithoutCategoriesNestedInput
  }

  export type CategoriesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    article_count?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUncheckedUpdateManyWithoutCategoriesNestedInput
  }

  export type CategoriesCreateManyInput = {
    id: string
    name: string
    description?: string | null
    image_url?: string | null
    article_count?: number
    sort_order?: number | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type CategoriesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    article_count?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type CategoriesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    article_count?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type HotSearchKeywordsCreateInput = {
    id: string
    keyword: string
    hot_score?: number
    is_active?: boolean
    sort_order?: number | null
    created_at: bigint | number
  }

  export type HotSearchKeywordsUncheckedCreateInput = {
    id: string
    keyword: string
    hot_score?: number
    is_active?: boolean
    sort_order?: number | null
    created_at: bigint | number
  }

  export type HotSearchKeywordsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    hot_score?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type HotSearchKeywordsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    hot_score?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type HotSearchKeywordsCreateManyInput = {
    id: string
    keyword: string
    hot_score?: number
    is_active?: boolean
    sort_order?: number | null
    created_at: bigint | number
  }

  export type HotSearchKeywordsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    hot_score?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type HotSearchKeywordsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    keyword?: StringFieldUpdateOperationsInput | string
    hot_score?: IntFieldUpdateOperationsInput | number
    is_active?: BoolFieldUpdateOperationsInput | boolean
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticlesCreateInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    categories: CategoriesCreateNestedOneWithoutArticlesInput
    users: UsersCreateNestedOneWithoutArticlesInput
    article_content_blocks?: ArticleContentBlocksCreateNestedManyWithoutArticlesInput
    article_likes?: ArticleLikesCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesUncheckedCreateInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    category_id: string
    author_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedCreateNestedManyWithoutArticlesInput
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    categories?: CategoriesUpdateOneRequiredWithoutArticlesNestedInput
    users?: UsersUpdateOneRequiredWithoutArticlesNestedInput
    article_content_blocks?: ArticleContentBlocksUpdateManyWithoutArticlesNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    category_id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedUpdateManyWithoutArticlesNestedInput
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesCreateManyInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    category_id: string
    author_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticlesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticlesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    category_id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type RefreshTokensCreateInput = {
    id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint | number
    revoked?: boolean
    created_at: bigint | number
    users: UsersCreateNestedOneWithoutRefresh_tokensInput
  }

  export type RefreshTokensUncheckedCreateInput = {
    id: string
    user_id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint | number
    revoked?: boolean
    created_at: bigint | number
  }

  export type RefreshTokensUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    users?: UsersUpdateOneRequiredWithoutRefresh_tokensNestedInput
  }

  export type RefreshTokensUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type RefreshTokensCreateManyInput = {
    id: string
    user_id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint | number
    revoked?: boolean
    created_at: bigint | number
  }

  export type RefreshTokensUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type RefreshTokensUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsersCreateInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesCreateNestedManyWithoutUsersInput
    refresh_tokens?: RefreshTokensCreateNestedManyWithoutUsersInput
    article_likes?: ArticleLikesCreateNestedManyWithoutUsersInput
  }

  export type UsersUncheckedCreateInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesUncheckedCreateNestedManyWithoutUsersInput
    refresh_tokens?: RefreshTokensUncheckedCreateNestedManyWithoutUsersInput
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type UsersUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateManyWithoutUsersNestedInput
    refresh_tokens?: RefreshTokensUpdateManyWithoutUsersNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutUsersNestedInput
  }

  export type UsersUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUncheckedUpdateManyWithoutUsersNestedInput
    refresh_tokens?: RefreshTokensUncheckedUpdateManyWithoutUsersNestedInput
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type UsersCreateManyInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type UsersUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsersUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleContentBlocksCreateInput = {
    id: string
    block_type: string
    content: string
    sort_order?: number
    created_at: bigint | number
    updated_at: bigint | number
    articles: ArticlesCreateNestedOneWithoutArticle_content_blocksInput
  }

  export type ArticleContentBlocksUncheckedCreateInput = {
    id: string
    article_id: string
    block_type: string
    content: string
    sort_order?: number
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticleContentBlocksUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateOneRequiredWithoutArticle_content_blocksNestedInput
  }

  export type ArticleContentBlocksUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleContentBlocksCreateManyInput = {
    id: string
    article_id: string
    block_type: string
    content: string
    sort_order?: number
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticleContentBlocksUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleContentBlocksUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesCreateInput = {
    id: string
    created_at: bigint | number
    articles: ArticlesCreateNestedOneWithoutArticle_likesInput
    users: UsersCreateNestedOneWithoutArticle_likesInput
  }

  export type ArticleLikesUncheckedCreateInput = {
    id: string
    article_id: string
    user_id: string
    created_at: bigint | number
  }

  export type ArticleLikesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateOneRequiredWithoutArticle_likesNestedInput
    users?: UsersUpdateOneRequiredWithoutArticle_likesNestedInput
  }

  export type ArticleLikesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesCreateManyInput = {
    id: string
    article_id: string
    user_id: string
    created_at: bigint | number
  }

  export type ArticleLikesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type ArticlesListRelationFilter = {
    every?: ArticlesWhereInput
    some?: ArticlesWhereInput
    none?: ArticlesWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ArticlesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoriesOrderByRelevanceInput = {
    fields: CategoriesOrderByRelevanceFieldEnum | CategoriesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CategoriesCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    article_count?: SortOrder
    sort_order?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoriesAvgOrderByAggregateInput = {
    article_count?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoriesMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    article_count?: SortOrder
    sort_order?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoriesMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    image_url?: SortOrder
    article_count?: SortOrder
    sort_order?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CategoriesSumOrderByAggregateInput = {
    article_count?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type HotSearchKeywordsOrderByRelevanceInput = {
    fields: HotSearchKeywordsOrderByRelevanceFieldEnum | HotSearchKeywordsOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type HotSearchKeywordsCountOrderByAggregateInput = {
    id?: SortOrder
    keyword?: SortOrder
    hot_score?: SortOrder
    is_active?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type HotSearchKeywordsAvgOrderByAggregateInput = {
    hot_score?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type HotSearchKeywordsMaxOrderByAggregateInput = {
    id?: SortOrder
    keyword?: SortOrder
    hot_score?: SortOrder
    is_active?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type HotSearchKeywordsMinOrderByAggregateInput = {
    id?: SortOrder
    keyword?: SortOrder
    hot_score?: SortOrder
    is_active?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type HotSearchKeywordsSumOrderByAggregateInput = {
    hot_score?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
  }

  export type CategoriesScalarRelationFilter = {
    is?: CategoriesWhereInput
    isNot?: CategoriesWhereInput
  }

  export type UsersScalarRelationFilter = {
    is?: UsersWhereInput
    isNot?: UsersWhereInput
  }

  export type ArticleContentBlocksListRelationFilter = {
    every?: ArticleContentBlocksWhereInput
    some?: ArticleContentBlocksWhereInput
    none?: ArticleContentBlocksWhereInput
  }

  export type ArticleLikesListRelationFilter = {
    every?: ArticleLikesWhereInput
    some?: ArticleLikesWhereInput
    none?: ArticleLikesWhereInput
  }

  export type ArticleContentBlocksOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticleLikesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ArticlesOrderByRelevanceInput = {
    fields: ArticlesOrderByRelevanceFieldEnum | ArticlesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ArticlesCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    cover_url?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    author_name?: SortOrder
    author_avatar?: SortOrder
    tags?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    is_top?: SortOrder
    read_time?: SortOrder
    published_at?: SortOrder
    is_published?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticlesAvgOrderByAggregateInput = {
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    read_time?: SortOrder
    published_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticlesMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    cover_url?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    author_name?: SortOrder
    author_avatar?: SortOrder
    tags?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    is_top?: SortOrder
    read_time?: SortOrder
    published_at?: SortOrder
    is_published?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticlesMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    cover_url?: SortOrder
    category_id?: SortOrder
    author_id?: SortOrder
    author_name?: SortOrder
    author_avatar?: SortOrder
    tags?: SortOrder
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    is_top?: SortOrder
    read_time?: SortOrder
    published_at?: SortOrder
    is_published?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticlesSumOrderByAggregateInput = {
    views?: SortOrder
    likes?: SortOrder
    comments_count?: SortOrder
    read_time?: SortOrder
    published_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type RefreshTokensOrderByRelevanceInput = {
    fields: RefreshTokensOrderByRelevanceFieldEnum | RefreshTokensOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RefreshTokensCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    refresh_token?: SortOrder
    client_ip?: SortOrder
    expires_at?: SortOrder
    revoked?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokensAvgOrderByAggregateInput = {
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokensMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    refresh_token?: SortOrder
    client_ip?: SortOrder
    expires_at?: SortOrder
    revoked?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokensMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    refresh_token?: SortOrder
    client_ip?: SortOrder
    expires_at?: SortOrder
    revoked?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokensSumOrderByAggregateInput = {
    expires_at?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokensListRelationFilter = {
    every?: RefreshTokensWhereInput
    some?: RefreshTokensWhereInput
    none?: RefreshTokensWhereInput
  }

  export type RefreshTokensOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsersOrderByRelevanceInput = {
    fields: UsersOrderByRelevanceFieldEnum | UsersOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UsersCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    password_algorithm?: SortOrder
    email?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsersAvgOrderByAggregateInput = {
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsersMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    password_algorithm?: SortOrder
    email?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsersMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password_hash?: SortOrder
    password_algorithm?: SortOrder
    email?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrder
    is_active?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UsersSumOrderByAggregateInput = {
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticlesScalarRelationFilter = {
    is?: ArticlesWhereInput
    isNot?: ArticlesWhereInput
  }

  export type ArticleContentBlocksOrderByRelevanceInput = {
    fields: ArticleContentBlocksOrderByRelevanceFieldEnum | ArticleContentBlocksOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ArticleContentBlocksCountOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
    block_type?: SortOrder
    content?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleContentBlocksAvgOrderByAggregateInput = {
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleContentBlocksMaxOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
    block_type?: SortOrder
    content?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleContentBlocksMinOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
    block_type?: SortOrder
    content?: SortOrder
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleContentBlocksSumOrderByAggregateInput = {
    sort_order?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ArticleLikesOrderByRelevanceInput = {
    fields: ArticleLikesOrderByRelevanceFieldEnum | ArticleLikesOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ArticleLikesArticle_idUser_idCompoundUniqueInput = {
    article_id: string
    user_id: string
  }

  export type ArticleLikesCountOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type ArticleLikesAvgOrderByAggregateInput = {
    created_at?: SortOrder
  }

  export type ArticleLikesMaxOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type ArticleLikesMinOrderByAggregateInput = {
    id?: SortOrder
    article_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
  }

  export type ArticleLikesSumOrderByAggregateInput = {
    created_at?: SortOrder
  }

  export type ArticlesCreateNestedManyWithoutCategoriesInput = {
    create?: XOR<ArticlesCreateWithoutCategoriesInput, ArticlesUncheckedCreateWithoutCategoriesInput> | ArticlesCreateWithoutCategoriesInput[] | ArticlesUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutCategoriesInput | ArticlesCreateOrConnectWithoutCategoriesInput[]
    createMany?: ArticlesCreateManyCategoriesInputEnvelope
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
  }

  export type ArticlesUncheckedCreateNestedManyWithoutCategoriesInput = {
    create?: XOR<ArticlesCreateWithoutCategoriesInput, ArticlesUncheckedCreateWithoutCategoriesInput> | ArticlesCreateWithoutCategoriesInput[] | ArticlesUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutCategoriesInput | ArticlesCreateOrConnectWithoutCategoriesInput[]
    createMany?: ArticlesCreateManyCategoriesInputEnvelope
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type ArticlesUpdateManyWithoutCategoriesNestedInput = {
    create?: XOR<ArticlesCreateWithoutCategoriesInput, ArticlesUncheckedCreateWithoutCategoriesInput> | ArticlesCreateWithoutCategoriesInput[] | ArticlesUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutCategoriesInput | ArticlesCreateOrConnectWithoutCategoriesInput[]
    upsert?: ArticlesUpsertWithWhereUniqueWithoutCategoriesInput | ArticlesUpsertWithWhereUniqueWithoutCategoriesInput[]
    createMany?: ArticlesCreateManyCategoriesInputEnvelope
    set?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    disconnect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    delete?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    update?: ArticlesUpdateWithWhereUniqueWithoutCategoriesInput | ArticlesUpdateWithWhereUniqueWithoutCategoriesInput[]
    updateMany?: ArticlesUpdateManyWithWhereWithoutCategoriesInput | ArticlesUpdateManyWithWhereWithoutCategoriesInput[]
    deleteMany?: ArticlesScalarWhereInput | ArticlesScalarWhereInput[]
  }

  export type ArticlesUncheckedUpdateManyWithoutCategoriesNestedInput = {
    create?: XOR<ArticlesCreateWithoutCategoriesInput, ArticlesUncheckedCreateWithoutCategoriesInput> | ArticlesCreateWithoutCategoriesInput[] | ArticlesUncheckedCreateWithoutCategoriesInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutCategoriesInput | ArticlesCreateOrConnectWithoutCategoriesInput[]
    upsert?: ArticlesUpsertWithWhereUniqueWithoutCategoriesInput | ArticlesUpsertWithWhereUniqueWithoutCategoriesInput[]
    createMany?: ArticlesCreateManyCategoriesInputEnvelope
    set?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    disconnect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    delete?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    update?: ArticlesUpdateWithWhereUniqueWithoutCategoriesInput | ArticlesUpdateWithWhereUniqueWithoutCategoriesInput[]
    updateMany?: ArticlesUpdateManyWithWhereWithoutCategoriesInput | ArticlesUpdateManyWithWhereWithoutCategoriesInput[]
    deleteMany?: ArticlesScalarWhereInput | ArticlesScalarWhereInput[]
  }

  export type CategoriesCreateNestedOneWithoutArticlesInput = {
    create?: XOR<CategoriesCreateWithoutArticlesInput, CategoriesUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: CategoriesCreateOrConnectWithoutArticlesInput
    connect?: CategoriesWhereUniqueInput
  }

  export type UsersCreateNestedOneWithoutArticlesInput = {
    create?: XOR<UsersCreateWithoutArticlesInput, UsersUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: UsersCreateOrConnectWithoutArticlesInput
    connect?: UsersWhereUniqueInput
  }

  export type ArticleContentBlocksCreateNestedManyWithoutArticlesInput = {
    create?: XOR<ArticleContentBlocksCreateWithoutArticlesInput, ArticleContentBlocksUncheckedCreateWithoutArticlesInput> | ArticleContentBlocksCreateWithoutArticlesInput[] | ArticleContentBlocksUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleContentBlocksCreateOrConnectWithoutArticlesInput | ArticleContentBlocksCreateOrConnectWithoutArticlesInput[]
    createMany?: ArticleContentBlocksCreateManyArticlesInputEnvelope
    connect?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
  }

  export type ArticleLikesCreateNestedManyWithoutArticlesInput = {
    create?: XOR<ArticleLikesCreateWithoutArticlesInput, ArticleLikesUncheckedCreateWithoutArticlesInput> | ArticleLikesCreateWithoutArticlesInput[] | ArticleLikesUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutArticlesInput | ArticleLikesCreateOrConnectWithoutArticlesInput[]
    createMany?: ArticleLikesCreateManyArticlesInputEnvelope
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
  }

  export type ArticleContentBlocksUncheckedCreateNestedManyWithoutArticlesInput = {
    create?: XOR<ArticleContentBlocksCreateWithoutArticlesInput, ArticleContentBlocksUncheckedCreateWithoutArticlesInput> | ArticleContentBlocksCreateWithoutArticlesInput[] | ArticleContentBlocksUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleContentBlocksCreateOrConnectWithoutArticlesInput | ArticleContentBlocksCreateOrConnectWithoutArticlesInput[]
    createMany?: ArticleContentBlocksCreateManyArticlesInputEnvelope
    connect?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
  }

  export type ArticleLikesUncheckedCreateNestedManyWithoutArticlesInput = {
    create?: XOR<ArticleLikesCreateWithoutArticlesInput, ArticleLikesUncheckedCreateWithoutArticlesInput> | ArticleLikesCreateWithoutArticlesInput[] | ArticleLikesUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutArticlesInput | ArticleLikesCreateOrConnectWithoutArticlesInput[]
    createMany?: ArticleLikesCreateManyArticlesInputEnvelope
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
  }

  export type CategoriesUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: XOR<CategoriesCreateWithoutArticlesInput, CategoriesUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: CategoriesCreateOrConnectWithoutArticlesInput
    upsert?: CategoriesUpsertWithoutArticlesInput
    connect?: CategoriesWhereUniqueInput
    update?: XOR<XOR<CategoriesUpdateToOneWithWhereWithoutArticlesInput, CategoriesUpdateWithoutArticlesInput>, CategoriesUncheckedUpdateWithoutArticlesInput>
  }

  export type UsersUpdateOneRequiredWithoutArticlesNestedInput = {
    create?: XOR<UsersCreateWithoutArticlesInput, UsersUncheckedCreateWithoutArticlesInput>
    connectOrCreate?: UsersCreateOrConnectWithoutArticlesInput
    upsert?: UsersUpsertWithoutArticlesInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutArticlesInput, UsersUpdateWithoutArticlesInput>, UsersUncheckedUpdateWithoutArticlesInput>
  }

  export type ArticleContentBlocksUpdateManyWithoutArticlesNestedInput = {
    create?: XOR<ArticleContentBlocksCreateWithoutArticlesInput, ArticleContentBlocksUncheckedCreateWithoutArticlesInput> | ArticleContentBlocksCreateWithoutArticlesInput[] | ArticleContentBlocksUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleContentBlocksCreateOrConnectWithoutArticlesInput | ArticleContentBlocksCreateOrConnectWithoutArticlesInput[]
    upsert?: ArticleContentBlocksUpsertWithWhereUniqueWithoutArticlesInput | ArticleContentBlocksUpsertWithWhereUniqueWithoutArticlesInput[]
    createMany?: ArticleContentBlocksCreateManyArticlesInputEnvelope
    set?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    disconnect?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    delete?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    connect?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    update?: ArticleContentBlocksUpdateWithWhereUniqueWithoutArticlesInput | ArticleContentBlocksUpdateWithWhereUniqueWithoutArticlesInput[]
    updateMany?: ArticleContentBlocksUpdateManyWithWhereWithoutArticlesInput | ArticleContentBlocksUpdateManyWithWhereWithoutArticlesInput[]
    deleteMany?: ArticleContentBlocksScalarWhereInput | ArticleContentBlocksScalarWhereInput[]
  }

  export type ArticleLikesUpdateManyWithoutArticlesNestedInput = {
    create?: XOR<ArticleLikesCreateWithoutArticlesInput, ArticleLikesUncheckedCreateWithoutArticlesInput> | ArticleLikesCreateWithoutArticlesInput[] | ArticleLikesUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutArticlesInput | ArticleLikesCreateOrConnectWithoutArticlesInput[]
    upsert?: ArticleLikesUpsertWithWhereUniqueWithoutArticlesInput | ArticleLikesUpsertWithWhereUniqueWithoutArticlesInput[]
    createMany?: ArticleLikesCreateManyArticlesInputEnvelope
    set?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    disconnect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    delete?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    update?: ArticleLikesUpdateWithWhereUniqueWithoutArticlesInput | ArticleLikesUpdateWithWhereUniqueWithoutArticlesInput[]
    updateMany?: ArticleLikesUpdateManyWithWhereWithoutArticlesInput | ArticleLikesUpdateManyWithWhereWithoutArticlesInput[]
    deleteMany?: ArticleLikesScalarWhereInput | ArticleLikesScalarWhereInput[]
  }

  export type ArticleContentBlocksUncheckedUpdateManyWithoutArticlesNestedInput = {
    create?: XOR<ArticleContentBlocksCreateWithoutArticlesInput, ArticleContentBlocksUncheckedCreateWithoutArticlesInput> | ArticleContentBlocksCreateWithoutArticlesInput[] | ArticleContentBlocksUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleContentBlocksCreateOrConnectWithoutArticlesInput | ArticleContentBlocksCreateOrConnectWithoutArticlesInput[]
    upsert?: ArticleContentBlocksUpsertWithWhereUniqueWithoutArticlesInput | ArticleContentBlocksUpsertWithWhereUniqueWithoutArticlesInput[]
    createMany?: ArticleContentBlocksCreateManyArticlesInputEnvelope
    set?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    disconnect?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    delete?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    connect?: ArticleContentBlocksWhereUniqueInput | ArticleContentBlocksWhereUniqueInput[]
    update?: ArticleContentBlocksUpdateWithWhereUniqueWithoutArticlesInput | ArticleContentBlocksUpdateWithWhereUniqueWithoutArticlesInput[]
    updateMany?: ArticleContentBlocksUpdateManyWithWhereWithoutArticlesInput | ArticleContentBlocksUpdateManyWithWhereWithoutArticlesInput[]
    deleteMany?: ArticleContentBlocksScalarWhereInput | ArticleContentBlocksScalarWhereInput[]
  }

  export type ArticleLikesUncheckedUpdateManyWithoutArticlesNestedInput = {
    create?: XOR<ArticleLikesCreateWithoutArticlesInput, ArticleLikesUncheckedCreateWithoutArticlesInput> | ArticleLikesCreateWithoutArticlesInput[] | ArticleLikesUncheckedCreateWithoutArticlesInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutArticlesInput | ArticleLikesCreateOrConnectWithoutArticlesInput[]
    upsert?: ArticleLikesUpsertWithWhereUniqueWithoutArticlesInput | ArticleLikesUpsertWithWhereUniqueWithoutArticlesInput[]
    createMany?: ArticleLikesCreateManyArticlesInputEnvelope
    set?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    disconnect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    delete?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    update?: ArticleLikesUpdateWithWhereUniqueWithoutArticlesInput | ArticleLikesUpdateWithWhereUniqueWithoutArticlesInput[]
    updateMany?: ArticleLikesUpdateManyWithWhereWithoutArticlesInput | ArticleLikesUpdateManyWithWhereWithoutArticlesInput[]
    deleteMany?: ArticleLikesScalarWhereInput | ArticleLikesScalarWhereInput[]
  }

  export type UsersCreateNestedOneWithoutRefresh_tokensInput = {
    create?: XOR<UsersCreateWithoutRefresh_tokensInput, UsersUncheckedCreateWithoutRefresh_tokensInput>
    connectOrCreate?: UsersCreateOrConnectWithoutRefresh_tokensInput
    connect?: UsersWhereUniqueInput
  }

  export type UsersUpdateOneRequiredWithoutRefresh_tokensNestedInput = {
    create?: XOR<UsersCreateWithoutRefresh_tokensInput, UsersUncheckedCreateWithoutRefresh_tokensInput>
    connectOrCreate?: UsersCreateOrConnectWithoutRefresh_tokensInput
    upsert?: UsersUpsertWithoutRefresh_tokensInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutRefresh_tokensInput, UsersUpdateWithoutRefresh_tokensInput>, UsersUncheckedUpdateWithoutRefresh_tokensInput>
  }

  export type ArticlesCreateNestedManyWithoutUsersInput = {
    create?: XOR<ArticlesCreateWithoutUsersInput, ArticlesUncheckedCreateWithoutUsersInput> | ArticlesCreateWithoutUsersInput[] | ArticlesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutUsersInput | ArticlesCreateOrConnectWithoutUsersInput[]
    createMany?: ArticlesCreateManyUsersInputEnvelope
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
  }

  export type RefreshTokensCreateNestedManyWithoutUsersInput = {
    create?: XOR<RefreshTokensCreateWithoutUsersInput, RefreshTokensUncheckedCreateWithoutUsersInput> | RefreshTokensCreateWithoutUsersInput[] | RefreshTokensUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: RefreshTokensCreateOrConnectWithoutUsersInput | RefreshTokensCreateOrConnectWithoutUsersInput[]
    createMany?: RefreshTokensCreateManyUsersInputEnvelope
    connect?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
  }

  export type ArticleLikesCreateNestedManyWithoutUsersInput = {
    create?: XOR<ArticleLikesCreateWithoutUsersInput, ArticleLikesUncheckedCreateWithoutUsersInput> | ArticleLikesCreateWithoutUsersInput[] | ArticleLikesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutUsersInput | ArticleLikesCreateOrConnectWithoutUsersInput[]
    createMany?: ArticleLikesCreateManyUsersInputEnvelope
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
  }

  export type ArticlesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<ArticlesCreateWithoutUsersInput, ArticlesUncheckedCreateWithoutUsersInput> | ArticlesCreateWithoutUsersInput[] | ArticlesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutUsersInput | ArticlesCreateOrConnectWithoutUsersInput[]
    createMany?: ArticlesCreateManyUsersInputEnvelope
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
  }

  export type RefreshTokensUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<RefreshTokensCreateWithoutUsersInput, RefreshTokensUncheckedCreateWithoutUsersInput> | RefreshTokensCreateWithoutUsersInput[] | RefreshTokensUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: RefreshTokensCreateOrConnectWithoutUsersInput | RefreshTokensCreateOrConnectWithoutUsersInput[]
    createMany?: RefreshTokensCreateManyUsersInputEnvelope
    connect?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
  }

  export type ArticleLikesUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<ArticleLikesCreateWithoutUsersInput, ArticleLikesUncheckedCreateWithoutUsersInput> | ArticleLikesCreateWithoutUsersInput[] | ArticleLikesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutUsersInput | ArticleLikesCreateOrConnectWithoutUsersInput[]
    createMany?: ArticleLikesCreateManyUsersInputEnvelope
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
  }

  export type ArticlesUpdateManyWithoutUsersNestedInput = {
    create?: XOR<ArticlesCreateWithoutUsersInput, ArticlesUncheckedCreateWithoutUsersInput> | ArticlesCreateWithoutUsersInput[] | ArticlesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutUsersInput | ArticlesCreateOrConnectWithoutUsersInput[]
    upsert?: ArticlesUpsertWithWhereUniqueWithoutUsersInput | ArticlesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: ArticlesCreateManyUsersInputEnvelope
    set?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    disconnect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    delete?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    update?: ArticlesUpdateWithWhereUniqueWithoutUsersInput | ArticlesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: ArticlesUpdateManyWithWhereWithoutUsersInput | ArticlesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: ArticlesScalarWhereInput | ArticlesScalarWhereInput[]
  }

  export type RefreshTokensUpdateManyWithoutUsersNestedInput = {
    create?: XOR<RefreshTokensCreateWithoutUsersInput, RefreshTokensUncheckedCreateWithoutUsersInput> | RefreshTokensCreateWithoutUsersInput[] | RefreshTokensUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: RefreshTokensCreateOrConnectWithoutUsersInput | RefreshTokensCreateOrConnectWithoutUsersInput[]
    upsert?: RefreshTokensUpsertWithWhereUniqueWithoutUsersInput | RefreshTokensUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: RefreshTokensCreateManyUsersInputEnvelope
    set?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    disconnect?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    delete?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    connect?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    update?: RefreshTokensUpdateWithWhereUniqueWithoutUsersInput | RefreshTokensUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: RefreshTokensUpdateManyWithWhereWithoutUsersInput | RefreshTokensUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: RefreshTokensScalarWhereInput | RefreshTokensScalarWhereInput[]
  }

  export type ArticleLikesUpdateManyWithoutUsersNestedInput = {
    create?: XOR<ArticleLikesCreateWithoutUsersInput, ArticleLikesUncheckedCreateWithoutUsersInput> | ArticleLikesCreateWithoutUsersInput[] | ArticleLikesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutUsersInput | ArticleLikesCreateOrConnectWithoutUsersInput[]
    upsert?: ArticleLikesUpsertWithWhereUniqueWithoutUsersInput | ArticleLikesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: ArticleLikesCreateManyUsersInputEnvelope
    set?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    disconnect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    delete?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    update?: ArticleLikesUpdateWithWhereUniqueWithoutUsersInput | ArticleLikesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: ArticleLikesUpdateManyWithWhereWithoutUsersInput | ArticleLikesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: ArticleLikesScalarWhereInput | ArticleLikesScalarWhereInput[]
  }

  export type ArticlesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<ArticlesCreateWithoutUsersInput, ArticlesUncheckedCreateWithoutUsersInput> | ArticlesCreateWithoutUsersInput[] | ArticlesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticlesCreateOrConnectWithoutUsersInput | ArticlesCreateOrConnectWithoutUsersInput[]
    upsert?: ArticlesUpsertWithWhereUniqueWithoutUsersInput | ArticlesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: ArticlesCreateManyUsersInputEnvelope
    set?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    disconnect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    delete?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    connect?: ArticlesWhereUniqueInput | ArticlesWhereUniqueInput[]
    update?: ArticlesUpdateWithWhereUniqueWithoutUsersInput | ArticlesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: ArticlesUpdateManyWithWhereWithoutUsersInput | ArticlesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: ArticlesScalarWhereInput | ArticlesScalarWhereInput[]
  }

  export type RefreshTokensUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<RefreshTokensCreateWithoutUsersInput, RefreshTokensUncheckedCreateWithoutUsersInput> | RefreshTokensCreateWithoutUsersInput[] | RefreshTokensUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: RefreshTokensCreateOrConnectWithoutUsersInput | RefreshTokensCreateOrConnectWithoutUsersInput[]
    upsert?: RefreshTokensUpsertWithWhereUniqueWithoutUsersInput | RefreshTokensUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: RefreshTokensCreateManyUsersInputEnvelope
    set?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    disconnect?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    delete?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    connect?: RefreshTokensWhereUniqueInput | RefreshTokensWhereUniqueInput[]
    update?: RefreshTokensUpdateWithWhereUniqueWithoutUsersInput | RefreshTokensUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: RefreshTokensUpdateManyWithWhereWithoutUsersInput | RefreshTokensUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: RefreshTokensScalarWhereInput | RefreshTokensScalarWhereInput[]
  }

  export type ArticleLikesUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<ArticleLikesCreateWithoutUsersInput, ArticleLikesUncheckedCreateWithoutUsersInput> | ArticleLikesCreateWithoutUsersInput[] | ArticleLikesUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: ArticleLikesCreateOrConnectWithoutUsersInput | ArticleLikesCreateOrConnectWithoutUsersInput[]
    upsert?: ArticleLikesUpsertWithWhereUniqueWithoutUsersInput | ArticleLikesUpsertWithWhereUniqueWithoutUsersInput[]
    createMany?: ArticleLikesCreateManyUsersInputEnvelope
    set?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    disconnect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    delete?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    connect?: ArticleLikesWhereUniqueInput | ArticleLikesWhereUniqueInput[]
    update?: ArticleLikesUpdateWithWhereUniqueWithoutUsersInput | ArticleLikesUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: ArticleLikesUpdateManyWithWhereWithoutUsersInput | ArticleLikesUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: ArticleLikesScalarWhereInput | ArticleLikesScalarWhereInput[]
  }

  export type ArticlesCreateNestedOneWithoutArticle_content_blocksInput = {
    create?: XOR<ArticlesCreateWithoutArticle_content_blocksInput, ArticlesUncheckedCreateWithoutArticle_content_blocksInput>
    connectOrCreate?: ArticlesCreateOrConnectWithoutArticle_content_blocksInput
    connect?: ArticlesWhereUniqueInput
  }

  export type ArticlesUpdateOneRequiredWithoutArticle_content_blocksNestedInput = {
    create?: XOR<ArticlesCreateWithoutArticle_content_blocksInput, ArticlesUncheckedCreateWithoutArticle_content_blocksInput>
    connectOrCreate?: ArticlesCreateOrConnectWithoutArticle_content_blocksInput
    upsert?: ArticlesUpsertWithoutArticle_content_blocksInput
    connect?: ArticlesWhereUniqueInput
    update?: XOR<XOR<ArticlesUpdateToOneWithWhereWithoutArticle_content_blocksInput, ArticlesUpdateWithoutArticle_content_blocksInput>, ArticlesUncheckedUpdateWithoutArticle_content_blocksInput>
  }

  export type ArticlesCreateNestedOneWithoutArticle_likesInput = {
    create?: XOR<ArticlesCreateWithoutArticle_likesInput, ArticlesUncheckedCreateWithoutArticle_likesInput>
    connectOrCreate?: ArticlesCreateOrConnectWithoutArticle_likesInput
    connect?: ArticlesWhereUniqueInput
  }

  export type UsersCreateNestedOneWithoutArticle_likesInput = {
    create?: XOR<UsersCreateWithoutArticle_likesInput, UsersUncheckedCreateWithoutArticle_likesInput>
    connectOrCreate?: UsersCreateOrConnectWithoutArticle_likesInput
    connect?: UsersWhereUniqueInput
  }

  export type ArticlesUpdateOneRequiredWithoutArticle_likesNestedInput = {
    create?: XOR<ArticlesCreateWithoutArticle_likesInput, ArticlesUncheckedCreateWithoutArticle_likesInput>
    connectOrCreate?: ArticlesCreateOrConnectWithoutArticle_likesInput
    upsert?: ArticlesUpsertWithoutArticle_likesInput
    connect?: ArticlesWhereUniqueInput
    update?: XOR<XOR<ArticlesUpdateToOneWithWhereWithoutArticle_likesInput, ArticlesUpdateWithoutArticle_likesInput>, ArticlesUncheckedUpdateWithoutArticle_likesInput>
  }

  export type UsersUpdateOneRequiredWithoutArticle_likesNestedInput = {
    create?: XOR<UsersCreateWithoutArticle_likesInput, UsersUncheckedCreateWithoutArticle_likesInput>
    connectOrCreate?: UsersCreateOrConnectWithoutArticle_likesInput
    upsert?: UsersUpsertWithoutArticle_likesInput
    connect?: UsersWhereUniqueInput
    update?: XOR<XOR<UsersUpdateToOneWithWhereWithoutArticle_likesInput, UsersUpdateWithoutArticle_likesInput>, UsersUncheckedUpdateWithoutArticle_likesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type ArticlesCreateWithoutCategoriesInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    users: UsersCreateNestedOneWithoutArticlesInput
    article_content_blocks?: ArticleContentBlocksCreateNestedManyWithoutArticlesInput
    article_likes?: ArticleLikesCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesUncheckedCreateWithoutCategoriesInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedCreateNestedManyWithoutArticlesInput
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesCreateOrConnectWithoutCategoriesInput = {
    where: ArticlesWhereUniqueInput
    create: XOR<ArticlesCreateWithoutCategoriesInput, ArticlesUncheckedCreateWithoutCategoriesInput>
  }

  export type ArticlesCreateManyCategoriesInputEnvelope = {
    data: ArticlesCreateManyCategoriesInput | ArticlesCreateManyCategoriesInput[]
    skipDuplicates?: boolean
  }

  export type ArticlesUpsertWithWhereUniqueWithoutCategoriesInput = {
    where: ArticlesWhereUniqueInput
    update: XOR<ArticlesUpdateWithoutCategoriesInput, ArticlesUncheckedUpdateWithoutCategoriesInput>
    create: XOR<ArticlesCreateWithoutCategoriesInput, ArticlesUncheckedCreateWithoutCategoriesInput>
  }

  export type ArticlesUpdateWithWhereUniqueWithoutCategoriesInput = {
    where: ArticlesWhereUniqueInput
    data: XOR<ArticlesUpdateWithoutCategoriesInput, ArticlesUncheckedUpdateWithoutCategoriesInput>
  }

  export type ArticlesUpdateManyWithWhereWithoutCategoriesInput = {
    where: ArticlesScalarWhereInput
    data: XOR<ArticlesUpdateManyMutationInput, ArticlesUncheckedUpdateManyWithoutCategoriesInput>
  }

  export type ArticlesScalarWhereInput = {
    AND?: ArticlesScalarWhereInput | ArticlesScalarWhereInput[]
    OR?: ArticlesScalarWhereInput[]
    NOT?: ArticlesScalarWhereInput | ArticlesScalarWhereInput[]
    id?: StringFilter<"Articles"> | string
    title?: StringFilter<"Articles"> | string
    summary?: StringNullableFilter<"Articles"> | string | null
    cover_url?: StringNullableFilter<"Articles"> | string | null
    category_id?: StringFilter<"Articles"> | string
    author_id?: StringFilter<"Articles"> | string
    author_name?: StringNullableFilter<"Articles"> | string | null
    author_avatar?: StringNullableFilter<"Articles"> | string | null
    tags?: StringNullableFilter<"Articles"> | string | null
    views?: IntFilter<"Articles"> | number
    likes?: IntFilter<"Articles"> | number
    comments_count?: IntFilter<"Articles"> | number
    is_top?: BoolFilter<"Articles"> | boolean
    read_time?: IntNullableFilter<"Articles"> | number | null
    published_at?: BigIntFilter<"Articles"> | bigint | number
    is_published?: BoolFilter<"Articles"> | boolean
    created_at?: BigIntFilter<"Articles"> | bigint | number
    updated_at?: BigIntFilter<"Articles"> | bigint | number
  }

  export type CategoriesCreateWithoutArticlesInput = {
    id: string
    name: string
    description?: string | null
    image_url?: string | null
    article_count?: number
    sort_order?: number | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type CategoriesUncheckedCreateWithoutArticlesInput = {
    id: string
    name: string
    description?: string | null
    image_url?: string | null
    article_count?: number
    sort_order?: number | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type CategoriesCreateOrConnectWithoutArticlesInput = {
    where: CategoriesWhereUniqueInput
    create: XOR<CategoriesCreateWithoutArticlesInput, CategoriesUncheckedCreateWithoutArticlesInput>
  }

  export type UsersCreateWithoutArticlesInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    refresh_tokens?: RefreshTokensCreateNestedManyWithoutUsersInput
    article_likes?: ArticleLikesCreateNestedManyWithoutUsersInput
  }

  export type UsersUncheckedCreateWithoutArticlesInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    refresh_tokens?: RefreshTokensUncheckedCreateNestedManyWithoutUsersInput
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type UsersCreateOrConnectWithoutArticlesInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutArticlesInput, UsersUncheckedCreateWithoutArticlesInput>
  }

  export type ArticleContentBlocksCreateWithoutArticlesInput = {
    id: string
    block_type: string
    content: string
    sort_order?: number
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticleContentBlocksUncheckedCreateWithoutArticlesInput = {
    id: string
    block_type: string
    content: string
    sort_order?: number
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticleContentBlocksCreateOrConnectWithoutArticlesInput = {
    where: ArticleContentBlocksWhereUniqueInput
    create: XOR<ArticleContentBlocksCreateWithoutArticlesInput, ArticleContentBlocksUncheckedCreateWithoutArticlesInput>
  }

  export type ArticleContentBlocksCreateManyArticlesInputEnvelope = {
    data: ArticleContentBlocksCreateManyArticlesInput | ArticleContentBlocksCreateManyArticlesInput[]
    skipDuplicates?: boolean
  }

  export type ArticleLikesCreateWithoutArticlesInput = {
    id: string
    created_at: bigint | number
    users: UsersCreateNestedOneWithoutArticle_likesInput
  }

  export type ArticleLikesUncheckedCreateWithoutArticlesInput = {
    id: string
    user_id: string
    created_at: bigint | number
  }

  export type ArticleLikesCreateOrConnectWithoutArticlesInput = {
    where: ArticleLikesWhereUniqueInput
    create: XOR<ArticleLikesCreateWithoutArticlesInput, ArticleLikesUncheckedCreateWithoutArticlesInput>
  }

  export type ArticleLikesCreateManyArticlesInputEnvelope = {
    data: ArticleLikesCreateManyArticlesInput | ArticleLikesCreateManyArticlesInput[]
    skipDuplicates?: boolean
  }

  export type CategoriesUpsertWithoutArticlesInput = {
    update: XOR<CategoriesUpdateWithoutArticlesInput, CategoriesUncheckedUpdateWithoutArticlesInput>
    create: XOR<CategoriesCreateWithoutArticlesInput, CategoriesUncheckedCreateWithoutArticlesInput>
    where?: CategoriesWhereInput
  }

  export type CategoriesUpdateToOneWithWhereWithoutArticlesInput = {
    where?: CategoriesWhereInput
    data: XOR<CategoriesUpdateWithoutArticlesInput, CategoriesUncheckedUpdateWithoutArticlesInput>
  }

  export type CategoriesUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    article_count?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type CategoriesUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    article_count?: IntFieldUpdateOperationsInput | number
    sort_order?: NullableIntFieldUpdateOperationsInput | number | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type UsersUpsertWithoutArticlesInput = {
    update: XOR<UsersUpdateWithoutArticlesInput, UsersUncheckedUpdateWithoutArticlesInput>
    create: XOR<UsersCreateWithoutArticlesInput, UsersUncheckedCreateWithoutArticlesInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutArticlesInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutArticlesInput, UsersUncheckedUpdateWithoutArticlesInput>
  }

  export type UsersUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    refresh_tokens?: RefreshTokensUpdateManyWithoutUsersNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutUsersNestedInput
  }

  export type UsersUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    refresh_tokens?: RefreshTokensUncheckedUpdateManyWithoutUsersNestedInput
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type ArticleContentBlocksUpsertWithWhereUniqueWithoutArticlesInput = {
    where: ArticleContentBlocksWhereUniqueInput
    update: XOR<ArticleContentBlocksUpdateWithoutArticlesInput, ArticleContentBlocksUncheckedUpdateWithoutArticlesInput>
    create: XOR<ArticleContentBlocksCreateWithoutArticlesInput, ArticleContentBlocksUncheckedCreateWithoutArticlesInput>
  }

  export type ArticleContentBlocksUpdateWithWhereUniqueWithoutArticlesInput = {
    where: ArticleContentBlocksWhereUniqueInput
    data: XOR<ArticleContentBlocksUpdateWithoutArticlesInput, ArticleContentBlocksUncheckedUpdateWithoutArticlesInput>
  }

  export type ArticleContentBlocksUpdateManyWithWhereWithoutArticlesInput = {
    where: ArticleContentBlocksScalarWhereInput
    data: XOR<ArticleContentBlocksUpdateManyMutationInput, ArticleContentBlocksUncheckedUpdateManyWithoutArticlesInput>
  }

  export type ArticleContentBlocksScalarWhereInput = {
    AND?: ArticleContentBlocksScalarWhereInput | ArticleContentBlocksScalarWhereInput[]
    OR?: ArticleContentBlocksScalarWhereInput[]
    NOT?: ArticleContentBlocksScalarWhereInput | ArticleContentBlocksScalarWhereInput[]
    id?: StringFilter<"ArticleContentBlocks"> | string
    article_id?: StringFilter<"ArticleContentBlocks"> | string
    block_type?: StringFilter<"ArticleContentBlocks"> | string
    content?: StringFilter<"ArticleContentBlocks"> | string
    sort_order?: IntFilter<"ArticleContentBlocks"> | number
    created_at?: BigIntFilter<"ArticleContentBlocks"> | bigint | number
    updated_at?: BigIntFilter<"ArticleContentBlocks"> | bigint | number
  }

  export type ArticleLikesUpsertWithWhereUniqueWithoutArticlesInput = {
    where: ArticleLikesWhereUniqueInput
    update: XOR<ArticleLikesUpdateWithoutArticlesInput, ArticleLikesUncheckedUpdateWithoutArticlesInput>
    create: XOR<ArticleLikesCreateWithoutArticlesInput, ArticleLikesUncheckedCreateWithoutArticlesInput>
  }

  export type ArticleLikesUpdateWithWhereUniqueWithoutArticlesInput = {
    where: ArticleLikesWhereUniqueInput
    data: XOR<ArticleLikesUpdateWithoutArticlesInput, ArticleLikesUncheckedUpdateWithoutArticlesInput>
  }

  export type ArticleLikesUpdateManyWithWhereWithoutArticlesInput = {
    where: ArticleLikesScalarWhereInput
    data: XOR<ArticleLikesUpdateManyMutationInput, ArticleLikesUncheckedUpdateManyWithoutArticlesInput>
  }

  export type ArticleLikesScalarWhereInput = {
    AND?: ArticleLikesScalarWhereInput | ArticleLikesScalarWhereInput[]
    OR?: ArticleLikesScalarWhereInput[]
    NOT?: ArticleLikesScalarWhereInput | ArticleLikesScalarWhereInput[]
    id?: StringFilter<"ArticleLikes"> | string
    article_id?: StringFilter<"ArticleLikes"> | string
    user_id?: StringFilter<"ArticleLikes"> | string
    created_at?: BigIntFilter<"ArticleLikes"> | bigint | number
  }

  export type UsersCreateWithoutRefresh_tokensInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesCreateNestedManyWithoutUsersInput
    article_likes?: ArticleLikesCreateNestedManyWithoutUsersInput
  }

  export type UsersUncheckedCreateWithoutRefresh_tokensInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesUncheckedCreateNestedManyWithoutUsersInput
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutUsersInput
  }

  export type UsersCreateOrConnectWithoutRefresh_tokensInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutRefresh_tokensInput, UsersUncheckedCreateWithoutRefresh_tokensInput>
  }

  export type UsersUpsertWithoutRefresh_tokensInput = {
    update: XOR<UsersUpdateWithoutRefresh_tokensInput, UsersUncheckedUpdateWithoutRefresh_tokensInput>
    create: XOR<UsersCreateWithoutRefresh_tokensInput, UsersUncheckedCreateWithoutRefresh_tokensInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutRefresh_tokensInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutRefresh_tokensInput, UsersUncheckedUpdateWithoutRefresh_tokensInput>
  }

  export type UsersUpdateWithoutRefresh_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateManyWithoutUsersNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutUsersNestedInput
  }

  export type UsersUncheckedUpdateWithoutRefresh_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUncheckedUpdateManyWithoutUsersNestedInput
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type ArticlesCreateWithoutUsersInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    categories: CategoriesCreateNestedOneWithoutArticlesInput
    article_content_blocks?: ArticleContentBlocksCreateNestedManyWithoutArticlesInput
    article_likes?: ArticleLikesCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesUncheckedCreateWithoutUsersInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    category_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedCreateNestedManyWithoutArticlesInput
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesCreateOrConnectWithoutUsersInput = {
    where: ArticlesWhereUniqueInput
    create: XOR<ArticlesCreateWithoutUsersInput, ArticlesUncheckedCreateWithoutUsersInput>
  }

  export type ArticlesCreateManyUsersInputEnvelope = {
    data: ArticlesCreateManyUsersInput | ArticlesCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokensCreateWithoutUsersInput = {
    id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint | number
    revoked?: boolean
    created_at: bigint | number
  }

  export type RefreshTokensUncheckedCreateWithoutUsersInput = {
    id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint | number
    revoked?: boolean
    created_at: bigint | number
  }

  export type RefreshTokensCreateOrConnectWithoutUsersInput = {
    where: RefreshTokensWhereUniqueInput
    create: XOR<RefreshTokensCreateWithoutUsersInput, RefreshTokensUncheckedCreateWithoutUsersInput>
  }

  export type RefreshTokensCreateManyUsersInputEnvelope = {
    data: RefreshTokensCreateManyUsersInput | RefreshTokensCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type ArticleLikesCreateWithoutUsersInput = {
    id: string
    created_at: bigint | number
    articles: ArticlesCreateNestedOneWithoutArticle_likesInput
  }

  export type ArticleLikesUncheckedCreateWithoutUsersInput = {
    id: string
    article_id: string
    created_at: bigint | number
  }

  export type ArticleLikesCreateOrConnectWithoutUsersInput = {
    where: ArticleLikesWhereUniqueInput
    create: XOR<ArticleLikesCreateWithoutUsersInput, ArticleLikesUncheckedCreateWithoutUsersInput>
  }

  export type ArticleLikesCreateManyUsersInputEnvelope = {
    data: ArticleLikesCreateManyUsersInput | ArticleLikesCreateManyUsersInput[]
    skipDuplicates?: boolean
  }

  export type ArticlesUpsertWithWhereUniqueWithoutUsersInput = {
    where: ArticlesWhereUniqueInput
    update: XOR<ArticlesUpdateWithoutUsersInput, ArticlesUncheckedUpdateWithoutUsersInput>
    create: XOR<ArticlesCreateWithoutUsersInput, ArticlesUncheckedCreateWithoutUsersInput>
  }

  export type ArticlesUpdateWithWhereUniqueWithoutUsersInput = {
    where: ArticlesWhereUniqueInput
    data: XOR<ArticlesUpdateWithoutUsersInput, ArticlesUncheckedUpdateWithoutUsersInput>
  }

  export type ArticlesUpdateManyWithWhereWithoutUsersInput = {
    where: ArticlesScalarWhereInput
    data: XOR<ArticlesUpdateManyMutationInput, ArticlesUncheckedUpdateManyWithoutUsersInput>
  }

  export type RefreshTokensUpsertWithWhereUniqueWithoutUsersInput = {
    where: RefreshTokensWhereUniqueInput
    update: XOR<RefreshTokensUpdateWithoutUsersInput, RefreshTokensUncheckedUpdateWithoutUsersInput>
    create: XOR<RefreshTokensCreateWithoutUsersInput, RefreshTokensUncheckedCreateWithoutUsersInput>
  }

  export type RefreshTokensUpdateWithWhereUniqueWithoutUsersInput = {
    where: RefreshTokensWhereUniqueInput
    data: XOR<RefreshTokensUpdateWithoutUsersInput, RefreshTokensUncheckedUpdateWithoutUsersInput>
  }

  export type RefreshTokensUpdateManyWithWhereWithoutUsersInput = {
    where: RefreshTokensScalarWhereInput
    data: XOR<RefreshTokensUpdateManyMutationInput, RefreshTokensUncheckedUpdateManyWithoutUsersInput>
  }

  export type RefreshTokensScalarWhereInput = {
    AND?: RefreshTokensScalarWhereInput | RefreshTokensScalarWhereInput[]
    OR?: RefreshTokensScalarWhereInput[]
    NOT?: RefreshTokensScalarWhereInput | RefreshTokensScalarWhereInput[]
    id?: StringFilter<"RefreshTokens"> | string
    user_id?: StringFilter<"RefreshTokens"> | string
    refresh_token?: StringFilter<"RefreshTokens"> | string
    client_ip?: StringFilter<"RefreshTokens"> | string
    expires_at?: BigIntFilter<"RefreshTokens"> | bigint | number
    revoked?: BoolFilter<"RefreshTokens"> | boolean
    created_at?: BigIntFilter<"RefreshTokens"> | bigint | number
  }

  export type ArticleLikesUpsertWithWhereUniqueWithoutUsersInput = {
    where: ArticleLikesWhereUniqueInput
    update: XOR<ArticleLikesUpdateWithoutUsersInput, ArticleLikesUncheckedUpdateWithoutUsersInput>
    create: XOR<ArticleLikesCreateWithoutUsersInput, ArticleLikesUncheckedCreateWithoutUsersInput>
  }

  export type ArticleLikesUpdateWithWhereUniqueWithoutUsersInput = {
    where: ArticleLikesWhereUniqueInput
    data: XOR<ArticleLikesUpdateWithoutUsersInput, ArticleLikesUncheckedUpdateWithoutUsersInput>
  }

  export type ArticleLikesUpdateManyWithWhereWithoutUsersInput = {
    where: ArticleLikesScalarWhereInput
    data: XOR<ArticleLikesUpdateManyMutationInput, ArticleLikesUncheckedUpdateManyWithoutUsersInput>
  }

  export type ArticlesCreateWithoutArticle_content_blocksInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    categories: CategoriesCreateNestedOneWithoutArticlesInput
    users: UsersCreateNestedOneWithoutArticlesInput
    article_likes?: ArticleLikesCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesUncheckedCreateWithoutArticle_content_blocksInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    category_id: string
    author_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    article_likes?: ArticleLikesUncheckedCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesCreateOrConnectWithoutArticle_content_blocksInput = {
    where: ArticlesWhereUniqueInput
    create: XOR<ArticlesCreateWithoutArticle_content_blocksInput, ArticlesUncheckedCreateWithoutArticle_content_blocksInput>
  }

  export type ArticlesUpsertWithoutArticle_content_blocksInput = {
    update: XOR<ArticlesUpdateWithoutArticle_content_blocksInput, ArticlesUncheckedUpdateWithoutArticle_content_blocksInput>
    create: XOR<ArticlesCreateWithoutArticle_content_blocksInput, ArticlesUncheckedCreateWithoutArticle_content_blocksInput>
    where?: ArticlesWhereInput
  }

  export type ArticlesUpdateToOneWithWhereWithoutArticle_content_blocksInput = {
    where?: ArticlesWhereInput
    data: XOR<ArticlesUpdateWithoutArticle_content_blocksInput, ArticlesUncheckedUpdateWithoutArticle_content_blocksInput>
  }

  export type ArticlesUpdateWithoutArticle_content_blocksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    categories?: CategoriesUpdateOneRequiredWithoutArticlesNestedInput
    users?: UsersUpdateOneRequiredWithoutArticlesNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateWithoutArticle_content_blocksInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    category_id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesCreateWithoutArticle_likesInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    categories: CategoriesCreateNestedOneWithoutArticlesInput
    users: UsersCreateNestedOneWithoutArticlesInput
    article_content_blocks?: ArticleContentBlocksCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesUncheckedCreateWithoutArticle_likesInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    category_id: string
    author_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedCreateNestedManyWithoutArticlesInput
  }

  export type ArticlesCreateOrConnectWithoutArticle_likesInput = {
    where: ArticlesWhereUniqueInput
    create: XOR<ArticlesCreateWithoutArticle_likesInput, ArticlesUncheckedCreateWithoutArticle_likesInput>
  }

  export type UsersCreateWithoutArticle_likesInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesCreateNestedManyWithoutUsersInput
    refresh_tokens?: RefreshTokensCreateNestedManyWithoutUsersInput
  }

  export type UsersUncheckedCreateWithoutArticle_likesInput = {
    id: string
    username: string
    password_hash: string
    password_algorithm?: string | null
    email?: string | null
    nickname?: string | null
    avatar?: string | null
    is_active?: boolean
    created_at: bigint | number
    updated_at: bigint | number
    articles?: ArticlesUncheckedCreateNestedManyWithoutUsersInput
    refresh_tokens?: RefreshTokensUncheckedCreateNestedManyWithoutUsersInput
  }

  export type UsersCreateOrConnectWithoutArticle_likesInput = {
    where: UsersWhereUniqueInput
    create: XOR<UsersCreateWithoutArticle_likesInput, UsersUncheckedCreateWithoutArticle_likesInput>
  }

  export type ArticlesUpsertWithoutArticle_likesInput = {
    update: XOR<ArticlesUpdateWithoutArticle_likesInput, ArticlesUncheckedUpdateWithoutArticle_likesInput>
    create: XOR<ArticlesCreateWithoutArticle_likesInput, ArticlesUncheckedCreateWithoutArticle_likesInput>
    where?: ArticlesWhereInput
  }

  export type ArticlesUpdateToOneWithWhereWithoutArticle_likesInput = {
    where?: ArticlesWhereInput
    data: XOR<ArticlesUpdateWithoutArticle_likesInput, ArticlesUncheckedUpdateWithoutArticle_likesInput>
  }

  export type ArticlesUpdateWithoutArticle_likesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    categories?: CategoriesUpdateOneRequiredWithoutArticlesNestedInput
    users?: UsersUpdateOneRequiredWithoutArticlesNestedInput
    article_content_blocks?: ArticleContentBlocksUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateWithoutArticle_likesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    category_id?: StringFieldUpdateOperationsInput | string
    author_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedUpdateManyWithoutArticlesNestedInput
  }

  export type UsersUpsertWithoutArticle_likesInput = {
    update: XOR<UsersUpdateWithoutArticle_likesInput, UsersUncheckedUpdateWithoutArticle_likesInput>
    create: XOR<UsersCreateWithoutArticle_likesInput, UsersUncheckedCreateWithoutArticle_likesInput>
    where?: UsersWhereInput
  }

  export type UsersUpdateToOneWithWhereWithoutArticle_likesInput = {
    where?: UsersWhereInput
    data: XOR<UsersUpdateWithoutArticle_likesInput, UsersUncheckedUpdateWithoutArticle_likesInput>
  }

  export type UsersUpdateWithoutArticle_likesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateManyWithoutUsersNestedInput
    refresh_tokens?: RefreshTokensUpdateManyWithoutUsersNestedInput
  }

  export type UsersUncheckedUpdateWithoutArticle_likesInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    password_algorithm?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    is_active?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUncheckedUpdateManyWithoutUsersNestedInput
    refresh_tokens?: RefreshTokensUncheckedUpdateManyWithoutUsersNestedInput
  }

  export type ArticlesCreateManyCategoriesInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    author_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticlesUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    users?: UsersUpdateOneRequiredWithoutArticlesNestedInput
    article_content_blocks?: ArticleContentBlocksUpdateManyWithoutArticlesNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedUpdateManyWithoutArticlesNestedInput
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateManyWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleContentBlocksCreateManyArticlesInput = {
    id: string
    block_type: string
    content: string
    sort_order?: number
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type ArticleLikesCreateManyArticlesInput = {
    id: string
    user_id: string
    created_at: bigint | number
  }

  export type ArticleContentBlocksUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleContentBlocksUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleContentBlocksUncheckedUpdateManyWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    block_type?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    sort_order?: IntFieldUpdateOperationsInput | number
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    users?: UsersUpdateOneRequiredWithoutArticle_likesNestedInput
  }

  export type ArticleLikesUncheckedUpdateWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesUncheckedUpdateManyWithoutArticlesInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticlesCreateManyUsersInput = {
    id: string
    title: string
    summary?: string | null
    cover_url?: string | null
    category_id: string
    author_name?: string | null
    author_avatar?: string | null
    tags?: string | null
    views?: number
    likes?: number
    comments_count?: number
    is_top?: boolean
    read_time?: number | null
    published_at: bigint | number
    is_published?: boolean
    created_at: bigint | number
    updated_at: bigint | number
  }

  export type RefreshTokensCreateManyUsersInput = {
    id: string
    refresh_token: string
    client_ip: string
    expires_at: bigint | number
    revoked?: boolean
    created_at: bigint | number
  }

  export type ArticleLikesCreateManyUsersInput = {
    id: string
    article_id: string
    created_at: bigint | number
  }

  export type ArticlesUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    categories?: CategoriesUpdateOneRequiredWithoutArticlesNestedInput
    article_content_blocks?: ArticleContentBlocksUpdateManyWithoutArticlesNestedInput
    article_likes?: ArticleLikesUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    category_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
    article_content_blocks?: ArticleContentBlocksUncheckedUpdateManyWithoutArticlesNestedInput
    article_likes?: ArticleLikesUncheckedUpdateManyWithoutArticlesNestedInput
  }

  export type ArticlesUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    cover_url?: NullableStringFieldUpdateOperationsInput | string | null
    category_id?: StringFieldUpdateOperationsInput | string
    author_name?: NullableStringFieldUpdateOperationsInput | string | null
    author_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    likes?: IntFieldUpdateOperationsInput | number
    comments_count?: IntFieldUpdateOperationsInput | number
    is_top?: BoolFieldUpdateOperationsInput | boolean
    read_time?: NullableIntFieldUpdateOperationsInput | number | null
    published_at?: BigIntFieldUpdateOperationsInput | bigint | number
    is_published?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    updated_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type RefreshTokensUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type RefreshTokensUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type RefreshTokensUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    refresh_token?: StringFieldUpdateOperationsInput | string
    client_ip?: StringFieldUpdateOperationsInput | string
    expires_at?: BigIntFieldUpdateOperationsInput | bigint | number
    revoked?: BoolFieldUpdateOperationsInput | boolean
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
    articles?: ArticlesUpdateOneRequiredWithoutArticle_likesNestedInput
  }

  export type ArticleLikesUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }

  export type ArticleLikesUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    article_id?: StringFieldUpdateOperationsInput | string
    created_at?: BigIntFieldUpdateOperationsInput | bigint | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}