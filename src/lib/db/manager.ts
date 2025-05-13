import { ConverterDBManager } from "./converter";
import { PipelineDbManager } from "./pipeline";
import { StepDbManager } from "./pipeline_step";

class DbManager {
  readonly converter: ConverterDBManager;
  readonly pipeline: PipelineDbManager;
  readonly step: StepDbManager;

  constructor() {
    this.converter = new ConverterDBManager();
    this.pipeline = new PipelineDbManager();
    this.step = new StepDbManager();
  }
}

export const DatabaseManager = new DbManager();
