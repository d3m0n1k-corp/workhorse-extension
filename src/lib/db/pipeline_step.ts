import { PipelineStepDbObject } from "../objects";

const PIPELINE_STEP_DB_NAME = "pipeline_step_db";
const PIPELINE_STEP_DB_VERSION = 1;
const RO = "readonly";
const PIPELINE_ID_INDEX = "pipeline_id";

async function PipelineStepDB() {
  return new Promise<IDBDatabase | undefined>((resolve, reject) => {
    const request = indexedDB.open(
      PIPELINE_STEP_DB_NAME,
      PIPELINE_STEP_DB_VERSION,
    );
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PIPELINE_STEP_DB_NAME)) {
        db.createObjectStore(PIPELINE_STEP_DB_NAME, {
          keyPath: "id",
        }).createIndex(PIPELINE_ID_INDEX, PIPELINE_ID_INDEX, { unique: false });
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
    request.onerror = (event) => {
      console.error("Error opening step database:", event);
      reject(event);
    };
  });
}

export class StepDbManager {
  stepDB: IDBDatabase;

  constructor() {
    this.stepDB = null as unknown as IDBDatabase;
    this.init();
  }

  private async init() {
    const stepDB = await PipelineStepDB();
    if (!stepDB) {
      throw new Error("Failed to open database pipeline_step_db");
    }
    this.stepDB = stepDB;
  }

  public async listSteps(offset: number, size: number) {
    return new Promise<PipelineStepDbObject[]>((resolve, reject) => {
      const store = this.stepDB
        .transaction(PIPELINE_STEP_DB_NAME, RO)
        .objectStore(PIPELINE_STEP_DB_NAME);

      const result: PipelineStepDbObject[] = [];
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
          return;
        }

        if (collected < size) {
          result.push(cursor.value);
          collected++;
        }

        cursor.continue();
      };

      request.onerror = (event) => {
        console.error("Error listing steps:", event);
        reject(event);
      };
    });
  }

  public async countSteps(pipeline_id: IDBValidKey) {
    return new Promise<number>((resolve, reject) => {
      const store = this.stepDB
        .transaction(PIPELINE_STEP_DB_NAME, RO)
        .objectStore(PIPELINE_STEP_DB_NAME);

      const index = store.index(PIPELINE_ID_INDEX);
      const request = index.count(IDBKeyRange.only(pipeline_id));

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error("Error counting steps:", event);
        reject(event);
      };
    });
  }

  public async createSteps(steps: PipelineStepDbObject[]) {
    return new Promise<void>((resolve, reject) => {
      const store = this.stepDB
        .transaction(PIPELINE_STEP_DB_NAME, "readwrite")
        .objectStore(PIPELINE_STEP_DB_NAME);

      const requests = steps.map((step) => {
        return new Promise<void>((res, rej) => {
          const request = store.add(step);
          request.onsuccess = () => res();
          request.onerror = (event) => {
            console.error("Error creating step:", event);
            rej(event);
          };
        });
      });

      Promise.all(requests)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }

  public async getSteps(pipelineId: string) {
    return new Promise<PipelineStepDbObject[]>((resolve, reject) => {
      const store = this.stepDB
        .transaction(PIPELINE_STEP_DB_NAME, RO)
        .objectStore(PIPELINE_STEP_DB_NAME);

      const index = store.index(PIPELINE_ID_INDEX);
      const result: PipelineStepDbObject[] = [];

      const request = index.openCursor(IDBKeyRange.only(pipelineId));

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) {
          return resolve(result);
        }

        result.push(cursor.value);
        cursor.continue();
      };

      request.onerror = (event) => {
        console.error("Error getting steps:", event);
        reject(event);
      };
    });
  }

  async deleteSteps(pipeline_id: string) {
    return await new Promise<void>((resolve, reject) => {
      const store = this.stepDB
        .transaction(PIPELINE_STEP_DB_NAME, "readwrite")
        .objectStore(PIPELINE_STEP_DB_NAME);

      const index = store.index(PIPELINE_ID_INDEX);
      const request = index.openCursor(IDBKeyRange.only(pipeline_id));
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) {
          return resolve();
        }

        const deleteRequest = cursor.delete();
        deleteRequest.onsuccess = () => {
          cursor.continue();
        };
        deleteRequest.onerror = (event) => {
          console.error("Error deleting step:", event);
          reject(event);
        };
      };
      request.onerror = (event) => {
        console.error("Error deleting steps:", event);
        reject(event);
      };
    });
  }
}
