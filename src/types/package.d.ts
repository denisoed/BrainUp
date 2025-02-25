declare module '*/package.json' {
  interface PackageJson {
    version: string;
    name: string;
    // другие поля, если нужны
  }
  const value: PackageJson;
  export default value;
} 