import { PipelineDbObject } from "../objects";

const PIPELINE_DB_NAME = "pipeline_db";
const PIPELINE_DB_VERSION = 1;

const RO = "readonly";

async function PipelineDB() {
  return new Promise<IDBDatabase | undefined>((resolve, reject) => {
    const request = indexedDB.open(PIPELINE_DB_NAME, PIPELINE_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PIPELINE_DB_NAME)) {
        db.createObjectStore(PIPELINE_DB_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
    request.onerror = (event) => {
      console.error("Error opening pipeline database:", event);
      reject(event);
    };
  });
}

export class PipelineDbManager {
  pipelineDB: IDBDatabase;

  constructor() {
    this.pipelineDB = null as unknown as IDBDatabase;
    this.init();
  }

  private async init() {
    const pipelineDB = await PipelineDB();
    if (!pipelineDB) {
      throw new Error("Failed to open database pipeline_db");
    }
    this.pipelineDB = pipelineDB;
  }

  async listPipelines(offset: number, size: number) {
    return new Promise<PipelineDbObject[]>((resolve, reject) => {
      const store = this.pipelineDB
        .transaction(PIPELINE_DB_NAME, RO)
        .objectStore(PIPELINE_DB_NAME);

      const result: PipelineDbObject[] = [];
      let skipped = 0;
      let collected = 0;

      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) {
          return resolve(result);
        }

        if (skipped < offset) {
          skipped++;
          cursor.continue();
        } else if (collected < size) {
          result.push(cursor.value as PipelineDbObject);
          collected++;
          cursor.continue();
        } else {
          resolve(result);
        }
      };

      request.onerror = (event) => {
        console.error("Error getting paginated pipeline definitions:", event);
        reject(event);
      };
    });
  }

  async createPipeline(pipeline: PipelineDbObject) {
    return new Promise<void>((resolve, reject) => {
      const store = this.pipelineDB
        .transaction(PIPELINE_DB_NAME, "readwrite")
        .objectStore(PIPELINE_DB_NAME);

      const request = store.add(pipeline);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (event) => {
        console.error("Error creating pipeline definition:", event);
        reject(event);
      };
    });
  }

  async getPipeline(id: string) {
    return new Promise<PipelineDbObject | undefined>((resolve, reject) => {
      const store = this.pipelineDB
        .transaction(PIPELINE_DB_NAME, RO)
        .objectStore(PIPELINE_DB_NAME);

      const request = store.get(id);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (event) => {
        console.error("Error getting pipeline definition:", event);
        reject(event);
      };
    });
  }

  async deletePipeline(id: string) {
    return await new Promise<void>((resolve, reject) => {
      const store = this.pipelineDB
        .transaction(PIPELINE_DB_NAME, "readwrite")
        .objectStore(PIPELINE_DB_NAME);

      const request = store.delete(id);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = (event) => {
        console.error("Error deleting pipeline definition:", event);
        reject(event);
      };
    });
  }
}
