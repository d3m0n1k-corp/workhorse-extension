const PIPELINE_DB_NAME = "pipeline_db"
const PIPELINE_DB_VERSION = 1

async function PipelineDB() {
    return new Promise<IDBDatabase | undefined>((resolve, reject) => {
        const request = indexedDB.open(PIPELINE_DB_NAME, PIPELINE_DB_VERSION)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(PIPELINE_DB_NAME)) {
                db.createObjectStore(PIPELINE_DB_NAME, { keyPath: "id" })
            }
        }
        request.onsuccess = () => {
            const db = request.result
            resolve(db)
        }
        request.onerror = (event) => {
            console.error("Error opening pipeline database:", event)
            reject(event)
        }
    });
}

export class PipelineDbManager {
    pipelineDB: IDBDatabase
    constructor() {
        this.pipelineDB = null as unknown as IDBDatabase
        this.init()
    }

    private async init() {
        const pipelineDB = await PipelineDB()
        if (!pipelineDB) {
            throw new Error("Failed to open database pipeline_db")
        }
        this.pipelineDB = pipelineDB
    }
}