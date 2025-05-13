const PIPELINE_STEP_DB_NAME = "pipeline_step_db"
const PIPELINE_STEP_DB_VERSION = 1

async function PipelineStepDB() {
    return new Promise<IDBDatabase | undefined>((resolve, reject) => {
        const request = indexedDB.open(PIPELINE_STEP_DB_NAME, PIPELINE_STEP_DB_VERSION)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(PIPELINE_STEP_DB_NAME)) {
                db.createObjectStore(PIPELINE_STEP_DB_NAME, { keyPath: "id" })
            }
        }
        request.onsuccess = () => {
            const db = request.result
            resolve(db)
        }
        request.onerror = (event) => {
            console.error("Error opening step database:", event)
            reject(event)
        }
    });
}

export class StepDbManager {
    stepDB: IDBDatabase
    constructor() {
        this.stepDB = null as unknown as IDBDatabase
        this.init()
    }

    private async init() {
        const stepDB = await PipelineStepDB()
        if (!stepDB) {
            throw new Error("Failed to open database pipeline_step_db")
        }
        this.stepDB = stepDB
    }
}