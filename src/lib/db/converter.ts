const RO = "readonly";
const RW = "readwrite";

const CONVERTER_DB_NAME = "converter_db";
const CONVERTER_DB_VERSION = 1;

async function ConverterDB() {
  return new Promise<IDBDatabase | undefined>((resolve, reject) => {
    const request = indexedDB.open(CONVERTER_DB_NAME, CONVERTER_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CONVERTER_DB_NAME)) {
        db.createObjectStore(CONVERTER_DB_NAME, { keyPath: "name" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
    request.onerror = (event) => {
      console.error("Error opening converter database:", event);
      reject(event);
    };
  });
}

export class ConverterDBManager {
  converterDB: IDBDatabase;
  constructor() {
    this.converterDB = null as unknown as IDBDatabase;
    this.init();
  }

  private async init() {
    const converterDB = await ConverterDB();
    if (!converterDB) {
      throw new Error("Failed to open database converter_db");
    }
    this.converterDB = converterDB;
  }

  async getConverterDefinition(name: string) {
    return new Promise<Converter>((resolve, reject) => {
      const store = this.converterDB
        .transaction(CONVERTER_DB_NAME, RO)
        .objectStore(CONVERTER_DB_NAME);

      const request = store.get(name);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        console.error("Error getting converter definition:", event);
        reject(event);
      };
    });
  }

  async listConverterDefinitions() {
    return new Promise<Converter[]>((resolve, reject) => {
      const store = this.converterDB
        .transaction(CONVERTER_DB_NAME, RO)
        .objectStore(CONVERTER_DB_NAME);

      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        console.error("Error listing converter definitions:", event);
        reject(event);
      };
    });
  }

  async getFirstConverterDefinition() {
    return new Promise<Converter>((resolve, reject) => {
      const store = this.converterDB
        .transaction(CONVERTER_DB_NAME, RO)
        .objectStore(CONVERTER_DB_NAME);

      const request = store.getAllKeys();
      request.onsuccess = () => {
        if (request.result.length > 0) {
          const firstKey = request.result[0];
          const getRequest = store.get(firstKey);
          getRequest.onsuccess = () => {
            resolve(getRequest.result);
          };
          getRequest.onerror = (event) => {
            console.error("Error getting first converter definition:", event);
            reject(event);
          };
        } else {
          resolve(null as unknown as Converter);
        }
      };
      request.onerror = (event) => {
        console.error("Error getting first converter definition:", event);
        reject(event);
      };
    });
  }

  async listConverterNames() {
    return new Promise<string[]>((resolve, reject) => {
      const store = this.converterDB
        .transaction(CONVERTER_DB_NAME, RO)
        .objectStore(CONVERTER_DB_NAME);

      const request = store.getAllKeys();
      request.onsuccess = () => {
        resolve(request.result as string[]);
      };
      request.onerror = (event) => {
        console.error("Error listing converter names:", event);
        reject(event);
      };
    });
  }

  async overwriteConverterDefinition(converters: Converter[]) {
    return new Promise<void>((resolve, reject) => {
      this.clearConverterDefinition();
      const addRequests = converters.map((converter) => {
        return this.addConverterDefinition(converter);
      });
      Promise.all(addRequests)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error("Error overwriting converter definitions:", error);
          reject(error);
        });
    });
  }

  async addConverterDefinition(converter: Converter) {
    return new Promise<void>((resolve, reject) => {
      const store = this.converterDB
        .transaction(CONVERTER_DB_NAME, RW)
        .objectStore(CONVERTER_DB_NAME);

      const request = store.put(converter);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (event) => {
        console.error("Error adding converter definition:", event);
        reject(event);
      };
    });
  }

  async clearConverterDefinition() {
    return new Promise<void>((resolve, reject) => {
      const store = this.converterDB
        .transaction(CONVERTER_DB_NAME, RW)
        .objectStore(CONVERTER_DB_NAME);

      const request = store.clear();
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (event) => {
        console.error("Error clearing converter definitions:", event);
        reject(event);
      };
    });
  }
}
